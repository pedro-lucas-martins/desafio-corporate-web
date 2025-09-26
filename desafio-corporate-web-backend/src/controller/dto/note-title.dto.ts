import { AutoMap } from '@automapper/classes';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class NoteTitleDTO {
	@AutoMap()
	@MaxLength(80)
	@IsNotEmpty()
	@IsString()
	@Type(() => String)
	public title: string;
}
