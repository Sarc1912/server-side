import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PaymentRecordsService } from './payment-records.service';
import { CreatePaymentRecordDto } from './dto/create-payment-record.dto';
import { UpdatePaymentRecordDto } from './dto/update-payment-record.dto';

@Controller('payment-records')
export class PaymentRecordsController {
  constructor(private readonly paymentRecordsService: PaymentRecordsService) {}

  @Post()
  create(@Body() createPaymentRecordDto: CreatePaymentRecordDto) {
    return this.paymentRecordsService.create(createPaymentRecordDto);
  }

  @Get()
  findAll() {
    return this.paymentRecordsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentRecordsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentRecordDto: UpdatePaymentRecordDto) {
    return this.paymentRecordsService.update(+id, updatePaymentRecordDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentRecordsService.remove(+id);
  }
}
