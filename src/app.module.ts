import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from './data-source';

import { ProductsModule } from './modules/products/products.module';
import { ActiveLoansModule } from './modules/active-loans/active-loans.module';
import { ApplicationDocumentsModule } from './modules/application-documents/application-documents.module';
import { AuditLogsModule } from './modules/audit-logs/audit-logs.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { FinancingPlansModule } from './modules/financing-plans/financing-plans.module';
import { LateFeePenaltiesModule } from './modules/late-fee-penalties/late-fee-penalties.module';
import { LoanApplicationsModule } from './modules/loan-applications/loan-applications.module';
import { LoanScheduleItemsModule } from './modules/loan-schedule-items/loan-schedule-items.module';
import { PaymentRecordsModule } from './modules/payment-records/payment-records.module';
import { ProductSpecificationsModule } from './modules/product-specifications/product-specifications.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options),
    AuthModule, ProductsModule, ActiveLoansModule, ApplicationDocumentsModule, AuditLogsModule, CategoriesModule, FinancingPlansModule, LateFeePenaltiesModule, LoanApplicationsModule, LoanScheduleItemsModule, PaymentRecordsModule, ProductSpecificationsModule, UsersModule, DashboardModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
