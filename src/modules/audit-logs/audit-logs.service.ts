import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { UpdateAuditLogDto } from './dto/update-audit-log.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from '../../entities/AuditLog';

@Injectable()
export class AuditLogsService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepo: Repository<AuditLog>,
  ) {}

  create(createAuditLogDto: CreateAuditLogDto) {
    const log = this.auditLogRepo.create(createAuditLogDto);
    return this.auditLogRepo.save(log);
  }

  findAll(): Promise<AuditLog[]> {
    return this.auditLogRepo.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<AuditLog> {
    const log = await this.auditLogRepo.findOne({ where: { id } });
    if (!log) {
      throw new NotFoundException(`Registro de auditoría con ID ${id} no encontrado`);
    }
    return log;
  }

  async update(id: number, updateAuditLogDto: UpdateAuditLogDto) {
    const log = await this.findOne(id);
    this.auditLogRepo.merge(log, updateAuditLogDto);
    return this.auditLogRepo.save(log);
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.auditLogRepo.delete(id);
  }
}
