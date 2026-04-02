import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class DCENTWalletApi implements ICredentialType {
	name = 'dCENTWalletApi';
	displayName = 'D\'CENT Wallet API';
	documentationUrl = 'https://bridge.dcentwallet.com/docs';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'The API key for D\'CENT Wallet bridge communication',
		},
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://bridge.dcentwallet.com/v1',
			description: 'Base URL for the D\'CENT Wallet API',
		},
	];
}