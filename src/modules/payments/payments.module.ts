import { Module } from '@nestjs/common';

import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { StripeService } from './stripe/stripe.service';
import { VnpayService } from './vnpay/vnpay.service';

// TODO: Turn on webhook to sign status payments
@Module({
  providers: [PaymentsService, VnpayService, StripeService],
  controllers: [PaymentsController],
})
export class PaymentsModule {}
