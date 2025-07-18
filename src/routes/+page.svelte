<script lang="ts">
	import Button from '$lib/Button.svelte';
	import CenterEnd from '$lib/CenterEnd.svelte';
	import Heading2 from '$lib/Heading2.svelte';
	import LabelInput from '$lib/LabelInput.svelte';
	import LabelInputButton from '$lib/LabelInputButton.svelte';
	import LabelSelect from '$lib/LabelSelect.svelte';
	import Section from '$lib/Section.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let callback = $state(`https://${data.tenant}.requestcatcher.com/callback`);
	let language = $state('EN');
	let mostRecentSubscription = $state('');
	let updateSubscription = $state('');
	let updateMode = $state('');
	let subscriptions = $state(data.subscriptions);
	let synchronizeSubscription = $state('');

	let notificationId = $state('');
	let notifications = $state(data.notifications);
	let notification = $derived(
		notifications
			? notifications.find((x: { notificationId: string }) => x.notificationId === notificationId)
			: []
	);
	let notificationLimit = $state(1);

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

	async function acknowledge() {
		const result = await fetch('/notification/ack', {
			method: 'POST',
			body: JSON.stringify({ notificationId })
		});
		const { errorMessage } = await result.json();
		if (errorMessage === undefined) {
			notifications.splice(notifications.indexOf(notificationId), 1);
			notificationId = notifications.length > 0 ? notifications[0].notificationId : '';
		} else {
			alert(errorMessage);
		}
	}

	async function pullNotifications() {
		notifications = await getNotifications();
	}

	async function getNotifications() {
		const result = await fetch(`/notification?limit=${notificationLimit}`, {
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

	function download(type: 'Json' | 'Pdf') {
		const link = document.createElement('a');
		link.href = `/notification/content?notificationId=${notificationId}&type=${type}`;
		link.download = `${notificationId}.${type.toLowerCase()}`;
		link.click();
	}
</script>

<svelte:head>
	<script src="https://link.deck.co/link-initialize.js"></script>
</svelte:head>

<div class="mx-6 sm:mx-auto sm:w-2xl">
	<div class="mb-6 sm:mx-6">
		<h1 class="mt-2 text-center text-2xl sm:mt-6 sm:text-left sm:text-3xl">
			Integration Quickstart
		</h1>
		<Heading2>Configuration</Heading2>
		<LabelInputButton
			label="Notification Callback URL"
			type="url"
			id="callback"
			buttonLabel="Configure"
			onclick={configure}
			bind:value={callback}
		/>

		<Heading2>Link</Heading2>
		<Section>
			<div class="flex gap-2">
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

				<div>
					<LabelSelect
						label="Update Subscription"
						id="update-subscription"
						{isStar}
						bind:value={updateSubscription}
						options={(subscriptions ?? []).map(subscriptionOption)}
					/>
				</div>
			</div>
			<CenterEnd>
				<Button label="Create Link" onclick={createLink} />
			</CenterEnd>
		</Section>

		<Heading2>Synchronize</Heading2>
		<Section>
			<LabelSelect
				label="Synchronize Subscription"
				id="synchronize-subscription"
				{isStar}
				bind:value={synchronizeSubscription}
				options={(subscriptions ?? []).map(subscriptionOption)}
			/>
			<CenterEnd>
				<Button label="Synchronize" onclick={synchronize} />
			</CenterEnd>
		</Section>

		<Heading2>Notifications</Heading2>
		<Section>
			<div class="flex gap-2">
				<div class="w-1/4">
					<LabelInput
						label="Notification Limit"
						id="notification-limit"
						type="number"
						bind:value={notificationLimit}
					/>
				</div>
				<div class="w-full">
					<LabelSelect
						label="Selected Notification"
						id="notifications"
						bind:value={notificationId}
						options={(notifications ?? []).map(notificationOption)}
					/>
				</div>
			</div>
			<CenterEnd>
				<div class="flex gap-2">
					<Button label="Pull Notifications" onclick={pullNotifications} />
					{#if notification !== undefined}
						<Button label="JSON" onclick={() => download('Json')} />
						<Button label="PDF" onclick={() => download('Pdf')} />
						<Button label="Acknowledge" onclick={acknowledge} />
					{/if}
				</div>
			</CenterEnd>
		</Section>
	</div>
</div>
