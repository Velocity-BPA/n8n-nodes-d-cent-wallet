# n8n-nodes-d-cent-wallet

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

An n8n community node for integrating with D'CENT hardware wallets. This node provides 5 comprehensive resources enabling wallet information retrieval, account management, transaction processing, biometric authentication, and multi-chain operations for secure blockchain interactions.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Hardware Wallet](https://img.shields.io/badge/D'CENT-Hardware%20Wallet-green)
![Blockchain](https://img.shields.io/badge/Multi-Chain-Support-orange)
![Security](https://img.shields.io/badge/Biometric-Authentication-red)

## Features

- **Wallet Information** - Retrieve wallet status, firmware version, device info, and configuration details
- **Account Management** - Create, retrieve, and manage cryptocurrency accounts across multiple blockchains
- **Transaction Processing** - Sign and broadcast transactions with hardware-level security
- **Biometric Authentication** - Leverage fingerprint and face recognition for secure access control
- **Multi-Chain Support** - Work with Bitcoin, Ethereum, and 100+ supported cryptocurrencies
- **Hardware Security** - Utilize secure element protection for private key management
- **Device Integration** - Direct communication with D'CENT hardware wallets
- **Real-time Status** - Monitor wallet connectivity and operational status

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-d-cent-wallet`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-d-cent-wallet
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-d-cent-wallet.git
cd n8n-nodes-d-cent-wallet
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-d-cent-wallet
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Key | D'CENT wallet API key for device authentication | Yes |
| Device ID | Unique identifier for your D'CENT hardware wallet | Yes |
| Environment | API environment (production/sandbox) | No |

## Resources & Operations

### 1. WalletInfo

| Operation | Description |
|-----------|-------------|
| Get Status | Retrieve current wallet connection and operational status |
| Get Firmware Version | Check installed firmware version and available updates |
| Get Device Info | Obtain device model, serial number, and hardware specifications |
| Get Configuration | Retrieve wallet settings and security configurations |
| Update Settings | Modify wallet preferences and security options |

### 2. Account

| Operation | Description |
|-----------|-------------|
| Create Account | Generate new cryptocurrency account for specified blockchain |
| Get Account | Retrieve account details including address and balance |
| List Accounts | Get all accounts associated with the wallet |
| Get Balance | Check current balance for specific account |
| Get Address | Retrieve public address for receiving funds |
| Delete Account | Remove account from wallet (requires confirmation) |

### 3. Transaction

| Operation | Description |
|-----------|-------------|
| Create Transaction | Prepare new transaction with recipient and amount details |
| Sign Transaction | Sign transaction using hardware wallet security |
| Broadcast Transaction | Submit signed transaction to blockchain network |
| Get Transaction | Retrieve transaction details by hash or ID |
| List Transactions | Get transaction history for specific account |
| Estimate Fee | Calculate network fees for pending transaction |
| Verify Transaction | Confirm transaction authenticity and status |

### 4. BiometricAuth

| Operation | Description |
|-----------|-------------|
| Register Fingerprint | Enroll new fingerprint for wallet authentication |
| Authenticate | Verify identity using registered biometric data |
| List Registered | Get all enrolled biometric identifiers |
| Remove Biometric | Delete specific biometric registration |
| Get Auth Status | Check current authentication state |
| Configure Settings | Modify biometric authentication preferences |

### 5. MultiChain

| Operation | Description |
|-----------|-------------|
| List Supported Chains | Get all blockchain networks supported by wallet |
| Switch Chain | Change active blockchain network |
| Get Chain Info | Retrieve details about specific blockchain network |
| Add Custom Chain | Register new blockchain network configuration |
| Remove Chain | Delete custom blockchain network from wallet |
| Sync Chain Data | Update blockchain network information and settings |

## Usage Examples

```javascript
// Get wallet status and firmware version
{
  "operation": "getStatus",
  "returnAll": true,
  "options": {
    "includeDetails": true
  }
}
```

```javascript
// Create new Ethereum account
{
  "operation": "createAccount",
  "blockchain": "ethereum",
  "accountName": "ETH Trading Account",
  "derivationPath": "m/44'/60'/0'/0/0"
}
```

```javascript
// Sign Bitcoin transaction
{
  "operation": "signTransaction",
  "blockchain": "bitcoin",
  "recipientAddress": "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
  "amount": 0.001,
  "feeRate": 10
}
```

```javascript
// Authenticate with fingerprint
{
  "operation": "authenticate",
  "method": "fingerprint",
  "timeout": 30,
  "retryCount": 3
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| Device Not Connected | D'CENT wallet is not connected or recognized | Check USB connection and ensure device is unlocked |
| Invalid API Key | Authentication failed with provided credentials | Verify API key and device ID in node credentials |
| Insufficient Balance | Account balance too low for transaction | Check account balance or reduce transaction amount |
| Biometric Failure | Fingerprint or face recognition failed | Clean sensor, retry authentication, or use PIN backup |
| Chain Not Supported | Blockchain network not available on device | Update firmware or select supported blockchain |
| Transaction Timeout | Signing process exceeded time limit | Retry transaction and respond promptly to device prompts |

## Development

```bash
npm install
npm run build
npm test
npm run lint
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-d-cent-wallet/issues)
- **D'CENT API Documentation**: [D'CENT Developer Portal](https://developer.dcentwallet.com)
- **Hardware Wallet Support**: [D'CENT Official Support](https://dcentwallet.com/support)