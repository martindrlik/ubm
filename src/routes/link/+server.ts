import { json } from '@sveltejs/kit';
import { authorize, headersPostJson, redirectIf401 } from '$lib/ubm.js';
import { BASE_URL } from '$env/static/private';

export async function POST({ cookies, request }) {
	const { jwt, tenant } = authorize(cookies);
	const { language, countries, updateSubscription, updateMode } = await request.json();

	const countriesArray = countries ? countries.split(',') : undefined;
	const update = updateSubscription
		? {
				subscriptionId: updateSubscription as string,
				mode: updateMode as string
			}
		: undefined;
	const result = redirectIf401(
		await fetch(BASE_URL + 'link', {
			method: 'POST',
			headers: headersPostJson(jwt, tenant),
			body: createLinkBody(update, language, countriesArray)
		})
	);
	if (result.status !== 200) {
		const { errorMessage } = await result.json();
		return json({ errorMessage }, { status: result.status });
	}
	return json(await result.json(), { status: 200 });
}

function createLinkBody(
	update?: {
		subscriptionId: string;
		mode: string;
	},
	language?: string,
	countries?: string[]
): string {
	// hint { "language": "EN", "countries": ['DE'], "update": { "subscriptionId": "123", "mode": "UpdateCredentials" }
	return JSON.stringify({
		language,
		countries,
		update
	});
}
