<script lang="ts">
	import Button from './Button.svelte';
	import CenterEnd from './CenterEnd.svelte';
	import LabelInput from './LabelInput.svelte';
	import Section from './Section.svelte';
	let { label, id, type, value = $bindable(), onclick, buttonLabel } = $props();
</script>

<Section>
	<LabelInput bind:value {label} {type} {id} />
	<CenterEnd>
		<Button label={buttonLabel} {onclick} />
	</CenterEnd>
</Section>
