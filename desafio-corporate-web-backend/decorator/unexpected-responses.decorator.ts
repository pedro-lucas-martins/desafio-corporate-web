import { applyDecorators } from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiInternalServerErrorResponse,
	ApiNotFoundResponse,
	ApiRequestTimeoutResponse,
	ApiServiceUnavailableResponse,
} from '@nestjs/swagger';

export function UnexpectedResponses(): any {
	return applyDecorators(
		ApiInternalServerErrorResponse({ description: 'Internal Server Error' }),
		ApiServiceUnavailableResponse({
			description: 'Service Unavailable',
		}),
		ApiBadRequestResponse({ description: 'Bad Request' }),
		ApiNotFoundResponse({ description: 'Not Found' }),
		ApiRequestTimeoutResponse({ description: 'Request Timeout' }),
	);
}
