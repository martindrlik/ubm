import { authorize, headersGet, redirectIf401 } from '$lib/ubm.js';
import { BASE_URL } from '$env/static/private';

export async function GET({ url, cookies }) {
	const { jwt, tenant } = authorize(cookies);

	const notificationId = url.searchParams.get('notificationId');
	const type = url.searchParams.get('type');
	const result = redirectIf401(
		await fetch(BASE_URL + `notifications/${notificationId}/content?contentType=${type}`, {
			method: 'GET',
			headers: headersGet(jwt, tenant)
		})
	);
	return new Response(result.body, {
		status: result.status,
		headers: {
			'content-type': type?.toLowerCase() === 'pdf' ? 'application/pdf' : 'application/json'
		}
	});
}
