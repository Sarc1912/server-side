import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    OneToMany,
    JoinColumn,
} from 'typeorm';
import { Product } from './Product';
import { LoanApplication } from './LoanApplication';
import { ColumnNumericTransformer } from '../../utils/database/ColumnTransformers';

export enum PaymentFrequency {
    WEEKLY = 'weekly',
    BI_WEEKLY = 'bi-weekly',
    MONTHLY = 'monthly',
}

@Entity('financing_plans')
export class FinancingPlan {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    productId: number;

    @Column({ length: 100, nullable: true })
    title: string;

    @Column({ type: 'int' })
    numberOfInstallments: number;

    @Column({
        type: 'decimal',
        precision: 12,
        scale: 2,
        transformer: ColumnNumericTransformer,
    })
    installmentAmount: number;

    @Column({
        type: 'decimal',
        precision: 12,
        scale: 2,
        default: 0.0,
        transformer: ColumnNumericTransformer,
    })
    downPayment: number;

    @Column({
        type: 'enum',
        enum: PaymentFrequency,
        default: PaymentFrequency.MONTHLY,
    })
    frequency: PaymentFrequency;

    @Column({
        type: 'decimal',
        precision: 5,
        scale: 2,
        default: 0.0,
        transformer: ColumnNumericTransformer,
    })
    interestRateApr: number;

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    // Relationships
    @ManyToOne(() => Product, (product) => product.financingPlans, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'productId' })
    product: Product;

    @OneToMany(() => LoanApplication, (app) => app.financingPlan)
    applications: LoanApplication[];
}