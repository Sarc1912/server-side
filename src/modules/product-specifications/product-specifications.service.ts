import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductSpecification } from '../../entities/ProductSpecification';
import { Product } from '../../entities/Product';

@Injectable()
export class ProductSpecificationsService {
  constructor(
    @InjectRepository(ProductSpecification)
    private readonly specRepository: Repository<ProductSpecification>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) { }

  async create(createDto: { productId: number; specifications: Array<{ specKey: string; specValue: string }> }) {
    const { productId, specifications } = createDto;

    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException(`Producto con ID ${productId} no encontrado`);
    }

    await this.specRepository.delete({ productId });

    const specsToSave = specifications.map(spec =>
      this.specRepository.create({
        productId,
        specKey: spec.specKey,
        specValue: spec.specValue,
      })
    );

    return await this.specRepository.save(specsToSave);
  }

  // Método update implementado
  async update(productId: number, updateDto: { specifications?: Array<{ specKey: string; specValue: string }> }) {
    const { specifications } = updateDto;

    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException(`Producto con ID ${productId} no encontrado`);
    }

    // Si no se envían especificaciones, puedes retornar el producto o hacer un retorno anticipado
    if (!specifications) {
      return product;
    }

    await this.specRepository.delete({ productId });

    const specsToSave = specifications.map(spec =>
      this.specRepository.create({
        product: { id: productId },
        specKey: spec.specKey,
        specValue: spec.specValue,
      })
    );

    return await this.specRepository.save(specsToSave);
  }
  async findAll() {
    return await this.specRepository.find();
  }

  async findOne(id: number) {
    const spec = await this.specRepository.findOne({ where: { id } });
    if (!spec) {
      throw new NotFoundException(`Especificación con ID ${id} no encontrada`);
    }
    return spec;
  }

  async findByProductId(productId: number) {
    // Opcional: Verificar si el producto existe antes de buscar sus especificaciones
    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException(`Producto con ID ${productId} no encontrado`);
    }

    // Buscar todas las especificaciones que pertenezcan a este productId
    return await this.specRepository.find({
      where: { productId },
    });
  }

  async remove(id: number) {
    const spec = await this.findOne(id);
    return await this.specRepository.remove(spec);
  }
}