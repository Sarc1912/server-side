import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual, LessThan } from 'typeorm';
import { User } from '../../entities/User';
import { ActiveLoan, LoanStatus } from '../../entities/ActiveLoan';
import { ApplicationStatus, LoanApplication } from '../../entities/LoanApplication';
import { PaymentRecord } from '../../entities/PaymentRecord';
import { Product } from '../../entities/Product';
import { InstallmentStatus, LoanScheduleItem } from '../../entities/LoanScheduleItem';

// Importa tus entidades reales aquí


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

      overdueLoans
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

      // Préstamos Vencidos (cuotas pasadas no pagadas)
      this.scheduleRepo.count({ where: { paidAt: LessThan(now), status: InstallmentStatus.UNPAID } }),
    ]);

    // 2. Calcular los ingresos (TypeORM QueryBuilder es más seguro para sumas monetarias)
    const { sumThisMonth } = await this.paymentRepo
      .createQueryBuilder('payment')
      .select('SUM(payment.amountPaid)', 'sumThisMonth')
      .where('payment.createdAt >= :start', { start: startOfCurrentMonth })
      // Opcional: filtrar por pagos exitosos
      // .andWhere('payment.status = :status', { status: 'completed' })
      .getRawOne();

    const { sumLastMonth } = await this.paymentRepo
      .createQueryBuilder('payment')
      .select('SUM(payment.amountPaid)', 'sumLastMonth')
      .where('payment.createdAt BETWEEN :start AND :end', {
        start: startOfLastMonth,
        end: endOfLastMonth
      })
      .getRawOne();

    const monthlyRevenue = parseFloat(sumThisMonth) || 0;
    const lastMonthRevenue = parseFloat(sumLastMonth) || 0;

    // 3. Generar porcentajes y formatear respuesta
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

      overdueLoans,
      // Aquí podrías calcular "2 más que ayer" si guardas un historial, o dejarlo simple:
      overdueTrend: { value: overdueLoans, isUp: false, text: 'Revisar urgentes' }
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