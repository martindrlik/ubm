export interface Subscription {
	subscriptionId: string;
	sourceName: string;
}

export function option(x: Subscription): {
	label: string;
	value: string;
} {
	return { label: `${x.subscriptionId} ${x.sourceName}`, value: x.subscriptionId };
}
