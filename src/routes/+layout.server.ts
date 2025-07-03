import type { LayoutServerLoad } from './$types';
import { authorize, isAuthorizePath } from '$lib/ubm';

export const load: LayoutServerLoad = ({ cookies, request }) => {
	if (!isAuthorizePath(request)) {
		authorize(cookies);
	}
};
