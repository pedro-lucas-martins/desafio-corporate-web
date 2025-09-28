import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class NoteIdDTO {
	@ApiProperty({
		description: 'Titulo da anotação',
		required: true,
		type: Number,
		minimum: 1,
		maximum: 80,
	})
	@AutoMap()
	@IsNotEmpty()
	@IsInt()
	public id: number;
}
