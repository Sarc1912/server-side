import { Injectable } from '@nestjs/common';
import { CreateLateFeePenaltyDto } from './dto/create-late-fee-penalty.dto';
import { UpdateLateFeePenaltyDto } from './dto/update-late-fee-penalty.dto';

@Injectable()
export class LateFeePenaltiesService {
  create(createLateFeePenaltyDto: CreateLateFeePenaltyDto) {
    return 'This action adds a new lateFeePenalty';
  }

  findAll() {
    return `This action returns all lateFeePenalties`;
  }

  findOne(id: number) {
    return `This action returns a #${id} lateFeePenalty`;
  }

  update(id: number, updateLateFeePenaltyDto: UpdateLateFeePenaltyDto) {
    return `This action updates a #${id} lateFeePenalty`;
  }

  remove(id: number) {
    return `This action removes a #${id} lateFeePenalty`;
  }
}
