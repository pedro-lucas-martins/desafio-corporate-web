import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class NoteTitleDTO {
	@ApiProperty({
		description: "Titulo da anotação",
		required: true,
		type: String,
		minimum: 1,
		maximum: 30
	})
	@AutoMap()
	@MaxLength(30)
	@IsNotEmpty()
	@IsString()
	@Type(() => String)
	public title: string;
}
