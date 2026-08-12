import {
  ConflictException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentMethod } from '../../entities/PaymentMethod';
import { AuditLog } from '../../entities/AuditLog';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';

@Injectable()
export class PaymentMethodsService implements OnModuleInit {
  constructor(
    @InjectRepository(PaymentMethod)
    private readonly methodRepo: Repository<PaymentMethod>,
    @InjectRepository(AuditLog)
    private readonly auditLogRepo: Repository<AuditLog>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.seedDefaults();
  }

  private async seedDefaults(): Promise<void> {
    const count = await this.methodRepo.count();
    if (count > 0) return;

    const defaults = [
      { code: 'cash', name: 'Efectivo', icon: '💵', requiresReference: false, description: 'Pago en efectivo en tienda', sortOrder: 1 },
      { code: 'transfer', name: 'Transferencia bancaria', icon: '🏦', requiresReference: true, description: 'Transferencia a la cuenta de la empresa', sortOrder: 2 },
      { code: 'card', name: 'Tarjeta', icon: '💳', requiresReference: false, description: 'Pago con tarjeta de débito o crédito', sortOrder: 3 },
      { code: 'bank_deposit', name: 'Depósito bancario', icon: '🏧', requiresReference: true, description: 'Depósito en efectivo a la cuenta de la empresa', sortOrder: 4 },
      { code: 'mobile', name: 'Pago móvil', icon: '📱', requiresReference: true, description: 'Pago mediante billetera o pago móvil', sortOrder: 5 },
    ];

    await this.methodRepo.save(
      defaults.map((m) => this.methodRepo.create({ ...m, isActive: true })),
    );
  }

  create(createDto: CreatePaymentMethodDto): Promise<PaymentMethod> {
    return this.methodRepo
      .save(this.methodRepo.create(createDto))
      .then(async (saved) => {
        await this.auditLogRepo.save(
          this.auditLogRepo.create({
            entityType: 'PaymentMethod',
            entityId: saved.id,
            action: 'CREATE',
            performedBy: 'SYSTEM',
            details: createDto,
          }),
        );
        return saved;
      });
  }

  findAll(): Promise<PaymentMethod[]> {
    return this.methodRepo.find({ order: { sortOrder: 'ASC', id: 'ASC' } });
  }

  findActive(): Promise<PaymentMethod[]> {
    return this.methodRepo.find({
      where: { isActive: true },
      order: { sortOrder: 'ASC', id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<PaymentMethod> {
    const method = await this.methodRepo.findOne({ where: { id } });
    if (!method) {
      throw new NotFoundException(`Método de pago con ID ${id} no encontrado`);
    }
    return method;
  }

  async update(id: number, updateDto: UpdatePaymentMethodDto): Promise<PaymentMethod> {
    const method = await this.findOne(id);

    if (updateDto.code && updateDto.code !== method.code) {
      const existing = await this.methodRepo.findOne({
        where: { code: updateDto.code },
      });
      if (existing && existing.id !== id) {
        throw new ConflictException(`Ya existe un método con el código ${updateDto.code}`);
      }
    }

    this.methodRepo.merge(method, updateDto);
    const saved = await this.methodRepo.save(method);

    await this.auditLogRepo.save(
      this.auditLogRepo.create({
        entityType: 'PaymentMethod',
        entityId: id,
        action: 'UPDATE',
        performedBy: 'SYSTEM',
        details: updateDto,
      }),
    );

    return saved;
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.auditLogRepo.save(
      this.auditLogRepo.create({
        entityType: 'PaymentMethod',
        entityId: id,
        action: 'DELETE',
        performedBy: 'SYSTEM',
        details: { id },
      }),
    );
    return this.methodRepo.delete(id);
  }
}
