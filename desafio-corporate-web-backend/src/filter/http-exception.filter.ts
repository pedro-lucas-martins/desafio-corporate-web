import {
	ExceptionFilter,
	Catch,
	ArgumentsHost,
	HttpException,
	Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
	private logger = new Logger('HttpExceptionFilter');

	catch(exception: HttpException, host: ArgumentsHost): any {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();
		const status = exception.getStatus();

		const errorLog = {
			statusCode: status,
			error: exception.name,
			message: exception.message,
			timestamp: new Date().toISOString(),
			path: request.url,
			detail: exception.getResponse(),
		};

		this.logger[status >= 500 ? 'error' : 'log']({
			...errorLog,
			stack: exception.stack,
		});

		response.status(status).json(errorLog);
	}
}
