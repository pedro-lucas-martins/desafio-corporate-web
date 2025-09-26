import { IsNotEmpty, MinLength } from 'class-validator';

export class NoteCreateDTO {
  @IsNotEmpty()
  @MinLength(10)
  public title: string;

  @MinLength(10)
  public content: string;
}
