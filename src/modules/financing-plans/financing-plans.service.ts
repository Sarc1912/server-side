import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFinancingPlanDto } from './dto/create-financing-plan.dto';
import { UpdateFinancingPlanDto } from './dto/update-financing-plan.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FinancingPlan } from '../../entities/FinancingPlan';
import { Product } from '../../entities/Product';

@Injectable()
export class FinancingPlansService {
  constructor(
    @InjectRepository(FinancingPlan)
    private readonly financingPlanRepo: Repository<FinancingPlan>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) { }

  async create(createFinancingPlanDto: CreateFinancingPlanDto) {
    const product = await this.productRepo.findOne({
      where: { id: createFinancingPlanDto.productId },
    });
    if (!product) {
      throw new NotFoundException(`Producto con ID ${createFinancingPlanDto.productId} no encontrado`);
    }

    const plan = this.financingPlanRepo.create(createFinancingPlanDto);
    return this.financingPlanRepo.save(plan);
  }

  findAll(): Promise<FinancingPlan[]> {
    return this.financingPlanRepo.find({
      relations: { product: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<FinancingPlan> {
    const plan = await this.financingPlanRepo.findOne({
      where: { id },
      relations: { product: true },
    });
    if (!plan) {
      throw new NotFoundException(`Plan de financiamiento con ID ${id} no encontrado`);
    }
    return plan;
  }

  async update(id: number, updateFinancingPlanDto: UpdateFinancingPlanDto) {
    const plan = await this.findOne(id);

    if (updateFinancingPlanDto.productId !== undefined && updateFinancingPlanDto.productId !== plan.productId) {
      const product = await this.productRepo.findOne({
        where: { id: updateFinancingPlanDto.productId },
      });
      if (!product) {
        throw new NotFoundException(`Producto con ID ${updateFinancingPlanDto.productId} no encontrado`);
      }
    }

    this.financingPlanRepo.merge(plan, updateFinancingPlanDto);
    return this.financingPlanRepo.save(plan);
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.financingPlanRepo.delete(id);
  }
}
