import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import * as fs from 'fs';
import * as util from 'util';
import { pipeline } from 'stream';
import { join } from 'path';

const pump = util.promisify(pipeline);

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Post()
  async create(
    @Req() req: FastifyRequest,
  ) {
    if (!req.isMultipart()) {
      throw new BadRequestException('Request is not multipart');
    }

    const parts = req.parts();
    const createProductDto: Record<string, any> = {};
    const extractedFiles: any[] = [];

    for await (const part of parts) {
      if (part.type === 'file') {
        if (part.fieldname === 'images') {
          // Example: Save file locally to 'uploads' directory
          const uploadId = Date.now() + '-' + part.filename;
          const savePath = join(process.cwd(), 'uploads', uploadId);

          await pump(part.file, fs.createWriteStream(savePath));

          extractedFiles.push({
            fieldname: part.fieldname,
            originalname: part.filename,
            filename: uploadId,
            path: savePath,
            mimetype: part.mimetype,
          });
        }
      } else {
        // Regular form fields (dto properties)
        createProductDto[part.fieldname] = part.value;
      }
    }

    console.log(createProductDto);
    console.log(extractedFiles);

    return this.productsService.create(
      createProductDto as CreateProductDto,
      extractedFiles,
    );
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Req() req: FastifyRequest,
  ) {
    if (!req.isMultipart()) {
      throw new BadRequestException('Request is not multipart');
    }

    const parts = req.parts();
    const updateProductDto: Record<string, any> = {};
    const extractedFiles: any[] = [];

    for await (const part of parts) {
      if (part.type === 'file') {
        if (part.fieldname === 'images') {
          const uploadId = Date.now() + '-' + part.filename;
          const savePath = join(process.cwd(), 'uploads', uploadId);

          await pump(part.file, fs.createWriteStream(savePath));

          extractedFiles.push({
            fieldname: part.fieldname,
            originalname: part.filename,
            filename: uploadId,
            path: savePath,
            mimetype: part.mimetype,
          });
        }
      } else {
        updateProductDto[part.fieldname] = part.value;
      }
    }

    return this.productsService.update(
      +id,
      updateProductDto as UpdateProductDto,
      extractedFiles,
    );
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    if (!status || !['active', 'sold', 'archived'].includes(status)) {
      throw new BadRequestException('Estado inválido');
    }
    return this.productsService.updateStatus(+id, status);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}