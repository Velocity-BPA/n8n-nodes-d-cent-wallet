/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { DCENTWallet } from '../nodes/D'CENT Wallet/D'CENT Wallet.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('DCENTWallet Node', () => {
  let node: DCENTWallet;

  beforeAll(() => {
    node = new DCENTWallet();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('D'CENT Wallet');
      expect(node.description.name).toBe('dcentwallet');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 5 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(5);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(5);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('WalletInfo Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-key',
				baseUrl: 'https://bridge.dcentwallet.com/v1',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
				requestWithAuthentication: jest.fn(),
			},
		};
	});

	describe('getDeviceInfo operation', () => {
		it('should get device info successfully', async () => {
			const mockResponse = { deviceId: 'device123', model: 'DCENT Biometric', firmware: '2.9.2' };
			mockExecuteFunctions.getNodeParameter.mockReturnValue('getDeviceInfo');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeWalletInfoOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://bridge.dcentwallet.com/v1/device/info',
				headers: {
					'Authorization': 'Bearer test-key',
					'Content-Type': 'application/json',
				},
				json: true,
			});
		});

		it('should handle getDeviceInfo error', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValue('getDeviceInfo');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Device not connected'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeWalletInfoOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: { error: 'Device not connected' }, pairedItem: { item: 0 } }]);
		});
	});

	describe('getDeviceStatus operation', () => {
		it('should get device status successfully', async () => {
			const mockResponse = { connected: true, status: 'ready' };
			mockExecuteFunctions.getNodeParameter.mockReturnValue('getDeviceStatus');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeWalletInfoOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});

		it('should handle getDeviceStatus error', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValue('getDeviceStatus');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Status check failed'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeWalletInfoOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: { error: 'Status check failed' }, pairedItem: { item: 0 } }]);
		});
	});

	describe('listWallets operation', () => {
		it('should list wallets successfully', async () => {
			const mockResponse = { wallets: [{ id: 'wallet1', name: 'Main Wallet' }] };
			mockExecuteFunctions.getNodeParameter.mockReturnValue('listWallets');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeWalletInfoOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});

		it('should handle listWallets error', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValue('listWallets');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Failed to list wallets'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeWalletInfoOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: { error: 'Failed to list wallets' }, pairedItem: { item: 0 } }]);
		});
	});

	describe('getWallet operation', () => {
		it('should get wallet successfully', async () => {
			const mockResponse = { id: 'wallet123', name: 'Test Wallet', balance: '1000' };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getWallet')
				.mockReturnValueOnce('wallet123');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeWalletInfoOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://bridge.dcentwallet.com/v1/wallets/wallet123',
				headers: {
					'Authorization': 'Bearer test-key',
					'Content-Type': 'application/json',
				},
				json: true,
			});
		});

		it('should handle getWallet error', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getWallet')
				.mockReturnValueOnce('invalid-wallet');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Wallet not found'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeWalletInfoOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: { error: 'Wallet not found' }, pairedItem: { item: 0 } }]);
		});
	});
});

describe('Account Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://bridge.dcentwallet.com/v1'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn()
      },
    };
  });

  describe('listAccounts operation', () => {
    it('should list all accounts successfully', async () => {
      const mockResponse = { accounts: [{ id: '123', coinType: 'BTC' }] };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('listAccounts')
        .mockReturnValueOnce('BTC')
        .mockReturnValueOnce("m/44'/0'/0'");
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: "https://bridge.dcentwallet.com/v1/accounts?coinType=BTC&derivationPath=m%2F44'%2F0'%2F0'",
        headers: expect.objectContaining({
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json'
        }),
        json: true
      });
    });

    it('should handle listAccounts error', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('listAccounts');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
    });
  });

  describe('getAccount operation', () => {
    it('should get account details successfully', async () => {
      const mockResponse = { id: '123', coinType: 'BTC', balance: '1000000' };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getAccount')
        .mockReturnValueOnce('123');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://bridge.dcentwallet.com/v1/accounts/123',
        headers: expect.objectContaining({
          'Authorization': 'Bearer test-api-key'
        }),
        json: true
      });
    });
  });

  describe('createAccount operation', () => {
    it('should create account successfully', async () => {
      const mockResponse = { id: '456', coinType: 'ETH', label: 'Test Account' };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('createAccount')
        .mockReturnValueOnce('ETH')
        .mockReturnValueOnce('Test Account')
        .mockReturnValueOnce("m/44'/60'/0'");
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://bridge.dcentwallet.com/v1/accounts',
        headers: expect.objectContaining({
          'Authorization': 'Bearer test-api-key'
        }),
        body: {
          coinType: 'ETH',
          label: 'Test Account',
          derivationPath: "m/44'/60'/0'"
        },
        json: true
      });
    });
  });

  describe('getBalance operation', () => {
    it('should get account balance successfully', async () => {
      const mockResponse = { balance: '1500000', confirmed: '1500000', unconfirmed: '0' };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getBalance')
        .mockReturnValueOnce('123');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://bridge.dcentwallet.com/v1/accounts/123/balance',
        headers: expect.objectContaining({
          'Authorization': 'Bearer test-api-key'
        }),
        json: true
      });
    });
  });

  describe('getAddress operation', () => {
    it('should get account address successfully', async () => {
      const mockResponse = { address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', verified: true };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getAddress')
        .mockReturnValueOnce('123')
        .mockReturnValueOnce(true);
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://bridge.dcentwallet.com/v1/accounts/123/address?verify=true',
        headers: expect.objectContaining({
          'Authorization': 'Bearer test-api-key'
        }),
        json: true
      });
    });
  });
});

