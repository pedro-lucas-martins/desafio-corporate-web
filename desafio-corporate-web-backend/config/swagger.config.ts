import { DocumentBuilder } from "@nestjs/swagger";

export const swaggerConfig = new DocumentBuilder()
		.setTitle('Desafio-API')
		.setDescription('Este projeto é um desafio tecnico para a vaga de estagio da empresa corporate web')
		.setVersion('1.0')
		.addServer('http://localhost:3000','localhost')
		.setContact('Pedro Martins', 'https://www.linkedin.com/in/plmbrandao','contato.plmartins@gmail.com')
		.build();
