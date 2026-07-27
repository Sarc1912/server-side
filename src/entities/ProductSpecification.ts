import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from './Product';

@Entity('product_specifications')
export class ProductSpecification {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    productId: number;

    @Column({ length: 50 })
    specKey: string;

    @Column({ length: 100 })
    specValue: string;

    @ManyToOne(() => Product, (product) => product.specifications, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'productId' })
    product: Product;
}