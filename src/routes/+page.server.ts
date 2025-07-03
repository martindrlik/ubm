import { authorize, getNotifications, getSubscriptions } from '$lib/ubm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
	const { jwt, tenant } = authorize(cookies);
	const subscriptionsResult = await getSubscriptions(jwt, tenant);
	const { subscriptions } = await subscriptionsResult.json();

	const notificationsResult = await getNotifications(jwt, tenant);
	const { notifications } = await notificationsResult.json();
	return {
		tenant,
		subscriptions,
		notifications
	};
};
