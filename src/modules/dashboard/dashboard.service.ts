import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual } from 'typeorm';
import { User } from '../../entities/User';
import { ActiveLoan, LoanStatus } from '../../entities/ActiveLoan';
import { ApplicationStatus, LoanApplication } from '../../entities/LoanApplication';
import { PaymentRecord, PaymentStatus } from '../../entities/PaymentRecord';
import { Product } from '../../entities/Product';
import { InstallmentStatus, LoanScheduleItem } from '../../entities/LoanScheduleItem';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(ActiveLoan) private activeLoanRepo: Repository<ActiveLoan>,
    @InjectRepository(LoanApplication) private loanAppRepo: Repository<LoanApplication>,
    @InjectRepository(PaymentRecord) private paymentRepo: Repository<PaymentRecord>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(LoanScheduleItem) private scheduleRepo: Repository<LoanScheduleItem>,
  ) { }

  async getDashboardStats() {
    const now = new Date();

    // Límites de tiempo para cálculos
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    // Para calcular "nuevas de hoy"
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // 1. Ejecutar todas las consultas en paralelo
    const [
      totalUsers,
      usersThisMonth,
      usersLastMonth,

      activeLoans,
      activeLoansThisMonth,
      activeLoansLastMonth,

      pendingApplications,
      applicationsToday,

      totalProducts,
      productsThisMonth,

      activeLoanIds
    ] = await Promise.all([
      // Usuarios
      this.userRepo.count(),
      this.userRepo.count({ where: { createdAt: MoreThanOrEqual(startOfCurrentMonth) } }),
      this.userRepo.count({ where: { createdAt: Between(startOfLastMonth, endOfLastMonth) } }),

      // Préstamos Activos
      this.activeLoanRepo.count({ where: { loanStatus: LoanStatus.ACTIVE } }),
      this.activeLoanRepo.count({ where: { loanStatus: LoanStatus.ACTIVE, createdAt: MoreThanOrEqual(startOfCurrentMonth) } }),
      this.activeLoanRepo.count({ where: { loanStatus: LoanStatus.ACTIVE, createdAt: Between(startOfLastMonth, endOfLastMonth) } }),

      // Solicitudes Pendientes
      this.loanAppRepo.count({ where: { status: ApplicationStatus.PENDING } }),
      this.loanAppRepo.count({ where: { status: ApplicationStatus.PENDING, appliedAt: MoreThanOrEqual(startOfToday) } }),

      // Productos
      this.productRepo.count(),
      this.productRepo.count({ where: { createdAt: MoreThanOrEqual(startOfCurrentMonth) } }),

      // IDs de préstamos activos (para el estado de cartera)
      this.activeLoanRepo.find({ select: { id: true }, where: { loanStatus: LoanStatus.ACTIVE } }),
    ]);

    // 2. Calcular los ingresos (pagos completados)
    const { sumThisMonth } = await this.paymentRepo
      .createQueryBuilder('payment')
      .select('SUM(payment.amountPaid)', 'sumThisMonth')
      .where('payment.createdAt >= :start', { start: startOfCurrentMonth })
      .andWhere('payment.paymentStatus = :status', { status: PaymentStatus.COMPLETED })
      .getRawOne();

    const { sumLastMonth } = await this.paymentRepo
      .createQueryBuilder('payment')
      .select('SUM(payment.amountPaid)', 'sumLastMonth')
      .where('payment.createdAt BETWEEN :start AND :end', {
        start: startOfLastMonth,
        end: endOfLastMonth
      })
      .andWhere('payment.paymentStatus = :status', { status: PaymentStatus.COMPLETED })
      .getRawOne();

    const monthlyRevenue = parseFloat(sumThisMonth) || 0;
    const lastMonthRevenue = parseFloat(sumLastMonth) || 0;

    // 3. Estado de cartera (información real)
    const portfolio = await this.buildPortfolioStats(activeLoanIds.map(l => l.id));

    // 4. Generar porcentajes y formatear respuesta
    return {
      totalUsers,
      userTrend: this.calculateTrend(usersThisMonth, usersLastMonth, 'este mes'),

      activeLoans,
      activeLoanTrend: this.calculateTrend(activeLoansThisMonth, activeLoansLastMonth, 'vs mes anterior'),

      pendingApplications,
      applicationsTrend: { value: applicationsToday, isUp: applicationsToday > 0, text: `${applicationsToday} nuevas hoy` },

      monthlyRevenue,
      revenueTrend: this.calculateTrend(monthlyRevenue, lastMonthRevenue, 'vs mes anterior'),

      totalProducts,
      productTrend: { value: productsThisMonth, isUp: productsThisMonth > 0, text: `${productsThisMonth} nuevos` },

      overdueLoans: portfolio.lateLoans + portfolio.overdueLoans,
      overdueTrend: {
        value: portfolio.avgDaysLate,
        isUp: portfolio.avgDaysLate === 0,
        text: portfolio.avgDaysLate > 0 ? `${portfolio.avgDaysLate} días promedio de atraso` : 'Cartera al día',
      },

      portfolio,
    };
  }

  /**
   * Calcula el estado real de la cartera a partir de los préstamos activos
   * y sus cuotas (loan_schedule_items).
   */
  private async buildPortfolioStats(activeLoanIds: number[]) {
    const ids = activeLoanIds;
    if (ids.length === 0) {
      return {
        totalLoans: 0,
        totalPrincipal: 0,
        totalBalance: 0,
        totalCollected: 0,
        onTimeLoans: 0,
        lateLoans: 0,
        overdueLoans: 0,
        onTimePercent: 0,
        latePercent: 0,
        overduePercent: 0,
        avgDaysLate: 0,
        recoveryRate: 0,
        avgCreditScore: 0,
      };
    }

    const [totals, scheduleTotals, avgCredit] = await Promise.all([
      // Montos globales de la cartera
      this.activeLoanRepo
        .createQueryBuilder('loan')
        .select('COUNT(loan.id)', 'totalLoans')
        .addSelect('COALESCE(SUM(loan.principalAmount), 0)', 'totalPrincipal')
        .addSelect('COALESCE(SUM(loan.remainingBalance), 0)', 'totalBalance')
        .where('loan.loanStatus = :status', { status: LoanStatus.ACTIVE })
        .getRawOne(),

      // Montos programados vs pagados (para la tasa de recuperación)
      this.scheduleRepo
        .createQueryBuilder('item')
        .select('COALESCE(SUM(item.amountDue), 0)', 'totalDue')
        .addSelect('COALESCE(SUM(item.amountPaid), 0)', 'totalPaid')
        .where('item.loanId IN (:...ids)', { ids })
        .getRawOne(),

      // Score de crédito promedio de clientes con préstamo activo
      this.userRepo
        .createQueryBuilder('user')
        .innerJoin('user.loans', 'loan')
        .where('loan.loanStatus = :status', { status: LoanStatus.ACTIVE })
        .select('COALESCE(AVG(user.creditScore), 0)', 'avg')
        .getRawOne(),
    ]);

    // Cuotas abiertas (no pagadas) de la cartera para medir días de atraso
    const openItems = await this.scheduleRepo
      .createQueryBuilder('item')
      .select('item.loanId', 'loanId')
      .addSelect('item.dueDate', 'dueDate')
      .where('item.loanId IN (:...ids)', { ids })
      .andWhere('item.status != :paid', { paid: InstallmentStatus.PAID })
      .getRawMany();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Días de atraso máximos por préstamo
    const daysLateByLoan = new Map<number, number>();
    for (const item of openItems) {
      const due = new Date(`${item.dueDate}T00:00:00`);
      const days = Math.floor((today.getTime() - due.getTime()) / 86400000);
      if (!Number.isFinite(days) || days <= 0) continue;
      const loanId = Number(item.loanId);
      const current = daysLateByLoan.get(loanId) ?? 0;
      if (days > current) daysLateByLoan.set(loanId, days);
    }

    let lateLoans = 0;
    let overdueLoans = 0;
    let daysLateSum = 0;
    daysLateByLoan.forEach((days) => {
      daysLateSum += days;
      if (days < 30) lateLoans += 1;
      else overdueLoans += 1;
    });

    const totalLoans = ids.length;
    const onTimeLoans = totalLoans - daysLateByLoan.size;
    const totalPrincipal = parseFloat(totals.totalPrincipal) || 0;
    const totalBalance = parseFloat(totals.totalBalance) || 0;
    const totalDue = parseFloat(scheduleTotals.totalDue) || 0;
    const totalPaid = parseFloat(scheduleTotals.totalPaid) || 0;

    const percent = (n: number) =>
      totalLoans > 0 ? Number(((n / totalLoans) * 100).toFixed(1)) : 0;

    return {
      totalLoans,
      totalPrincipal,
      totalBalance,
      totalCollected: Number((totalPrincipal - totalBalance).toFixed(2)),
      onTimeLoans,
      lateLoans,
      overdueLoans,
      onTimePercent: percent(onTimeLoans),
      latePercent: percent(lateLoans),
      overduePercent: percent(overdueLoans),
      avgDaysLate: daysLateByLoan.size > 0 ? Math.round(daysLateSum / daysLateByLoan.size) : 0,
      recoveryRate: totalDue > 0 ? Number(((totalPaid / totalDue) * 100).toFixed(1)) : 0,
      avgCreditScore: Math.round(parseFloat(avgCredit.avg) || 0),
    };
  }

  // Utilidad para calcular el porcentaje sin errores de división por cero
  private calculateTrend(current: number, previous: number, suffix: string) {
    let percentage = 0;
    if (previous === 0) {
      percentage = current > 0 ? 100 : 0;
    } else {
      percentage = Number((((current - previous) / previous) * 100).toFixed(1));
    }

    return {
      value: percentage,
      isUp: percentage >= 0,
      text: `${Math.abs(percentage)}% ${suffix}`
    };
  }
}
