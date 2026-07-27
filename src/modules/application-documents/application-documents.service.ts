import { Injectable } from '@nestjs/common';
import { CreateApplicationDocumentDto } from './dto/create-application-document.dto';
import { UpdateApplicationDocumentDto } from './dto/update-application-document.dto';

@Injectable()
export class ApplicationDocumentsService {
  create(createApplicationDocumentDto: CreateApplicationDocumentDto) {
    return 'This action adds a new applicationDocument';
  }

  findAll() {
    return `This action returns all applicationDocuments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} applicationDocument`;
  }

  update(id: number, updateApplicationDocumentDto: UpdateApplicationDocumentDto) {
    return `This action updates a #${id} applicationDocument`;
  }

  remove(id: number) {
    return `This action removes a #${id} applicationDocument`;
  }
}
