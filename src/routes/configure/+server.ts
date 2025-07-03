import { json } from '@sveltejs/kit';
import { postConfiguration } from '$lib/ubm.js';

export async function POST({ locals, request }) {
	const { callback } = await request.json();
	const result = await postConfiguration(locals, callback);
	if (result.status !== 200) {
		const { errorMessage } = await result.json();
		return json({ errorMessage }, { status: result.status });
	}
	return json({}, { status: 200 });
}
