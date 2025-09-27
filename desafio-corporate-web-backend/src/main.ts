import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import {
	ClassSerializerInterceptor,
	INestApplication,
	ValidationPipe,
} from '@nestjs/common';
import { GenericExceptionFilter, HttpExceptionFilter } from './filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { swaggerConfig } from '../config';

function setup(app: INestApplication) {
	app.useGlobalPipes(
		new ValidationPipe({
			//TO DO
			//whitelist: true, // So entra quem eu permitir
			//forbidNonWhitelisted: true,
			//forbidUnknownValues: true, // Nao escaralhar nos tipos dos valores
			transform: true,
			transformOptions: { enableImplicitConversion: true },
		}),
	);
	app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
	app.useGlobalFilters(new GenericExceptionFilter(), new HttpExceptionFilter());
}

function setupSwagger(app: INestApplication) {
	const document = SwaggerModule.createDocument(app, swaggerConfig);
	SwaggerModule.setup('api', app, document);
}

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	setup(app);
	setupSwagger(app);
	await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
