import { json } from '@sveltejs/kit';
import { postSubscriptionSynchronize } from '$lib/ubm.js';

export async function POST({ request }) {
	const { synchronizeSubscription } = await request.json();
	const result = await postSubscriptionSynchronize(synchronizeSubscription);
	return json(await result.json(), { status: result.status });
}
