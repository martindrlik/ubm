import { getNotifications, getSubscriptions } from '$lib/ubm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const subscriptionsResult = await getSubscriptions(locals);
	const { subscriptions } = await subscriptionsResult.json();

	const notificationsResult = await getNotifications(locals);
	const { notifications } = await notificationsResult.json();
	return {
		subscriptions,
		notifications
	};
};