describe('Transaction Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://bridge.dcentwallet.com/v1' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  test('should prepare transaction successfully', async () => {
    const mockResponse = { transactionId: 'tx123', prepared: true };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('prepareTransaction')
      .mockReturnValueOnce('account1')
      .mockReturnValueOnce('1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2')
      .mockReturnValueOnce('0.001')
      .mockReturnValueOnce('BTC')
      .mockReturnValueOnce('0.00001');

    const result = await executeTransactionOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://bridge.dcentwallet.com/v1/transactions/prepare',
      headers: {
        'Authorization': 'Bearer test-key',
        'Content-Type': 'application/json',
      },
      body: {
        fromAccount: 'account1',
        toAddress: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
        amount: '0.001',
        coinType: 'BTC',
        fee: '0.00001',
      },
      json: true,
    });
  });

  test('should sign transaction successfully', async () => {
    const mockResponse = { signedTransaction: 'signed_tx_data', success: true };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('signTransaction')
      .mockReturnValueOnce({ rawTransaction: 'tx_data' })
      .mockReturnValueOnce('account1');

    const result = await executeTransactionOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  test('should broadcast transaction successfully', async () => {
    const mockResponse = { txHash: '0x123abc', broadcasted: true };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('broadcastTransaction')
      .mockReturnValueOnce({ signedData: 'signed_tx' })
      .mockReturnValueOnce('BTC');

    const result = await executeTransactionOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  test('should get transaction successfully', async () => {
    const mockResponse = { txHash: '0x123abc', status: 'confirmed', amount: '0.001' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getTransaction')
      .mockReturnValueOnce('0x123abc')
      .mockReturnValueOnce('BTC');

    const result = await executeTransactionOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  test('should get transaction history successfully', async () => {
    const mockResponse = { transactions: [{ txHash: '0x123' }], total: 1 };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getTransactionHistory')
      .mockReturnValueOnce('account1')
      .mockReturnValueOnce(50)
      .mockReturnValueOnce(0);

    const result = await executeTransactionOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  test('should handle API errors', async () => {
    const mockError = new Error('API Error');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(mockError);
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('prepareTransaction');

    await expect(executeTransactionOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('API Error');
  });

  test('should continue on fail when configured', async () => {
    const mockError = new Error('API Error');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(mockError);
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('prepareTransaction');

    const result = await executeTransactionOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
  });
});

describe('BiometricAuth Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-key',
				baseUrl: 'https://bridge.dcentwallet.com/v1',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
				requestWithAuthentication: jest.fn(),
			},
		};
	});

	describe('enableBiometric', () => {
		it('should enable biometric authentication successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('enableBiometric')
				.mockReturnValueOnce('fingerprint');
			
			const mockResponse = { success: true, authType: 'fingerprint' };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeBiometricAuthOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{
				json: mockResponse,
				pairedItem: { item: 0 },
			}]);
		});

		it('should handle enable biometric error', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('enableBiometric')
				.mockReturnValueOnce('fingerprint');
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);
			
			const error = new Error('Enable failed');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);

			const result = await executeBiometricAuthOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{
				json: { error: 'Enable failed' },
				pairedItem: { item: 0 },
			}]);
		});
	});

	describe('disableBiometric', () => {
		it('should disable biometric authentication successfully', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('disableBiometric');
			
			const mockResponse = { success: true, message: 'Biometric disabled' };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeBiometricAuthOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{
				json: mockResponse,
				pairedItem: { item: 0 },
			}]);
		});

		it('should handle disable biometric error', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('disableBiometric');
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);
			
			const error = new Error('Disable failed');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);

			const result = await executeBiometricAuthOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{
				json: { error: 'Disable failed' },
				pairedItem: { item: 0 },
			}]);
		});
	});

	describe('getBiometricStatus', () => {
		it('should get biometric status successfully', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getBiometricStatus');
			
			const mockResponse = { enabled: true, authTypes: ['fingerprint'] };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeBiometricAuthOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{
				json: mockResponse,
				pairedItem: { item: 0 },
			}]);
		});

		it('should handle get status error', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getBiometricStatus');
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);
			
			const error = new Error('Status check failed');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);

			const result = await executeBiometricAuthOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{
				json: { error: 'Status check failed' },
				pairedItem: { item: 0 },
			}]);
		});
	});

	describe('verifyBiometric', () => {
		it('should verify biometric authentication successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('verifyBiometric')
				.mockReturnValueOnce('challenge123');
			
			const mockResponse = { verified: true, challenge: 'challenge123' };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeBiometricAuthOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{
				json: mockResponse,
				pairedItem: { item: 0 },
			}]);
		});

		it('should handle verify biometric error', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('verifyBiometric')
				.mockReturnValueOnce('challenge123');
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);
			
			const error = new Error('Verification failed');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);

			const result = await executeBiometricAuthOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{
				json: { error: 'Verification failed' },
				pairedItem: { item: 0 },
			}]);
		});
	});
});

