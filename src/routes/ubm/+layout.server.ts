import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ locals, cookies }) => {
	locals.jwt = cookies.get('jwt');
	locals.tenant = cookies.get('tenant');
	if (!locals.tenant || !locals.jwt) {
		redirect(307, '/authorize');
	}
};
