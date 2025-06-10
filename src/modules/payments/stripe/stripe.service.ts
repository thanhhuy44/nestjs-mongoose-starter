import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private readonly stripePaymentSuccessUrl =
    process.env.STRIPE_PAYMENT_SUCCESS_URL ??
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley';

  private readonly stripePaymentCancelUrl =
    process.env.STRIPE_PAYMENT_CANCEL_URL ??
    'https://www.youtube.com/watch?v=ln5h44icVZE&t=307s&ab_channel=Tu%E1%BA%A5nV%C5%A9-Topic';

  private readonly stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-05-28.basil',
  });

  async createPaymentSession() {
    return await this.stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'vnd',
            product_data: {
              name: 'T-shirt Blackbi 2025',
              description: 'T-shirt Blackbi 2025',
              images: [
                'https://isto.pt/cdn/shop/files/HW_Navy_Flatlay_87c7af9a-b1ca-4e34-871b-d80c00134401.webp?v=1747408921',
                'https://product.hstatic.net/1000377637/product/hanh8556_49388ed112024acabd38f256500b52ee_master.jpg',
              ],
            },
            unit_amount: 200000,
          },
          quantity: 1,
        },
      ],
      success_url: this.stripePaymentSuccessUrl,
      cancel_url: this.stripePaymentCancelUrl,
    });
  }
}
