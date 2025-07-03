import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { AUTHORIZATION, TENANT } from '$env/static/private';

export const load: PageServerLoad = async () => {
	const jwt = AUTHORIZATION;
	const tenant = TENANT;
	return {
		jwt,
		tenant
	};
};

export const actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		cookies.set('tenant', getString(data.get('tenant')), { path: '/ubm' });
		cookies.set('jwt', getString(data.get('jwt')), { path: '/ubm' });
		redirect(303, '/ubm');
	}
} satisfies Actions;

function getString(formValue: FormDataEntryValue | null): string {
	return typeof formValue === 'string' ? formValue : '';
}
