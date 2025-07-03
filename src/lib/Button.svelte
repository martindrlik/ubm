<script lang="ts">
	import type { MouseEventHandler } from 'svelte/elements';

	let {
		label,
		onclick,
		type = 'button'
	}: {
		label: string;
		onclick?: MouseEventHandler<HTMLButtonElement> | null | undefined;
		type?: 'button' | 'submit' | 'reset' | null | undefined;
	} = $props();
</script>

<button
	class="focus:shadow-outline rounded bg-gray-100 px-4 py-2 text-sm font-bold shadow hover:bg-gray-300 focus:outline-none"
	{type}
	{onclick}
>
	{label}
</button>
