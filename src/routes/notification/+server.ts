import { json } from '@sveltejs/kit';
import { getNotifications } from '$lib/ubm.js';

export async function GET({ locals }) {
	const result = await getNotifications(locals);
	return json(await result.json(), { status: result.status });
}
