import { AutoMap } from "@automapper/classes";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsString, MaxLength, Min } from "class-validator";

export class NoteUpsertDTO {

	@ApiProperty({
		description: "Titulo da anotação",
		required: true,
		type: String,
		minimum: 1,
		maximum: 80
	})
	@AutoMap()
	@IsNotEmpty()
	@MaxLength(80)
	public title: string;

	@ApiProperty({
		description: "Titulo da anotação",
		required: true,
		type: String,
		minimum: 1,
		maximum: 480
	})
	@AutoMap()
	@IsNotEmpty()
	@MaxLength(480)
	public content: string;
}
