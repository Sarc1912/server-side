import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    JoinColumn,
} from 'typeorm';
import { User } from './User';
import { FinancingPlan } from './FinancingPlan';
import { ApplicationDocument } from './ApplicationDocument';
import { ActiveLoan } from './ActiveLoan';
import { LoanApplicationItem } from './LoanApplicationItem';
import { ColumnNumericTransformer } from '../../utils/database/ColumnTransformers';

export enum ApplicationStatus {
    PENDING = 'pending',
    UNDER_REVIEW = 'under_review',
    APPROVED = 'approved',
    REJECTED = 'rejected',
    CANCELLED = 'cancelled',
}

@Entity('loan_applications')
export class LoanApplication {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'uuid', generated: 'uuid', unique: true })
    publicId: string;

    @Column()
    userId: number;

    @Column()
    financingPlanId: number;

    @Column({
        type: 'enum',
        enum: ApplicationStatus,
        default: ApplicationStatus.PENDING,
    })
    status: ApplicationStatus;

    @Column({ type: 'text', nullable: true })
    rejectionReason: string;

    // Price Snapshot Terms
    @Column({ type: 'int' })
    agreedInstallments: number;

    @Column({
        type: 'decimal',
        precision: 12,
        scale: 2,
        transformer: ColumnNumericTransformer,
    })
    agreedInstallmentAmount: number;

    @Column({
        type: 'decimal',
        precision: 12,
        scale: 2,
        transformer: ColumnNumericTransformer,
    })
    agreedDownPayment: number;

    @Column({
        type: 'decimal',
        precision: 12,
        scale: 2,
        transformer: ColumnNumericTransformer,
    })
    totalLoanAmount: number;

    @Column({ length: 100, nullable: true })
    reviewedBy: string;

    @CreateDateColumn()
    appliedAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    reviewedAt: Date;

    // Relationships
    @ManyToOne(() => User, (user) => user.applications, { onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @ManyToOne(() => FinancingPlan, (plan) => plan.applications, { onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'financingPlanId' })
    financingPlan: FinancingPlan;

    @OneToMany(() => ApplicationDocument, (doc) => doc.application, { cascade: true })
    documents: ApplicationDocument[];

    @OneToMany(() => LoanApplicationItem, (item) => item.application, { cascade: true })
    items: LoanApplicationItem[];

    @OneToOne(() => ActiveLoan, (loan) => loan.application)
    activeLoan: ActiveLoan;
}