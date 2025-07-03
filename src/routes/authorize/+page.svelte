<script lang="ts">
	import Button from '$lib/Button.svelte';
	import LabelInput from '$lib/LabelInput.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
	<div class="sm:mx-auto sm:w-full sm:max-w-sm">
		<h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Authorize</h2>
	</div>

	<div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
		<form class="space-y-6" method="POST">
			<div>
				<LabelInput label="Tenant ID" id="tenant" type="text" value={data.tenant} />
			</div>

			<div>
				<LabelInput label="JWT" id="jwt" type="password" value={data.jwt} />
			</div>

			<div class="grid content-center">
				<Button label="Use" type="submit" />
			</div>
		</form>
	</div>
</div>
