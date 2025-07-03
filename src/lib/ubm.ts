import { BASE_URL } from '$env/static/private';
import { redirect } from '@sveltejs/kit';

function jsonHeaders(locals: App.Locals) {
	return {
		authorization: locals.jwt,
		'x-q-tenant-id': locals.tenant,
		'content-type': 'application/json'
	};
}

function headers(locals: App.Locals) {
	return {
		authorization: locals.jwt,
		'x-q-tenant-id': locals.tenant
	};
}

export async function postConfiguration(locals: App.Locals, notificationCallbackUrl: string) {
	const result = await fetch(BASE_URL + 'configuration', {
		method: 'POST',
		headers: jsonHeaders(locals),
		body: JSON.stringify({ notificationCallbackUrl })
	});
	return redirectIf401(result);
}

export async function getLink(
	locals: App.Locals,
	language: string | undefined,
	updateSubscriptionId: string | undefined,
	updateMode: string | undefined
) {
	const result = await fetch(
		BASE_URL +
			`link?language=${language}&updateSubscriptionId=${updateSubscriptionId}&updateMode=${updateMode}`,
		{
			method: 'GET',
			headers: headers(locals)
		}
	);
	return redirectIf401(result);
}

export async function getSubscriptions(locals: App.Locals) {
	const result = await fetch(BASE_URL + 'subscriptions', {
		method: 'GET',
		headers: headers(locals)
	});
	return redirectIf401(result);
}

export async function getNotifications(locals: App.Locals) {
	const result = await fetch(BASE_URL + 'notifications', {
		method: 'GET',
		headers: headers(locals)
	});
	return redirectIf401(result);
}

export async function postSubscription(locals: App.Locals, publicToken: string) {
	const result = await fetch(BASE_URL + 'subscription', {
		method: 'POST',
		headers: jsonHeaders(locals),
		body: JSON.stringify({ publicToken })
	});
	return redirectIf401(result);
}

export async function postSubscriptionSynchronize(locals: App.Locals, subscriptionId: string) {
	const result = await fetch(BASE_URL + `subscription/${subscriptionId}/synchronize`, {
		method: 'POST',
		headers: jsonHeaders(locals),
		body: JSON.stringify({})
	});
	return redirectIf401(result);
}

function redirectIf401(result: Response): Response {
	console.log(result);
	if (result.status === 401) {
		redirect(307, '/authorize');
	}
	return result;
}
