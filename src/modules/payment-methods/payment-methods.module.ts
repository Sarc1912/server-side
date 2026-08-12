import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentMethodsService } from './payment-methods.service';
import { PaymentMethodsController } from './payment-methods.controller';
import { PaymentMethod } from '../../entities/PaymentMethod';
import { AuditLog } from '../../entities/AuditLog';

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentMethod, AuditLog]),
  ],
  controllers: [PaymentMethodsController],
  providers: [PaymentMethodsService],
  exports: [PaymentMethodsService],
})
export class PaymentMethodsModule {}
