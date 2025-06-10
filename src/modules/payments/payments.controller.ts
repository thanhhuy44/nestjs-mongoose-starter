import { Controller, Get, Query, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { CreateVNPLinkDto } from './dto/creata-link-vnp.dto';
import { StripeService } from './stripe/stripe.service';
import { VnpayService } from './vnpay/vnpay.service';

@ApiTags('Payment')
@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly stripeService: StripeService,
    private readonly vnpayService: VnpayService,
  ) {}

  @Get('stripe/checkout')
  async createPaymentSession() {
    return await this.stripeService.createPaymentSession();
  }

  @Get('vnpay/checkout')
  async createVNPLink(@Query() queries: CreateVNPLinkDto, @Req() req: Request) {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    console.log('🚀 ~ PaymentsController ~ createVNPLink ~ ip:', ip);
    const url = this.vnpayService.createPaymentUrl(
      String(ip),
      Number(queries.amount),
      queries.orderId,
    );
    return { url };
  }
}
