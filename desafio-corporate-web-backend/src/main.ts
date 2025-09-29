import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import {
	ClassSerializerInterceptor,
	INestApplication,
	ValidationPipe,
} from '@nestjs/common';
import { GenericExceptionFilter, HttpExceptionFilter } from './filter';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig } from '../config';

function setup(app: INestApplication) {
	app.enableCors({
		origin: [
			process.env.FRONTEND_URL!,
			"http://localhost",
			"http://localhost:3001",
			"http://frontend",
			"http://frontend:80"],
		methods: ['GET', 'POST', 'PUT', 'DELETE'],
		allowedHeaders: ['Content-Type', 'Authorization'],
	});
	app.useGlobalPipes(
		new ValidationPipe({
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
