import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { PaymentDataService } from './payment-data.service';

@Controller('payment-data')
export class PaymentDataController {
  constructor(private readonly paymentDataService: PaymentDataService) {}

  @Get(':loanId')
  getPaymentData(@Param('loanId', ParseIntPipe) loanId: number) {
    return this.paymentDataService.getPaymentData(loanId);
  }
}
