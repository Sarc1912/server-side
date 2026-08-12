import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLoanApplicationDto } from './dto/create-loan-application.dto';
import { UpdateLoanApplicationDto } from './dto/update-loan-application.dto';
import {
  ApplicationStatus,
  LoanApplication,
} from '../../entities/LoanApplication';
import { FinancingPlan } from '../../entities/FinancingPlan';
import { LoanApplicationItem } from '../../entities/LoanApplicationItem';
import { Product, ProductStatus } from '../../entities/Product';
import { User } from '../../entities/User';
import {
  ActiveLoan,
  LoanStatus,
} from '../../entities/ActiveLoan';
import {
  InstallmentStatus,
  LoanScheduleItem,
} from '../../entities/LoanScheduleItem';
import { AuditLog } from '../../entities/AuditLog';
import { UserRoles } from '../../enums/users/user.roles';

@Injectable()
export class LoanApplicationsService {
  constructor(
    @InjectRepository(LoanApplication)
    private readonly loanAppRepo: Repository<LoanApplication>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(FinancingPlan)
    private readonly financingPlanRepo: Repository<FinancingPlan>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(LoanApplicationItem)
    private readonly loanAppItemRepo: Repository<LoanApplicationItem>,
    @InjectRepository(ActiveLoan)
    private readonly activeLoanRepo: Repository<ActiveLoan>,
    @InjectRepository(LoanScheduleItem)
    private readonly scheduleRepo: Repository<LoanScheduleItem>,
    @InjectRepository(AuditLog)
    private readonly auditLogRepo: Repository<AuditLog>,
  ) {}

  private readonly relations = {
    user: true,
    financingPlan: { product: true },
    activeLoan: true,
    documents: true,
    items: { product: true },
  };

  async create(createLoanApplicationDto: CreateLoanApplicationDto) {
    const { userId, financingPlanId, items, applicant } = createLoanApplicationDto;

    const plan = await this.financingPlanRepo.findOne({
      where: { id: financingPlanId, isActive: true },
      relations: { product: true },
    });
    if (!plan) {
      throw new NotFoundException(
        `Plan de financiamiento con ID ${financingPlanId} no encontrado o inactivo`,
      );
    }

    // Resolver los productos del préstamo (varios productos bajo un mismo plan)
    let applicationItems: { product: Product; quantity: number }[] = [];
    if (items && items.length > 0) {
      for (const item of items) {
        const product = await this.productRepo.findOne({
          where: { id: item.productId, status: ProductStatus.ACTIVE },
        });
        if (!product) {
          throw new NotFoundException(
            `Producto con ID ${item.productId} no encontrado o inactivo`,
          );
        }
        applicationItems.push({
          product,
          quantity: item.quantity ?? 1,
        });
      }
    } else {
      applicationItems.push({ product: plan.product, quantity: 1 });
    }

    const totalPrice = applicationItems.reduce(
      (acc, item) => acc + Number(item.product.basePrice ?? 0) * item.quantity,
      0,
    );

    // Calcular automáticamente el préstamo: total de productos + % de interés del plan
    const basePrice = Number(plan.product?.basePrice ?? 1);
    const scale = basePrice > 0 ? totalPrice / basePrice : 1;
    const agreedDownPayment = Number(
      (Number(plan.downPayment ?? 0) * scale).toFixed(2),
    );
    const interestRate = Number(plan.interestRateApr ?? 0);
    const totalToRepay = Number(
      (totalPrice * (1 + interestRate / 100)).toFixed(2),
    );
    const installments = plan.numberOfInstallments || 1;
    const agreedInstallmentAmount = Number(
      ((totalToRepay - agreedDownPayment) / installments).toFixed(2),
    );

    let user: User;
    if (userId) {
      user = await this.userRepo.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
      }
    } else if (applicant) {
      user = await this.userRepo.findOne({ where: { email: applicant.email } });
      if (!user) {
        user = this.userRepo.create({
          fullName: applicant.fullName,
          email: applicant.email,
          phone: applicant.phone,
          nationalId: applicant.nationalId,
          address: applicant.address,
          role: UserRoles.CLIENT,
        });
        user = await this.userRepo.save(user);
      }
    } else {
      throw new BadRequestException(
        'Debe indicar un userId o los datos del solicitante',
      );
    }

