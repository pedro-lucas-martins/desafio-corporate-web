import {
	ExceptionFilter,
	Catch,
	ArgumentsHost,
	HttpStatus,
	Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GenericExceptionFilter implements ExceptionFilter {
	private logger = new Logger('GenericExceptionFilter');

	catch(exception: Error, host: ArgumentsHost): any {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();

		const errorLog = {
			statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
			error: exception.name,
			message: exception.message,
			timestamp: new Date().toISOString(),
			path: request.url,
			detail: exception.message,
		};

		this.logger.error({ ...errorLog, stack: exception.stack });

		response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errorLog);
	}
}
