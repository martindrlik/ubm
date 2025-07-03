import { json } from '@sveltejs/kit';
import { getLink } from '$lib/ubm.js';

export async function POST({ locals, request }) {
	const { language, updateSubscription, updateMode } = await request.json();
	const result = await getLink(locals, language, updateSubscription, updateMode);
	if (result.status !== 200) {
		const { errorMessage } = await result.json();
		return json({ errorMessage }, { status: result.status });
	}
	return json(await result.json(), { status: 200 });
}
