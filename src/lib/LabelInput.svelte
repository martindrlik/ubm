<script lang="ts">
	import Label from '$lib/Label.svelte';
	import Input from './Input.svelte';

	let { label, id, type, value = $bindable() } = $props();
</script>

<Label {label} {id} />
<Input {id} {type} bind:value />
