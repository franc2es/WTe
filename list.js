<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NFT Listing & Offer</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
        }
        h1, h2 {
            color: #333;
        }
        label {
            display: inline-block;
            width: 120px;
            margin-bottom: 5px;
            font-weight: bold;
        }
        input, button {
            margin-bottom: 15px;
            padding: 5px;
            width: 250px;
        }
        .result {
            margin-top: 20px;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
        }
        .success {
            color: green;
        }
        .error {
            color: red;
        }
    </style>
</head>
<body>

    <h1>NFT Listing & Offer</h1>

    <button id="connectWalletButton">Connect Wallet</button>
    <div style="margin-top: 10px;" id="account">Account:</div>

    <!-- Form for Creating Offer -->
    <h2>Create Offer</h2>
    <form id="offerForm">
        <label for="offerTokenAddress">Token Address:</label>
        <input type="text" id="offerTokenAddress" required><br>

        <label for="offerTokenId">Token ID:</label>
        <input type="text" id="offerTokenId" required><br>

        <label for="offerAmount">Offer Amount:</label>
        <input type="text" id="offerAmount" required><br>

        <button type="button" id="submitOfferButton">Submit Offer</button>
    </form>

    <!-- Form for Creating Listing -->
    <h2>Create Listing</h2>
    <form id="listingForm">
        <label for="listingTokenAddress">Token Address:</label>
        <input type="text" id="listingTokenAddress" required><br>

        <label for="listingTokenId">Token ID:</label>
        <input type="text" id="listingTokenId" required><br>

        <label for="listingAmount">Listing Amount:</label>
        <input type="text" id="listingAmount" required><br>

        <button type="button" id="submitListingButton">Submit Listing</button>
    </form>

    <!-- Result Display -->
    <div id="result" class="result"></div>

    <script type="module">
        let WALLET_ADDRESS = null;
        let sdk = null; // Initialize your SDK here

        // Connect Wallet
        const connectWallet = async () => {
            if (window.ethereum) {
                try {
                    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                    WALLET_ADDRESS = accounts[0];
                    document.getElementById("account").textContent = `Account: ${WALLET_ADDRESS}`;
                } catch (error) {
                    console.error("Error connecting to wallet:", error);
                }
            } else {
                alert("Please install MetaMask or another Ethereum-compatible wallet extension.");
            }
        };

        // Create Offer
        const createOffer = async () => {
            if (!WALLET_ADDRESS) {
                updateResult("Please connect your wallet first.", false);
                return;
            }

            const tokenAddress = document.getElementById("offerTokenAddress").value;
            const tokenId = document.getElementById("offerTokenId").value;
            const offerAmount = document.getElementById("offerAmount").value;

            const offer = {
                accountAddress: WALLET_ADDRESS,
                startAmount: offerAmount,
                asset: {
                    tokenAddress: tokenAddress,
                    tokenId: tokenId,
                },
            };

            try {
                const response = await sdk.createOffer(offer);
                updateResult(`Successfully created an offer! Order Hash: ${response.orderHash}`, true);
            } catch (error) {
                updateResult(`Error in createOffer: ${error.message}`, false);
            }
        };

        // Create Listing
        const createListing = async (tokenAddress, tokenId, listingAmount) => {
            const listing = {
                accountAddress: WALLET_ADDRESS,
                startAmount: listingAmount,
                asset: {
                    tokenAddress: tokenAddress,
                    tokenId: tokenId,
                },
            };

            try {
                const response = await sdk.createListing(listing);
                updateResult(`Successfully created a listing! Order Hash: ${response.orderHash}`, true);
            } catch (error) {
                updateResult(`Error in createListing: ${error.message}`, false);
            }
        };

        // Trigger Listing
        const triggerListing = () => {
            const tokenAddress = document.getElementById("listingTokenAddress").value;
            const tokenId = document.getElementById("listingTokenId").value;
            const listingAmount = document.getElementById("listingAmount").value;

            createListing(tokenAddress, tokenId, listingAmount).catch((error) => {
                updateResult(`Error in createListing: ${error.message}`, false);
            });
        };

        // Update result display
        const updateResult = (message, isSuccess = true) => {
            const resultDiv = document.getElementById("result");
            resultDiv.className = isSuccess ? 'result success' : 'result error';
            resultDiv.textContent = message;
        };

        // Bind events
        document.getElementById("connectWalletButton").onclick = connectWallet;
        document.getElementById("submitOfferButton").onclick = createOffer;
        document.getElementById("submitListingButton").onclick = triggerListing;

    </script>

</body>
</html>
