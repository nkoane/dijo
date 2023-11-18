import type { HandleServerError } from '@sveltejs/kit';

export const handleError: HandleServerError = ({ error }) => {
	console.log('hooks->error: ', error?.message);
	// console.log('hooks->event: ', event);
	return {
		code: error?.code ?? 'UNKNOWN',
		message: 'Oh, oh! Something went wrong.'
	};
};
