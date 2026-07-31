import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product } from '../../entities/Product';
import { ProductImage } from '../../entities/ProductImage';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductImage]),
    // Configuración global de Multer para este módulo
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads', // Carpeta donde se guardarán los archivos en la raíz del backend
        filename: (req, file, callback) => {
          // Genera un nombre único para evitar que archivos con el mismo nombre se sobrescriban
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule { }