<script lang="ts">
	import Button from '$lib/Button.svelte';
	import LabelInput from '$lib/LabelInput.svelte';
	import LabelSelect from '$lib/LabelSelect.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let callback = $state('https://foobar.requestcatcher.com/callback');
	let language = $state('EN');
	let mostRecentSubscription = $state('');
	let updateSubscription = $state('');
	let updateMode = $state('');
	let subscriptions = $state(data.subscriptions);
	let synchronizeSubscription = $state('');

	let notificationId = $state('');
	let notifications = $state(data.notifications);
	let notification = $derived(
		notifications.find((x: { notificationId: string }) => x.notificationId === notificationId)
	);

	let hideOthers = $state(false);

	async function configure() {
		const result = await fetch('/configure', {
			method: 'POST',
			body: JSON.stringify({ callback })
		});
		const { errorMessage } = await result.json();
		alert(errorMessage === undefined ? 'Configured.' : errorMessage);
	}

	async function createLink() {
		const result = await fetch('/link', {
			method: 'POST',
			body: JSON.stringify({ language, updateSubscription, updateMode })
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
				const result = await fetch('/subscription', {
					method: 'POST',
					body: JSON.stringify({ publicToken: public_token })
				});
				const { subscriptionId } = await result.json();
				mostRecentSubscription = subscriptionId;
				subscriptions = await getSubscriptions();
			}
		});

		handler.open();
	}

	async function getSubscriptions() {
		const result = await fetch('/subscription', {
			method: 'GET'
		});
		const { subscriptions } = await result.json();
		return subscriptions;
	}

	async function synchronize() {
		const result = await fetch('/subscription/synchronize', {
			method: 'POST',
			body: JSON.stringify({ synchronizeSubscription })
		});
		const { errorMessage } = await result.json();
		alert(errorMessage === undefined ? 'Synchronization requested.' : errorMessage);
	}

	async function pullNotifications() {
		notifications = await getNotifications();
	}

	async function getNotifications() {
		const result = await fetch('/notification', {
			method: 'GET'
		});
		const { errorMessage, notifications } = await result.json();
		alert(errorMessage === undefined ? 'Notifications pulled.' : errorMessage);
		return notifications;
	}

	function simpleOption(x: string): { label: string; value: string } {
		return { label: x, value: x };
	}

	function subscriptionOption(x: { subscriptionId: string; sourceName: string }): {
		label: string;
		value: string;
	} {
		return { label: `${x.subscriptionId} ${x.sourceName}`, value: x.subscriptionId };
	}

	function notificationOption(x: { notificationId: string }): {
		label: string;
		value: string;
	} {
		return simpleOption(x.notificationId);
	}

	function isStar(value: string): boolean {
		return mostRecentSubscription === value;
	}
</script>

<svelte:head>
	<script src="https://link.deck.co/link-initialize.js"></script>
</svelte:head>

<div class="mx-auto w-4xl">
	<form>
		<h1 class="mt-6 text-4xl">Integration Quickstart</h1>
		{#if !hideOthers}
			<h2 class="mt-4 mb-4 text-2xl">Configuration</h2>
			<div class="mb-6 flex flex-wrap">
				<div class="w-full">
					<LabelInput
						bind:value={callback}
						label="Notification Callback URL"
						type="url"
						id="callback"
					/>
					<Button label="Configure" onclick={configure} />
				</div>
			</div>

			<h2 class="mt-4 mb-4 text-2xl">Link</h2>
			<div class="mb-6 flex flex-wrap">
				<div class="w-1/7">
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

				<div class="flex w-full flex-wrap">
					<LabelSelect
						label="Update Subscription"
						id="update-subscription"
						{isStar}
						bind:value={updateSubscription}
						options={subscriptions.map(subscriptionOption)}
					/>
				</div>
				<div class="w-full">
					<div class="w-1/2">
						<LabelSelect
							label="Update Mode"
							id="update-mode"
							bind:value={updateMode}
							options={['', 'UpdateCredentials', 'Refresh', 'UpdateAccountSelection'].map(
								simpleOption
							)}
						/>
					</div>
				</div>
				<div class="w-1/3">
					<Button label="Create Link" onclick={createLink} />
				</div>
			</div>

			<h2 class="mt-4 mb-4 text-2xl">Synchronize</h2>
			<div class="mb-6 flex flex-wrap">
				<div class="w-full">
					<LabelSelect
						label="Synchronize Subscription"
						id="synchronize-subscription"
						{isStar}
						bind:value={synchronizeSubscription}
						options={subscriptions.map(subscriptionOption)}
					/>
				</div>
				<div class="w-1/3">
					<Button label="Synchronize" onclick={synchronize} />
				</div>
			</div>
		{/if}

		<h2 class="mt-4 mb-4 text-2xl">Notifications</h2>
		<div class="mb-6 flex flex-wrap">
			<div class="mb-6 w-1/3">
				{#if hideOthers}
					<Button label="Show Others" onclick={() => (hideOthers = false)} />
				{:else}
					<Button label="Hide Others" onclick={() => (hideOthers = true)} />
				{/if}
				<Button label="Pull Notifications" onclick={pullNotifications} />
			</div>
			<div class="w-full">
				<LabelSelect
					label="Notifications"
					id="notifications"
					bind:value={notificationId}
					options={notifications.map(notificationOption)}
				/>
			</div>
			{#if notification !== undefined}
				<div class="mb-6 w-1/3">
					<Button label="JSON" onclick={() => {}} />
					<Button label="PDF" onclick={() => {}} />
					<Button label="Acknowledge" onclick={() => {}} />
				</div>
			{/if}
		</div>
	</form>
</div>
