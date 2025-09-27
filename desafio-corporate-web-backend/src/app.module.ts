import { Module } from '@nestjs/common';
import { DI_NOTE_REPOSITORY, DI_NOTE_SERVICE, DI_PRISMA_SERVICE } from 'config';
import { NoteService } from 'src/service';
import { NoteController } from './controller';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { NoteProfile } from './controller/profiles';
import { PrismaService } from './infrastructure';
import { NoteRepository } from './repository';

@Module({
	imports: [
		AutomapperModule.forRoot({
			strategyInitializer: classes(),
		}),
	],
	controllers: [NoteController],
	providers: [
		NoteProfile,
		{ provide: DI_NOTE_REPOSITORY, useClass: NoteRepository },

		{ provide: DI_NOTE_SERVICE, useClass: NoteService },

		{ provide: DI_PRISMA_SERVICE, useClass: PrismaService },
	],
})
export class AppModule {}
