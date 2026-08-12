import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../../entities/Product';
import { ProductImage } from '../../entities/ProductImage';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepo: Repository<ProductImage>,
  ) { }

  async create(createProductDto: CreateProductDto, files?: Array<Express.Multer.File>) {

    console.log("createProductDTo", createProductDto)
    console.log("files", files)

    let newImages: any[] = [];
    if (files && files.length > 0) {
      newImages = files.map((file, idx) => ({
        url: `/uploads/${file.filename}`,
        altText: file.originalname,
        order: idx,
        isMain: false,
      }));
    }

    const allImages = [...(createProductDto.images || []), ...newImages];

    if (allImages.length > 0) {
      const hasMain = allImages.some(img => img.isMain);
      if (!hasMain) {
        allImages[0].isMain = true;
      }
      allImages.forEach((img, idx) => {
        if (img.order === undefined) {
          img.order = idx;
        }
      });
      createProductDto.images = allImages;
    }

    const product = this.productRepo.create(createProductDto);
    return await this.productRepo.save(product);
  }

  findAll() {
    return this.productRepo.find({
      relations: {
        category: true,
        images: true,
        financingPlans: true,
        specifications: true,
      },
      order: {
        images: {
          order: 'ASC',
          id: 'ASC',
        },
        financingPlans: {
          createdAt: 'ASC',
        },
      },
    });
  }

  findOne(id: number) {
    return this.productRepo.findOne({
      where: { id },
      relations: {
        category: true,
        images: true,
        financingPlans: true,
        specifications: true,
      },
      order: {
        images: {
          order: 'ASC',
          id: 'ASC',
        },
        financingPlans: {
          createdAt: 'ASC',
        },
      },
    });
  }

  async update(id: number, updateProductDto: UpdateProductDto, files?: Array<Express.Multer.File>) {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: {
        images: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    // Cambiar 'images' por 'existingImages' que es como lo envía el FormData de Angular
    const { existingImages: rawExistingImages = [], images: legacyImages = [], ...productData } = updateProductDto || {};

    // Unificar por si acaso llega de una u otra forma
    const imagesToProcess = rawExistingImages.length > 0 ? rawExistingImages : legacyImages;

    let existingImages = imagesToProcess;
    if (typeof imagesToProcess === 'string') {
      try {
        existingImages = JSON.parse(imagesToProcess);
      } catch (e) {
        existingImages = [];
      }
    }

    // Procesar nuevas imágenes subidas por archivo físico
    let newImages: any[] = [];
    if (files && files.length > 0) {
      const currentCount = existingImages ? existingImages.length : 0;
      newImages = files.map((file, idx) => ({
        url: `/uploads/${file.filename}`,
        altText: file.originalname,
        order: currentCount + idx,
        isMain: false,
      }));
    }

    const combinedImages = [...(existingImages || []), ...newImages];

    if (combinedImages !== undefined) {
      await this.productImageRepo.delete({ productId: id });

      if (combinedImages.length > 0) {
        const hasMain = combinedImages.some(img => img.isMain);
        if (!hasMain) {
          combinedImages[0].isMain = true;
        }
        combinedImages.forEach((img, idx) => {
          img.order = idx;
        });
      }

      product.images = combinedImages.map(img =>
        this.productImageRepo.create({
          url: img.url,
          altText: img.altText,
          order: img.order,
          isMain: img.isMain,
          productId: id,
        })
      );
    }

    this.productRepo.merge(product, productData);
    return await this.productRepo.save(product);
  }

  async remove(id: number) {
    await this.productImageRepo.delete({ productId: id });
    return this.productRepo.delete(id);
  }
}