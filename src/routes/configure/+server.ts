import { json } from '@sveltejs/kit';
import { authorize, headersPostJson, redirectIf401 } from '$lib/ubm.js';
import { BASE_URL } from '$env/static/private';

export async function POST({ request, cookies }) {
	const { jwt, tenant } = authorize(cookies);
	const { callback } = await request.json();
	const result = redirectIf401(
		await fetch(BASE_URL + 'configuration', {
			method: 'POST',
			headers: headersPostJson(jwt, tenant),
			body: JSON.stringify({ notificationCallbackUrl: callback })
		})
	);
	if (result.status !== 200) {
		const { errorMessage } = await result.json();
		return json({ errorMessage }, { status: result.status });
	}
	return json({}, { status: 200 });
}
