import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class NoteIdDTO {
  @Min(1) // ID must be greater than zero
  @IsInt()
  @Type(() => Number)
  public id: number;
}
