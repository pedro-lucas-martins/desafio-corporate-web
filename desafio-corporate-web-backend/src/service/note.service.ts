import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class NoteService {
  public deleteNote(id: number): void {
    if (id <= 0) {
      throw new BadRequestException('ID must be greater than zero');
    }
    console.log(`Note with ID ${id} deleted`);
  }
}
