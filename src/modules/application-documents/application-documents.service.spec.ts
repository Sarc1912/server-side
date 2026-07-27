import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationDocumentsService } from './application-documents.service';

describe('ApplicationDocumentsService', () => {
  let service: ApplicationDocumentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApplicationDocumentsService],
    }).compile();

    service = module.get<ApplicationDocumentsService>(ApplicationDocumentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
