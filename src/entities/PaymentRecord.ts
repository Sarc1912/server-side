import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ActiveLoan } from './ActiveLoan';
import { LoanScheduleItem } from './LoanScheduleItem';
import { ColumnNumericTransformer } from '../../utils/database/ColumnTransformers';

export enum PaymentStatus {
    COMPLETED = 'completed',
    REFUNDED = 'refunded',
    FAILED = 'failed',
}

@Entity('payment_records')
export class PaymentRecord {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'uuid', generated: 'uuid', unique: true })
    publicId: string;

    @Column()
    loanId: number;

    @Column({ nullable: true })
    scheduleItemId: number;

    @Column({
        type: 'decimal',
        precision: 12,
        scale: 2,
        transformer: ColumnNumericTransformer,
    })
    amountPaid: number;

    @Column({ length: 50 })
    paymentMethod: string;

    @Column({ length: 100, nullable: true })
    transactionReference: string;

    @Column({
        type: 'enum',
        enum: PaymentStatus,
        default: PaymentStatus.COMPLETED,
    })
    paymentStatus: PaymentStatus;

    @CreateDateColumn()
    createdAt: Date;

    // Relationships
    @ManyToOne(() => ActiveLoan, (loan) => loan.payments, { onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'loanId' })
    loan: ActiveLoan;

    @ManyToOne(() => LoanScheduleItem, (item) => item.payments, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'scheduleItemId' })
    scheduleItem: LoanScheduleItem;
}