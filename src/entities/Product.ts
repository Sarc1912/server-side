import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
    JoinColumn,
    Index,
} from 'typeorm';
import { Category } from './Category';
import { ProductSpecification } from './ProductSpecification';
import { FinancingPlan } from './FinancingPlan';
import { ColumnNumericTransformer } from '../../utils/database/ColumnTransformers';

export enum ProductStatus {
    ACTIVE = 'active',
    SOLD = 'sold',
    ARCHIVED = 'archived',
}

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'uuid', generated: 'uuid', unique: true })
    publicId: string;

    @Column()
    categoryId: number;

    @Column({ length: 255 })
    title: string;

    @Column({ length: 100, nullable: true })
    brand: string;

    @Column({
        type: 'decimal',
        precision: 12,
        scale: 2,
        transformer: ColumnNumericTransformer,
    })
    basePrice: number;

    @Column({ length: 3, default: 'USD' })
    currency: string;

    @Column({ type: 'int', default: 1 })
    stockQuantity: number;

    @Column({
        type: 'enum',
        enum: ProductStatus,
        default: ProductStatus.ACTIVE,
    })
    status: ProductStatus;

    // Hybrid JSONB for dynamic/arbitrary attributes
    @Index()
    @Column({ type: 'jsonb', default: {} })
    attributes: Record<string, any>;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    // Relationships
    @ManyToOne(() => Category, (category) => category.products, { onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'categoryId' })
    category: Category;

    @OneToMany(() => ProductSpecification, (spec) => spec.product, { cascade: true })
    specifications: ProductSpecification[];

    @OneToMany(() => FinancingPlan, (plan) => plan.product, { cascade: true })
    financingPlans: FinancingPlan[];
}