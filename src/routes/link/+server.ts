import { json } from '@sveltejs/kit';
import { authorize, headersGet, redirectIf401 } from '$lib/ubm.js';
import { BASE_URL } from '$env/static/private';

export async function POST({ cookies, request }) {
	const { jwt, tenant } = authorize(cookies);
	const { language, updateSubscription, updateMode } = await request.json();

	const result = redirectIf401(
		await fetch(
			BASE_URL +
				`link?language=${language}&updateSubscriptionId=${updateSubscription}&updateMode=${updateMode}`,
			{
				method: 'GET',
				headers: headersGet(jwt, tenant)
			}
		)
	);
	if (result.status !== 200) {
		const { errorMessage } = await result.json();
		return json({ errorMessage }, { status: result.status });
	}
	return json(await result.json(), { status: 200 });
}
