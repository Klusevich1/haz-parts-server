import { Controller, Post, Body } from '@nestjs/common';
import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('create-checkout-session')
  createSession(@Body() body: { products: { name: string, price: number }[] }) {
    return this.stripeService.createCheckoutSession(body.products);
  }
}
