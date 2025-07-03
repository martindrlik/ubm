import { json } from '@sveltejs/kit';
import { getSubscriptions, postSubscription } from '$lib/ubm.js';

export async function GET() {
	const result = await getSubscriptions();
	return json(await result.json(), { status: result.status });
}

export async function POST({ request }) {
	const { publicToken } = await request.json();
	const result = await postSubscription(publicToken);
	return json(await result.json(), { status: result.status });
}
