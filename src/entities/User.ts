import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';
import { LoanApplication } from './LoanApplication';
import { ActiveLoan } from './ActiveLoan';
import { UserStatus } from '../enums/users/user.status.enum';
import { UserRoles } from '../enums/users/user.roles';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'uuid', generated: 'uuid', unique: true })
    publicId: string;

    @Column({ length: 150 })
    fullName: string;

    @Column({ length: 150, unique: true })
    email: string;

    @Column({ length: 255, nullable: true })
    password?: string;

    @Column({ length: 30 })
    phone: string;

    @Column({ length: 50, unique: true })
    nationalId: string;

    @Column({ type: 'text', nullable: true })
    address: string;

    @Column({ type: 'int', default: 600 })
    creditScore: number;

    @Column({
        type: 'enum',
        enum: UserStatus,
        default: UserStatus.ACTIVE,
    })
    status: UserStatus;

    @Column({
        type: 'enum',
        enum: UserRoles,
        default: UserRoles.CLIENT,
    })
    role: UserRoles;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    // Relationships
    @OneToMany(() => LoanApplication, (app) => app.user)
    applications: LoanApplication[];

    @OneToMany(() => ActiveLoan, (loan) => loan.user)
    loans: ActiveLoan[];
}