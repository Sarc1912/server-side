import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    OneToOne,
    OneToMany,
    JoinColumn,
} from 'typeorm';
import { LoanApplication } from './LoanApplication';
import { User } from './User';
import { LoanScheduleItem } from './LoanScheduleItem';
import { PaymentRecord } from './PaymentRecord';
import { LateFeePenalty } from './LateFeePenalty';
import { ColumnNumericTransformer } from '../../utils/database/ColumnTransformers';

export enum LoanStatus {
    ACTIVE = 'active',
    PAID_IN_FULL = 'paid_in_full',
    DEFAULTED = 'defaulted',
    WRITTEN_OFF = 'written_off',
}

@Entity('active_loans')
export class ActiveLoan {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'uuid', generated: 'uuid', unique: true })
    publicId: string;

    @Column({ unique: true })
    applicationId: number;

    @Column()
    userId: number;

    @Column({
        type: 'decimal',
        precision: 12,
        scale: 2,
        transformer: ColumnNumericTransformer,
    })
    principalAmount: number;

    @Column({
        type: 'decimal',
        precision: 12,
        scale: 2,
        transformer: ColumnNumericTransformer,
    })
    remainingBalance: number;

    @Column({
        type: 'enum',
        enum: LoanStatus,
        default: LoanStatus.ACTIVE,
    })
    loanStatus: LoanStatus;

    @Column({ type: 'date' })
    startDate: string;

    @Column({ type: 'date' })
    expectedEndDate: string;

    @CreateDateColumn()
    createdAt: Date;

    // Relationships
    @OneToOne(() => LoanApplication, (app) => app.activeLoan, { onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'applicationId' })
    application: LoanApplication;

    @ManyToOne(() => User, (user) => user.loans, { onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @OneToMany(() => LoanScheduleItem, (item) => item.loan, { cascade: true })
    scheduleItems: LoanScheduleItem[];

    @OneToMany(() => PaymentRecord, (payment) => payment.loan)
    payments: PaymentRecord[];

    @OneToMany(() => LateFeePenalty, (penalty) => penalty.loan)
    penalties: LateFeePenalty[];
}