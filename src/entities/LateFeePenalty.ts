import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ActiveLoan } from './ActiveLoan';
import { LoanScheduleItem } from './LoanScheduleItem';
import { ColumnNumericTransformer } from '../../utils/database/ColumnTransformers';

@Entity('late_fee_penalties')
export class LateFeePenalty {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    loanId: number;

    @Column()
    scheduleItemId: number;

    @Column({
        type: 'decimal',
        precision: 12,
        scale: 2,
        transformer: ColumnNumericTransformer,
    })
    penaltyAmount: number;

    @Column({ length: 255, default: 'Overdue installment fee' })
    reason: string;

    @Column({ default: false })
    isPaid: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => ActiveLoan, (loan) => loan.penalties, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'loanId' })
    loan: ActiveLoan;

    @ManyToOne(() => LoanScheduleItem, (item) => item.penalties, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'scheduleItemId' })
    scheduleItem: LoanScheduleItem;
}