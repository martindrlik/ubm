<script lang="ts">
	import Label from '$lib/Label.svelte';
	import Check from './Check.svelte';

	let { label, id, checked = $bindable() } = $props();
</script>

<Label {label} {id} />
<Check {id} bind:checked />
