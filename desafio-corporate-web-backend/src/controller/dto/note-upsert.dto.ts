import { AutoMap } from "@automapper/classes";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, MaxLength, Min } from "class-validator";

export class NoteUpsertDTO {
	@AutoMap()
	@IsNotEmpty()
	@MaxLength(80)
	public title: string;

	@AutoMap()
	@IsNotEmpty()
	@MaxLength(480)
	public content: string;
}
