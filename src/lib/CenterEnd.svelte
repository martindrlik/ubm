<script lang="ts">
	let { children } = $props();
</script>

<div class="flex justify-center sm:justify-end">
	{@render children()}
</div>
