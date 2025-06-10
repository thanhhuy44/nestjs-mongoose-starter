import { Test, TestingModule } from '@nestjs/testing';
import { VnpayService } from './vnpay.service';

describe('VnpayService', () => {
  let service: VnpayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VnpayService],
    }).compile();

    service = module.get<VnpayService>(VnpayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
