import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    JoinColumn,
    Unique,
    Index,
} from 'typeorm';
import { ActiveLoan } from './ActiveLoan';

import { PaymentRecord } from './PaymentRecord';
import { LateFeePenalty } from './LateFeePenalty';
import { ColumnNumericTransformer } from '../../utils/database/ColumnTransformers';

export enum InstallmentStatus {
    UNPAID = 'unpaid',
    PARTIALLY_PAID = 'partially_paid',
    PAID = 'paid',
    OVERDUE = 'overdue',
}

@Entity('loan_schedule_items')
@Unique(['loanId', 'installmentNumber'])
@Index(['dueDate', 'status'])
export class LoanScheduleItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    loanId: number;

    @Column({ type: 'int' })
    installmentNumber: number; // 0 = Down payment, 1..N = Installments

    @Column({ type: 'date' })
    dueDate: string;

    @Column({
        type: 'decimal',
        precision: 12,
        scale: 2,
        transformer: ColumnNumericTransformer,
    })
    amountDue: number;

    @Column({
        type: 'decimal',
        precision: 12,
        scale: 2,
        default: 0.0,
        transformer: ColumnNumericTransformer,
    })
    amountPaid: number;

    @Column({
        type: 'enum',
        enum: InstallmentStatus,
        default: InstallmentStatus.UNPAID,
    })
    status: InstallmentStatus;

    @Column({ type: 'timestamp', nullable: true })
    paidAt: Date;

    // Relationships
    @ManyToOne(() => ActiveLoan, (loan) => loan.scheduleItems, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'loanId' })
    loan: ActiveLoan;

    @OneToMany(() => PaymentRecord, (payment) => payment.scheduleItem)
    payments: PaymentRecord[];

    @OneToMany(() => LateFeePenalty, (penalty) => penalty.scheduleItem)
    penalties: LateFeePenalty[];
}