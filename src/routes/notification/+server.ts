import { json } from '@sveltejs/kit';
import { authorize, getNotifications } from '$lib/ubm.js';

export async function GET({ cookies }) {
	const { jwt, tenant } = authorize(cookies);
	const result = await getNotifications(jwt, tenant);
	return json(await result.json(), { status: result.status });
}
