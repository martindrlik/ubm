import { json } from '@sveltejs/kit';
import { authorize, headersGet, redirectIf401 } from '$lib/ubm.js';
import { BASE_URL } from '$env/static/private';

export async function POST({ request, cookies }) {
	const { jwt, tenant } = authorize(cookies);
	const { notificationId } = await request.json();

	const result = redirectIf401(
		await fetch(BASE_URL + `notifications/acknowledge`, {
			method: 'POST',
			headers: headersGet(jwt, tenant),
			body: JSON.stringify({ notificationIds: [notificationId] })
		})
	);
	return json(await result.json(), { status: result.status });
}
