import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LateFeePenaltiesService } from './late-fee-penalties.service';
import { CreateLateFeePenaltyDto } from './dto/create-late-fee-penalty.dto';
import { UpdateLateFeePenaltyDto } from './dto/update-late-fee-penalty.dto';

@Controller('late-fee-penalties')
export class LateFeePenaltiesController {
  constructor(private readonly lateFeePenaltiesService: LateFeePenaltiesService) {}

  @Post()
  create(@Body() createLateFeePenaltyDto: CreateLateFeePenaltyDto) {
    return this.lateFeePenaltiesService.create(createLateFeePenaltyDto);
  }

  @Get()
  findAll() {
    return this.lateFeePenaltiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lateFeePenaltiesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLateFeePenaltyDto: UpdateLateFeePenaltyDto) {
    return this.lateFeePenaltiesService.update(+id, updateLateFeePenaltyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lateFeePenaltiesService.remove(+id);
  }
}
