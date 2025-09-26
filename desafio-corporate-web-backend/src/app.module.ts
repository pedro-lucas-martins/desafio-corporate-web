import { Module } from '@nestjs/common';
import { DI_NOTE_SERVICE } from 'config';
import { NoteService } from 'src/service';
import { NoteController } from './controller';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { NoteProfile } from './controller/profiles';

@Module({
	imports: [
		AutomapperModule.forRoot({
			strategyInitializer: classes(),
		}),
	],
	controllers: [NoteController],
	providers: [{ provide: DI_NOTE_SERVICE, useClass: NoteService }, NoteProfile],
})
export class AppModule {}
