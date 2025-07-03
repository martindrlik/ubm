<script lang="ts">
	let { children } = $props();
</script>

<h2 class="mt-2 mb-2 text-center text-xl sm:mt-4 sm:mb-4 sm:text-left sm:text-2xl">
	{@render children()}
</h2>
