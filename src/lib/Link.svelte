<script lang="ts">
	import Button from '$lib/Button.svelte';
	import Heading2 from '$lib/Heading2.svelte';
	import LabelInput from '$lib/LabelInput.svelte';
	import LabelSelect from '$lib/LabelSelect.svelte';
	import Section from '$lib/Section.svelte';
	import { option, type Subscription } from './subscription';

	interface Props {
		subscriptions: Subscription[];
		create: (subscriptionId: string) => Promise<void>;
	}

	let { subscriptions, subscriptionIdStar, create }: Props = $props();

	let countries = $state('');
	let language = $state('EN');
	let updateSubscription = $state('');
	let updateMode = $state('');
	let subscriptionIdSelected = $state('');

	async function createLink() {
		const result = await fetch('/link', {
			method: 'POST',
			body: JSON.stringify({ language, countries, updateSubscription, updateMode })
		});
		const { errorMessage, linkToken } = await result.json();
		if (errorMessage !== undefined) {
			alert(errorMessage);
		}

		const handler = Deck.create({
			token: linkToken,

			// A single source can be specified, this will skip the source select screen.
			// For the skip to work, make sure that the source specified here would appear normally on the source select screen.
			// source_id: '09320c5d-8552-47df-8aa3-98fe1c0b5505',

			onExit() {},
			async onSuccess({ public_token }) {
				handler.exit();
				if (public_token) {
					const result = await fetch('/subscription', {
						method: 'POST',
						body: JSON.stringify({ publicToken: public_token })
					});
					const { subscriptionId } = await result.json();
					create(subscriptionId);
				}
			}
		});

		handler.open();
	}

	function simpleOption(x: string): { label: string; value: string } {
		return { label: x, value: x };
	}

	function isStar(subscriptionId: string): boolean {
		return subscriptionIdStar === subscriptionId;
	}
</script>

<Heading2>Link</Heading2>
<Section>
	<div class="flex gap-2">
		<div class="w-1/5">
			<LabelSelect
				label="Language"
				id="language"
				bind:value={language}
				options={[
					'EN',
					'ES',
					'FR',
					'DE',
					'IT',
					'PT',
					'NL',
					'PL',
					'SV',
					'DA',
					'NO',
					'ET',
					'LT',
					'LV',
					'RO'
				].map(simpleOption)}
			/>
		</div>
		<div class="w-full">
			<LabelInput label="Countries" id="countries" type="text" bind:value={countries} />
		</div>
		<div class="w-1/5">
			<Button label="Create" onclick={createLink} />
		</div>
	</div>

	<div class="flex gap-2">
		<div class="w-1/3">
			<LabelSelect
				label="Update Mode"
				id="update-mode"
				bind:value={updateMode}
				options={['', 'UpdateCredentials', 'Refresh', 'UpdateAccountSelection'].map(simpleOption)}
			/>
		</div>
		<div class="w-full">
			<LabelSelect
				label="Update Subscription"
				id="update-subscription"
				{isStar}
				bind:value={subscriptionIdSelected}
				options={(subscriptions ?? []).map(option)}
			/>
		</div>
		<div class="w-1/5">
			<Button label="Update" onclick={createLink} />
		</div>
	</div>
</Section>
