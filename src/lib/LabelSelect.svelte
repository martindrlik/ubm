<script lang="ts">
	import Label from '$lib/Label.svelte';

	let { label, id, value = $bindable(), options, isStar = () => false } = $props();
</script>

<Label {label} {id} />
<select
	class="mb-3 block w-full appearance-none rounded border border-gray-200 bg-white px-4 py-3 leading-tight text-gray-700 focus:border-gray-300 focus:outline-none"
	{id}
	bind:value
>
	{#each options as option (option.value)}
		<option value={option.value}>
			{#if isStar(option.value)}
				[{option.label}]
			{:else}
				{option.label}
			{/if}
		</option>
	{/each}
</select>
