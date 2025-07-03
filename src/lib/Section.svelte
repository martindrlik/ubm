<script lang="ts">
	let { children } = $props();
</script>

<div class="mb-6 flex flex-col sm:mb-0">
	{@render children()}
</div>