describe('MultiChain Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-api-key',
				baseUrl: 'https://bridge.dcentwallet.com/v1',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	describe('getSupportedCoins operation', () => {
		it('should get supported coins successfully', async () => {
			const mockResponse = {
				coins: [
					{ symbol: 'BTC', name: 'Bitcoin', coinType: 0 },
					{ symbol: 'ETH', name: 'Ethereum', coinType: 60 },
				],
			};

			mockExecuteFunctions.getNodeParameter.mockReturnValue('getSupportedCoins');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeMultiChainOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toEqual([
				{
					json: mockResponse,
					pairedItem: { item: 0 },
				},
			]);
		});

		it('should handle getSupportedCoins error', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValue('getSupportedCoins');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeMultiChainOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toEqual([
				{
					json: { error: 'API Error' },
					pairedItem: { item: 0 },
				},
			]);
		});
	});

	describe('getCoinInfo operation', () => {
		it('should get coin info successfully', async () => {
			const mockResponse = {
				symbol: 'BTC',
				name: 'Bitcoin',
				coinType: 0,
				decimals: 8,
				network: 'mainnet',
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getCoinInfo')
				.mockReturnValueOnce('BTC');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeMultiChainOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toEqual([
				{
					json: mockResponse,
					pairedItem: { item: 0 },
				},
			]);
		});
	});

	describe('deriveAddress operation', () => {
		it('should derive address successfully', async () => {
			const mockResponse = {
				address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
				publicKey: '04678afdb0fe5548271967f1a67130b7105cd6a828e03909a67962e0ea1f61deb649f6bc3f4cef38c4f35504e51ec112de5c384df7ba0b8d578a4c702b6bf11d5f',
				derivationPath: "m/44'/0'/0'/0/0",
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('deriveAddress')
				.mockReturnValueOnce('BTC')
				.mockReturnValueOnce("m/44'/0'/0'/0/0")
				.mockReturnValueOnce(false);
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeMultiChainOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toEqual([
				{
					json: mockResponse,
					pairedItem: { item: 0 },
				},
			]);
		});
	});

	describe('estimateFee operation', () => {
		it('should estimate fee successfully', async () => {
			const mockResponse = {
				coinType: 'BTC',
				estimatedFee: 0.00001,
				feeRate: 10,
				transactionSize: 250,
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('estimateFee')
				.mockReturnValueOnce('BTC')
				.mockReturnValueOnce(250);
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeMultiChainOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toEqual([
				{
					json: mockResponse,
					pairedItem: { item: 0 },
				},
			]);
		});
	});
});
});
