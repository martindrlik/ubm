import { json } from '@sveltejs/kit';
import { authorize, getNotifications } from '$lib/ubm.js';

export async function GET({ url, cookies }) {
	const limit = (url.searchParams.get('limit') ?? 1) as number;
	const { jwt, tenant } = authorize(cookies);
	const result = await getNotifications(jwt, tenant, limit);
	return json(await result.json(), { status: result.status });
}
