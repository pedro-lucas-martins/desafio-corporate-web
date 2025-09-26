import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { NoteModel } from 'src/model';
import { NoteReadDTO, NoteTitleDTO, NoteUpsertDTO } from '../dto';
import { createMap, Mapper, MappingProfile } from '@automapper/core';

@Injectable()
export class NoteProfile extends AutomapperProfile {
	constructor(@InjectMapper() mapper: Mapper) {
		super(mapper);
	}

	override get profile():MappingProfile {
		return (mapper) => {
			createMap(mapper, NoteModel, NoteReadDTO);
			createMap(mapper, NoteUpsertDTO, NoteModel);
			createMap(mapper, NoteModel, NoteTitleDTO);
		};
	}
}
