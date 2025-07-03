import { BASE_URL } from '$env/static/private';
import { redirect, type Cookies } from '@sveltejs/kit';

export function headersPostJson(jwt: string, tenant: string) {
	return {
		authorization: jwt,
		'x-q-tenant-id': tenant,
		'content-type': 'application/json'
	};
}

export function headersGet(jwt: string, tenant: string) {
	return {
		authorization: jwt,
		'x-q-tenant-id': tenant
	};
}

export function redirectIf401(result: Response): Response {
	if (result.status === 401) {
		redirect(307, '/authorize');
	}
	return result;
}

export function isAuthorizePath(request: Request): boolean {
	return request.url.endsWith('/authorize');
}

export function authorize(cookies: Cookies): { jwt: string; tenant: string } {
	const jwt = cookies.get('jwt');
	const tenant = cookies.get('tenant');
	if (!jwt || !tenant) {
		redirect(303, '/authorize');
	}
	return { jwt, tenant };
}

export async function getSubscriptions(jwt: string, tenant: string): Promise<Response> {
	return redirectIf401(
		await fetch(BASE_URL + 'subscriptions', {
			method: 'GET',
			headers: headersGet(jwt, tenant)
		})
	);
}

export async function getNotifications(jwt: string, tenant: string): Promise<Response> {
	return redirectIf401(
		await fetch(BASE_URL + 'notifications', {
			method: 'GET',
			headers: headersGet(jwt, tenant)
		})
	);
}
