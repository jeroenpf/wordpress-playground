import type { Remote } from 'comlink';
import type { PlaygroundClient } from '@wp-playground/remote';
import { consumeAPI } from '@php-wasm/web';
export type { PHPRequest, PHPServerRequest, PHPResponse } from '@php-wasm/web';
export * from './lib';

export type { PlaygroundClient };

export interface ConnectPlaygroundOptions {
	loadRemote?: string;
}

export async function connectPlayground(
	iframe: HTMLIFrameElement,
	options?: ConnectPlaygroundOptions
): Promise<PlaygroundClient> {
	if (options?.loadRemote) {
		iframe.src = options?.loadRemote;
		await new Promise((resolve) => {
			iframe.addEventListener('load', resolve, false);
		});
	}
	const comlinkClient: Remote<PlaygroundClient> =
		consumeAPI<PlaygroundClient>(iframe.contentWindow!);

	// Wait for any response from the playground to ensure the comlink
	// handler on the other side is ready:
	await comlinkClient.absoluteUrl;

	/*
	 * PlaygroundClient is compatible with Remote<PlaygroundClient>,
	 * but has a better DX. Let's for a typecast:
	 */
	return comlinkClient as PlaygroundClient;
}