<script lang="ts">
	let { id, checked = $bindable() } = $props();
</script>

<input {id} type="checkbox" name={id} bind:checked />
