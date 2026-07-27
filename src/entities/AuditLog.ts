import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('audit_logs')
export class AuditLog {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50 })
    entityType: string;

    @Column({ type: 'int' })
    entityId: number;

    @Column({ length: 50 })
    action: string;

    @Column({ length: 100, default: 'SYSTEM' })
    performedBy: string;

    @Column({ type: 'jsonb', nullable: true })
    details: Record<string, any>;

    @CreateDateColumn()
    createdAt: Date;
}