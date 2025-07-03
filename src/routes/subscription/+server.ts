import { json } from '@sveltejs/kit';
import { authorize, getSubscriptions, headersPostJson, redirectIf401 } from '$lib/ubm.js';
import { BASE_URL } from '$env/static/private';

export async function GET({ cookies }) {
	const { jwt, tenant } = authorize(cookies);
	const result = await getSubscriptions(jwt, tenant);
	return json(await result.json(), { status: result.status });
}

export async function POST({ request, cookies }) {
	const { jwt, tenant } = authorize(cookies);
	const { publicToken } = await request.json();
	const result = redirectIf401(
		await fetch(BASE_URL + 'subscription', {
			method: 'POST',
			headers: headersPostJson(jwt, tenant),
			body: JSON.stringify({ publicToken })
		})
	);
	return json(await result.json(), { status: result.status });
}
