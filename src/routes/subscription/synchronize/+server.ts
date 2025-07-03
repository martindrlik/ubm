import { json } from '@sveltejs/kit';
import { authorize, headersPostJson, redirectIf401 } from '$lib/ubm.js';
import { BASE_URL } from '$env/static/private';

export async function POST({ request, cookies }) {
	const { jwt, tenant } = authorize(cookies);
	const { synchronizeSubscription } = await request.json();

	const result = redirectIf401(
		await fetch(BASE_URL + `subscription/${synchronizeSubscription}/synchronize`, {
			method: 'POST',
			headers: headersPostJson(jwt, tenant),
			body: JSON.stringify({})
		})
	);
	return json(await result.json(), { status: result.status });
}
