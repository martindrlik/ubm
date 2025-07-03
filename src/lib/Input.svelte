<script lang="ts">
	let { id, type, value = $bindable() } = $props();
</script>

<input
	class="mb-3 block w-full appearance-none rounded border border-gray-200 bg-white px-4 py-3 leading-tight text-gray-700 focus:border-gray-300 focus:outline-none"
	{id}
	{type}
	name={id}
	bind:value
/>