    const application = this.loanAppRepo.create({
      userId: user.id,
      financingPlanId: plan.id,
      status: ApplicationStatus.PENDING,
      agreedInstallments: plan.numberOfInstallments,
      agreedInstallmentAmount,
      agreedDownPayment,
      totalLoanAmount: Number(totalPrice.toFixed(2)),
      items: applicationItems.map((item) =>
        this.loanAppItemRepo.create({
          productId: item.product.id,
          quantity: item.quantity,
          unitPrice: Number(item.product.basePrice ?? 0),
        }),
      ),
    });

    const saved = await this.loanAppRepo.save(application);

    await this.auditLogRepo.save(
      this.auditLogRepo.create({
        entityType: 'LoanApplication',
        entityId: saved.id,
        action: 'CREATE',
        performedBy: user.email,
        details: {
          financingPlanId: plan.id,
          products: applicationItems.map((item) => item.product.id),
        },
      }),
    );

    return this.findOne(saved.id);
  }

  findAll(): Promise<LoanApplication[]> {
    return this.loanAppRepo.find({
      relations: this.relations,
      order: { appliedAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<LoanApplication> {
    const application = await this.loanAppRepo.findOne({
      where: { id },
      relations: this.relations,
    });
    if (!application) {
      throw new NotFoundException(`Solicitud de préstamo con ID ${id} no encontrada`);
    }
    return application;
  }

  async update(id: number, updateLoanApplicationDto: UpdateLoanApplicationDto) {
    const application = await this.loanAppRepo.findOne({
      where: { id },
      relations: { items: { product: true } },
    });
    if (!application) {
      throw new NotFoundException(`Solicitud de préstamo con ID ${id} no encontrada`);
    }

    if (
      updateLoanApplicationDto.financingPlanId !== undefined &&
      updateLoanApplicationDto.financingPlanId !== application.financingPlanId
    ) {
      const plan = await this.financingPlanRepo.findOne({
        where: { id: updateLoanApplicationDto.financingPlanId, isActive: true },
        relations: { product: true },
      });
      if (!plan) {
        throw new NotFoundException(
          `Plan de financiamiento con ID ${updateLoanApplicationDto.financingPlanId} no encontrado o inactivo`,
        );
      }

      const totalPrice = (application.items ?? []).reduce(
        (acc, item) => acc + Number(item.unitPrice ?? 0) * (item.quantity ?? 1),
        0,
      );
      const basePrice = Number(plan.product?.basePrice ?? 1);
      const scale = basePrice > 0 ? totalPrice / basePrice : 1;

      application.financingPlanId = plan.id;
      application.agreedInstallments = plan.numberOfInstallments;
      application.agreedDownPayment = Number(
        (Number(plan.downPayment ?? 0) * scale).toFixed(2),
      );
      const interestRate = Number(plan.interestRateApr ?? 0);
      const totalToRepay = Number(
        (totalPrice * (1 + interestRate / 100)).toFixed(2),
      );
      application.agreedInstallmentAmount = Number(
        (
          (totalToRepay - application.agreedDownPayment) /
          (plan.numberOfInstallments || 1)
        ).toFixed(2),
      );
      application.totalLoanAmount = Number(totalPrice.toFixed(2));
    }

    if (updateLoanApplicationDto.userId !== undefined) {
      application.userId = updateLoanApplicationDto.userId;
    }

    return this.loanAppRepo.save(application);
  }

  async approve(id: number, performedBy = 'SYSTEM') {
    const application = await this.loanAppRepo.findOne({
      where: { id },
      relations: { user: true, financingPlan: true },
    });
    if (!application) {
      throw new NotFoundException(`Solicitud de préstamo con ID ${id} no encontrada`);
    }

    if (
      application.status !== ApplicationStatus.PENDING &&
      application.status !== ApplicationStatus.UNDER_REVIEW
    ) {
      throw new ConflictException(
        `La solicitud ya fue procesada (estado actual: ${application.status})`,
      );
    }

    const existingLoan = await this.activeLoanRepo.findOne({
      where: { applicationId: id },
    });
    if (existingLoan) {
      throw new ConflictException('La solicitud ya tiene un préstamo activo asociado');
    }

    const downPayment = Number(application.agreedDownPayment ?? 0);
    const installments = application.agreedInstallments;
    const installmentAmount = Number(application.agreedInstallmentAmount ?? 0);
    const principalAmount = Number(
      (Number(application.totalLoanAmount ?? 0) - downPayment).toFixed(2),
    );
    const totalObligation = Number(
      (downPayment + installments * installmentAmount).toFixed(2),
    );

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + installments);

    const scheduleItems: Partial<LoanScheduleItem>[] = [
      {
        installmentNumber: 0,
        dueDate: this.formatDate(startDate),
        amountDue: downPayment,
        amountPaid: 0,
        status: InstallmentStatus.UNPAID,
      },
    ];
    for (let i = 1; i <= installments; i++) {
      const dueDate = new Date(startDate);
      dueDate.setMonth(dueDate.getMonth() + i);
      scheduleItems.push({
        installmentNumber: i,
        dueDate: this.formatDate(dueDate),
        amountDue: installmentAmount,
        amountPaid: 0,
        status: InstallmentStatus.UNPAID,
      });
    }

    const loan = this.activeLoanRepo.create({
      applicationId: application.id,
      userId: application.userId,
      principalAmount,
      remainingBalance: totalObligation,
      loanStatus: LoanStatus.ACTIVE,
      startDate: this.formatDate(startDate),
      expectedEndDate: this.formatDate(endDate),
      scheduleItems: scheduleItems as LoanScheduleItem[],
    });

    const savedLoan = await this.activeLoanRepo.save(loan);

    application.status = ApplicationStatus.APPROVED;
    application.reviewedAt = new Date();
    application.reviewedBy = performedBy;
    await this.loanAppRepo.save(application);

    await this.auditLogRepo.save(
      this.auditLogRepo.create({
        entityType: 'LoanApplication',
        entityId: application.id,
        action: 'APPROVE',
        performedBy,
        details: { activeLoanId: savedLoan.id },
      }),
    );

    return this.activeLoanRepo.findOne({
      where: { id: savedLoan.id },
      relations: {
        application: { financingPlan: { product: true }, items: { product: true } },
        user: true,
        scheduleItems: true,
      },
      order: { scheduleItems: { installmentNumber: 'ASC' } },
    });
  }

  async reject(id: number, reason?: string, performedBy = 'SYSTEM') {
    const application = await this.findOne(id);

    if (
      application.status !== ApplicationStatus.PENDING &&
      application.status !== ApplicationStatus.UNDER_REVIEW
    ) {
      throw new ConflictException(
        `La solicitud ya fue procesada (estado actual: ${application.status})`,
      );
    }

    application.status = ApplicationStatus.REJECTED;
    application.rejectionReason = reason ?? null;
    application.reviewedAt = new Date();
    application.reviewedBy = performedBy;
    await this.loanAppRepo.save(application);

    await this.auditLogRepo.save(
      this.auditLogRepo.create({
        entityType: 'LoanApplication',
        entityId: application.id,
        action: 'REJECT',
        performedBy,
        details: { reason: reason ?? null },
      }),
    );

    return this.findOne(id);
  }

  async remove(id: number) {
    const application = await this.loanAppRepo.findOne({ where: { id } });
    if (!application) {
      throw new NotFoundException(`Solicitud de préstamo con ID ${id} no encontrada`);
    }

    const existingLoan = await this.activeLoanRepo.findOne({
      where: { applicationId: id },
    });
    if (existingLoan) {
      throw new ConflictException(
        'No se puede eliminar la solicitud porque tiene un préstamo asociado',
      );
    }

    return this.loanAppRepo.delete(id);
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
