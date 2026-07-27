import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { LoanApplication } from './LoanApplication';

@Entity('application_documents')
export class ApplicationDocument {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    applicationId: number;

    @Column({ length: 50 })
    documentType: string;

    @Column({ type: 'text' })
    fileUrl: string;

    @Column({ default: false })
    isVerified: boolean;

    @CreateDateColumn()
    uploadedAt: Date;

    @ManyToOne(() => LoanApplication, (app) => app.documents, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'applicationId' })
    application: LoanApplication;
}