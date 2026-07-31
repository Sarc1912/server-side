import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Product } from './Product';

@Entity('product_images')
export class ProductImage {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    productId: number;

    @Column({ type: 'text' })
    url: string;

    @Column({ length: 255, nullable: true })
    altText: string;

    @Column({ type: 'int', default: 0 })
    order: number; // Para ordenar cúal imagen va primero

    @Column({ type: 'boolean', default: false })
    isMain: boolean; // Identifica la imagen principal de la galería

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    // Relación con Product
    @ManyToOne(() => Product, (product) => product.images, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'productId' })
    product: Product;
}