const MMSDK = new MetaMaskSDK.MetaMaskSDK();

const ethereum = MMSDK.getProvider();
let currentAccount = null;

const connectButton = document.getElementById('connectButton');
const accountArea = document.getElementById('accountArea');
const accountDisplay = document.getElementById('accountDisplay');
const networkDisplay = document.getElementById('networkDisplay');
const getBalanceButton = document.getElementById('getBalanceButton');
const balanceDisplay = document.getElementById('balanceDisplay');

async function connect() {
    try {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        handleAccountsChanged(accounts);
    } catch (error) {
        console.error(error);
        alert('Failed to connect to MetaMask');
    }
}

async function getNetwork() {
    try {
        const chainId = await ethereum.request({ method: 'eth_chainId' });
        const networkMap = {
            '0x1': 'Ethereum Mainnet',
            '0x5': 'Goerli Testnet',
            '0x89': 'Polygon Mainnet',
            '0x13881': 'Mumbai Testnet'
        };
        return networkMap[chainId] || `Chain ID: ${chainId}`;
    } catch (error) {
        console.error(error);
        return 'Unknown Network';
    }
}

async function getBalance(account) {
    try {
        const balance = await ethereum.request({
            method: 'eth_getBalance',
            params: [account, 'latest']
        });
        return parseFloat(parseInt(balance, 16) / Math.pow(10, 18)).toFixed(4);
    } catch (error) {
        console.error(error);
        return 'Error getting balance';
    }
}

function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
        accountArea.style.display = 'none';
        connectButton.textContent = 'Connect MetaMask';
        currentAccount = null;
    } else if (accounts[0] !== currentAccount) {
        currentAccount = accounts[0];
        accountDisplay.textContent = currentAccount;
        accountArea.style.display = 'block';
        connectButton.textContent = 'Connected';
        updateNetworkInfo();
    }
}

async function updateNetworkInfo() {
    networkDisplay.textContent = await getNetwork();
}

connectButton.addEventListener('click', connect);
getBalanceButton.addEventListener('click', async () => {
    if (currentAccount) {
        balanceDisplay.textContent = await getBalance(currentAccount) + ' ETH';
    }
});

// Listen for account changes
ethereum.on('accountsChanged', handleAccountsChanged);

// Listen for network changes
ethereum.on('chainChanged', () => {
    window.location.reload();
});
