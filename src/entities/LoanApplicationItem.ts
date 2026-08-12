import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { LoanApplication } from './LoanApplication';
import { Product } from './Product';
import { ColumnNumericTransformer } from '../../utils/database/ColumnTransformers';

@Entity('loan_application_items')
export class LoanApplicationItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    applicationId: number;

    @Column()
    productId: number;

    @Column({ type: 'int', default: 1 })
    quantity: number;

    @Column({
        type: 'decimal',
        precision: 12,
        scale: 2,
        transformer: ColumnNumericTransformer,
    })
    unitPrice: number;

    @CreateDateColumn()
    createdAt: Date;

    // Relationships
    @ManyToOne(() => LoanApplication, (app) => app.items, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'applicationId' })
    application: LoanApplication;

    @ManyToOne(() => Product, (product) => product, { onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'productId' })
    product: Product;
}
