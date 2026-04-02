/**
 * Copyright (c) 2026 Velocity BPA
 * 
 * Licensed under the Business Source License 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     https://github.com/VelocityBPA/n8n-nodes-dcentwallet/blob/main/LICENSE
 * 
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeApiError,
} from 'n8n-workflow';

export class DCENTWallet implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'D'CENT Wallet',
    name: 'dcentwallet',
    icon: 'file:dcentwallet.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the D'CENT Wallet API',
    defaults: {
      name: 'D'CENT Wallet',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'dcentwalletApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'WalletInfo',
            value: 'walletInfo',
          },
          {
            name: 'Account',
            value: 'account',
          },
          {
            name: 'Transaction',
            value: 'transaction',
          },
          {
            name: 'BiometricAuth',
            value: 'biometricAuth',
          },
          {
            name: 'MultiChain',
            value: 'multiChain',
          }
        ],
        default: 'walletInfo',
      },
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['walletInfo'],
		},
	},
	options: [
		{
			name: 'Get Device Info',
			value: 'getDeviceInfo',
			description: 'Get connected device information',
			action: 'Get device info',
		},
		{
			name: 'Get Device Status',
			value: 'getDeviceStatus',
			description: 'Check device connection status',
			action: 'Get device status',
		},
		{
			name: 'List Wallets',
			value: 'listWallets',
			description: 'Get all wallets on device',
			action: 'List wallets',
		},
		{
			name: 'Get Wallet',
			value: 'getWallet',
			description: 'Get specific wallet details',
			action: 'Get wallet',
		},
	],
	default: 'getDeviceInfo',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['account'] } },
  options: [
    { name: 'List Accounts', value: 'listAccounts', description: 'Get all accounts across chains', action: 'List accounts' },
    { name: 'Get Account', value: 'getAccount', description: 'Get specific account details', action: 'Get account' },
    { name: 'Create Account', value: 'createAccount', description: 'Create new account for coin type', action: 'Create account' },
    { name: 'Get Balance', value: 'getBalance', description: 'Get account balance', action: 'Get balance' },
    { name: 'Get Address', value: 'getAddress', description: 'Get account address with device confirmation', action: 'Get address' }
  ],
  default: 'listAccounts',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['transaction'] } },
  options: [
    { name: 'Prepare Transaction', value: 'prepareTransaction', description: 'Prepare transaction for signing', action: 'Prepare a transaction' },
    { name: 'Sign Transaction', value: 'signTransaction', description: 'Sign transaction with hardware device', action: 'Sign a transaction' },
    { name: 'Broadcast Transaction', value: 'broadcastTransaction', description: 'Broadcast signed transaction', action: 'Broadcast a transaction' },
    { name: 'Get Transaction', value: 'getTransaction', description: 'Get transaction details', action: 'Get a transaction' },
    { name: 'Get Transaction History', value: 'getTransactionHistory', description: 'Get transaction history', action: 'Get transaction history' }
  ],
  default: 'prepareTransaction',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['biometricAuth'],
		},
	},
	options: [
		{
			name: 'Enable Biometric',
			value: 'enableBiometric',
			description: 'Enable biometric authentication',
			action: 'Enable biometric authentication',
		},
		{
			name: 'Disable Biometric',
			value: 'disableBiometric',
			description: 'Disable biometric authentication',
			action: 'Disable biometric authentication',
		},
		{
			name: 'Get Biometric Status',
			value: 'getBiometricStatus',
			description: 'Check biometric authentication status',
			action: 'Get biometric authentication status',
		},
		{
			name: 'Verify Biometric',
			value: 'verifyBiometric',
			description: 'Verify biometric authentication',
			action: 'Verify biometric authentication',
		},
	],
	default: 'enableBiometric',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['multiChain'],
		},
	},
	options: [
		{
			name: 'Get Supported Coins',
			value: 'getSupportedCoins',
			description: 'Get list of supported cryptocurrencies',
			action: 'Get supported coins',
		},
		{
			name: 'Get Coin Info',
			value: 'getCoinInfo',
			description: 'Get specific coin information',
			action: 'Get coin info',
		},
		{
			name: 'Derive Address',
			value: 'deriveAddress',
			description: 'Derive address for specific coin type',
			action: 'Derive address',
		},
		{
			name: 'Estimate Fee',
			value: 'estimateFee',
			description: 'Estimate transaction fee for coin type',
			action: 'Estimate fee',
		},
	],
	default: 'getSupportedCoins',
},
{
	displayName: 'Wallet ID',
	name: 'walletId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['walletInfo'],
			operation: ['getWallet'],
		},
	},
	default: '',
	placeholder: 'Enter wallet ID',
	description: 'The ID of the wallet to retrieve',
},
{
  displayName: 'Coin Type',
  name: 'coinType',
  type: 'string',
  default: '',
  description: 'Cryptocurrency coin type (e.g., BTC, ETH)',
  displayOptions: {
    show: {
      resource: ['account'],
      operation: ['listAccounts', 'createAccount']
    }
  }
},
{
  displayName: 'Derivation Path',
  name: 'derivationPath',
  type: 'string',
  default: '',
  description: 'HD wallet derivation path',
  displayOptions: {
    show: {
      resource: ['account'],
      operation: ['listAccounts', 'createAccount']
    }
  }
},
{
  displayName: 'Account ID',
  name: 'accountId',
  type: 'string',
  required: true,
  default: '',
  description: 'The unique identifier of the account',
  displayOptions: {
    show: {
      resource: ['account'],
      operation: ['getAccount', 'getBalance', 'getAddress']
    }
  }
},
{
  displayName: 'Label',
  name: 'label',
  type: 'string',
  default: '',
  description: 'Human-readable label for the account',
  displayOptions: {
    show: {
      resource: ['account'],
      operation: ['createAccount']
    }
  }
},
{
  displayName: 'Verify',
  name: 'verify',
  type: 'boolean',
  default: true,
  description: 'Whether to verify address on hardware device',
  displayOptions: {
    show: {
      resource: ['account'],
      operation: ['getAddress']
    }
  }
},
{
  displayName: 'From Account',
  name: 'fromAccount',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['transaction'], operation: ['prepareTransaction'] } },
  default: '',
  description: 'Account ID to send from',
},
{
  displayName: 'To Address',
  name: 'toAddress',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['transaction'], operation: ['prepareTransaction'] } },
  default: '',
  description: 'Destination address',
},
{
  displayName: 'Amount',
  name: 'amount',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['transaction'], operation: ['prepareTransaction'] } },
  default: '',
  description: 'Amount to send',
},
{
  displayName: 'Coin Type',
  name: 'coinType',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['transaction'], operation: ['prepareTransaction', 'broadcastTransaction', 'getTransaction'] } },
  default: 'BTC',
  description: 'Type of cryptocurrency',
},
{
  displayName: 'Fee',
  name: 'fee',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['transaction'], operation: ['prepareTransaction'] } },
  default: '',
  description: 'Transaction fee (optional)',
},
{
  displayName: 'Transaction Data',
  name: 'transactionData',
  type: 'json',
  required: true,
  displayOptions: { show: { resource: ['transaction'], operation: ['signTransaction'] } },
  default: '',
  description: 'Prepared transaction data to sign',
},
{
  displayName: 'Account ID',
  name: 'accountId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['transaction'], operation: ['signTransaction', 'getTransactionHistory'] } },
  default: '',
  description: 'Account ID for transaction signing or history',
},
{
  displayName: 'Signed Transaction',
  name: 'signedTransaction',
  type: 'json',
  required: true,
  displayOptions: { show: { resource: ['transaction'], operation: ['broadcastTransaction'] } },
  default: '',
  description: 'Signed transaction data to broadcast',
},
{
  displayName: 'Transaction Hash',
  name: 'txHash',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['transaction'], operation: ['getTransaction'] } },
  default: '',
  description: 'Transaction hash to retrieve',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  required: false,
  displayOptions: { show: { resource: ['transaction'], operation: ['getTransactionHistory'] } },
  default: 50,
  description: 'Maximum number of transactions to retrieve',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  required: false,
  displayOptions: { show: { resource: ['transaction'], operation: ['getTransactionHistory'] } },
  default: 0,
  description: 'Number of transactions to skip',
},
{
	displayName: 'Auth Type',
	name: 'authType',
	type: 'options',
	required: true,
	displayOptions: {
		show: {
			resource: ['biometricAuth'],
			operation: ['enableBiometric'],
		},
	},
	options: [
		{
			name: 'Fingerprint',
			value: 'fingerprint',
		},
		{
			name: 'Face Recognition',
			value: 'face',
		},
		{
			name: 'Voice Recognition',
			value: 'voice',
		},
	],
	default: 'fingerprint',
	description: 'Type of biometric authentication to enable',
},
{
	displayName: 'Challenge',
	name: 'challenge',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['biometricAuth'],
			operation: ['verifyBiometric'],
		},
	},
	default: '',
	description: 'Challenge string for biometric verification',
},
{
	displayName: 'Coin Type',
	name: 'coinType',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['multiChain'],
			operation: ['getCoinInfo', 'deriveAddress', 'estimateFee'],
		},
	},
	default: '',
	description: 'The cryptocurrency coin type identifier',
},
{
	displayName: 'Derivation Path',
	name: 'derivationPath',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['multiChain'],
			operation: ['deriveAddress'],
		},
	},
	default: '',
	description: 'The derivation path for address generation',
},
{
	displayName: 'Verify',
	name: 'verify',
	type: 'boolean',
	displayOptions: {
		show: {
			resource: ['multiChain'],
			operation: ['deriveAddress'],
		},
	},
	default: false,
	description: 'Whether to verify the derived address on the device',
},
{
	displayName: 'Transaction Size',
	name: 'transactionSize',
	type: 'number',
	required: true,
	displayOptions: {
		show: {
			resource: ['multiChain'],
			operation: ['estimateFee'],
		},
	},
	default: 250,
	description: 'The size of the transaction in bytes',
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'walletInfo':
        return [await executeWalletInfoOperations.call(this, items)];
      case 'account':
        return [await executeAccountOperations.call(this, items)];
      case 'transaction':
        return [await executeTransactionOperations.call(this, items)];
      case 'biometricAuth':
        return [await executeBiometricAuthOperations.call(this, items)];
      case 'multiChain':
        return [await executeMultiChainOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executeWalletInfoOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('dcentwalletApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'getDeviceInfo': {
					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/device/info`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getDeviceStatus': {
					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/device/status`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'listWallets': {
					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/wallets`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getWallet': {
					const walletId = this.getNodeParameter('walletId', i) as string;
					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/wallets/${walletId}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(
						this.getNode(),
						`Unknown operation: ${operation}`,
						{ itemIndex: i },
					);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeAccountOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('dcentwalletApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      const baseHeaders = {
        'Authorization': `Bearer ${credentials.apiKey}`,
        'Content-Type': 'application/json',
      };

      switch (operation) {
        case 'listAccounts': {
          const coinType = this.getNodeParameter('coinType', i) as string;
          const derivationPath = this.getNodeParameter('derivationPath', i) as string;
          
          const queryParams = new URLSearchParams();
          if (coinType) queryParams.append('coinType', coinType);
          if (derivationPath) queryParams.append('derivationPath', derivationPath);
          
          const url = `${credentials.baseUrl}/accounts${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
          
          const options: any = {
            method: 'GET',
            url,
            headers: baseHeaders,
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAccount': {
          const accountId = this.getNodeParameter('accountId', i) as string;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/accounts/${accountId}`,
            headers: baseHeaders,
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createAccount': {
          const coinType = this.getNodeParameter('coinType', i) as string;
          const label = this.getNodeParameter('label', i) as string;
          const derivationPath = this.getNodeParameter('derivationPath', i) as string;
          
          const body: any = { coinType };
          if (label) body.label = label;
          if (derivationPath) body.derivationPath = derivationPath;
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/accounts`,
            headers: baseHeaders,
            body,
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getBalance': {
          const accountId = this.getNodeParameter('accountId', i) as string;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/accounts/${accountId}/balance`,
            headers: baseHeaders,
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAddress': {
          const accountId = this.getNodeParameter('accountId', i) as string;
          const verify = this.getNodeParameter('verify', i) as boolean;
          
          const queryParams = new URLSearchParams();
          queryParams.append('verify', verify.toString());
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/accounts/${accountId}/address?${queryParams.toString()}`,
            headers: baseHeaders,
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeTransactionOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('dcentwalletApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'prepareTransaction': {
          const fromAccount = this.getNodeParameter('fromAccount', i) as string;
          const toAddress = this.getNodeParameter('toAddress', i) as string;
          const amount = this.getNodeParameter('amount', i) as string;
          const coinType = this.getNodeParameter('coinType', i) as string;
          const fee = this.getNodeParameter('fee', i) as string;

          const body: any = {
            fromAccount,
            toAddress,
            amount,
            coinType,
          };

          if (fee) {
            body.fee = fee;
          }

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/transactions/prepare`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'signTransaction': {
          const transactionData = this.getNodeParameter('transactionData', i) as object;
          const accountId = this.getNodeParameter('accountId', i) as string;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/transactions/sign`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: {
              transactionData,
              accountId,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'broadcastTransaction': {
          const signedTransaction = this.getNodeParameter('signedTransaction', i) as object;
          const coinType = this.getNodeParameter('coinType', i) as string;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/transactions/broadcast`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: {
              signedTransaction,
              coinType,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getTransaction': {
          const txHash = this.getNodeParameter('txHash', i) as string;
          const coinType = this.getNodeParameter('coinType', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/transactions/${txHash}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            qs: {
              coinType,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getTransactionHistory': {
          const accountId = this.getNodeParameter('accountId', i) as string;
          const limit = this.getNodeParameter('limit', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/accounts/${accountId}/transactions`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            qs: {
              limit,
              offset,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeBiometricAuthOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('dcentwalletApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'enableBiometric': {
					const authType = this.getNodeParameter('authType', i) as string;
					
					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/auth/biometric/enable`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						body: {
							authType,
						},
						json: true,
					};
					
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'disableBiometric': {
					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/auth/biometric/disable`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};
					
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getBiometricStatus': {
					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/auth/biometric/status`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
						},
						json: true,
					};
					
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'verifyBiometric': {
					const challenge = this.getNodeParameter('challenge', i) as string;
					
					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/auth/biometric/verify`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						body: {
							challenge,
						},
						json: true,
					};
					
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: {
					item: i,
				},
			});
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: {
						error: error.message,
					},
					pairedItem: {
						item: i,
					},
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeMultiChainOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('dcentwalletApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'getSupportedCoins': {
					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/coins/supported`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getCoinInfo': {
					const coinType = this.getNodeParameter('coinType', i) as string;
					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/coins/${coinType}/info`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'deriveAddress': {
					const coinType = this.getNodeParameter('coinType', i) as string;
					const derivationPath = this.getNodeParameter('derivationPath', i) as string;
					const verify = this.getNodeParameter('verify', i) as boolean;

					const body: any = {
						derivationPath,
						verify,
					};

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/coins/${coinType}/derive`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						body,
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'estimateFee': {
					const coinType = this.getNodeParameter('coinType', i) as string;
					const transactionSize = this.getNodeParameter('transactionSize', i) as number;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/coins/${coinType}/fee`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						qs: {
							transactionSize,
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(
						this.getNode(),
						`Unknown operation: ${operation}`,
						{ itemIndex: i },
					);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}
