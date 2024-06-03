import { Test, TestingModule } from '@nestjs/testing';
import { DevelopmentService } from './development.service';
import {TagService} from "../../database/tag/tag.service";

describe('DevelopmentService', () => {
  let service: DevelopmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
          DevelopmentService,
          TagService
      ],
    }).compile();

    service = module.get<DevelopmentService>(DevelopmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
