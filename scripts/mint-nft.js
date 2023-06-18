require("dotenv").config();
const API_URL = process.env.API_URL;
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(API_URL);

const contract = require("../artifacts/contracts/MyMFT.sol/MyNFT.json");

console.log(JSON.stringify(contract.abi));
const contractAddress = "0x031ac728C205DAbCF3a2b0E53cDD12E625451eAb";
const nftContract = new web3.eth.Contract(contract.abi, contractAddress);

// Create transaction
async function mintNFT(tokenURI) {
  try {
    const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, "latest"); // Get latest nonce

    // The transaction
    const tx = {
      from: PUBLIC_KEY,
      to: contractAddress,
      nonce: nonce,
      gas: 500000,
      data: nftContract.methods.mintNFT(PUBLIC_KEY, tokenURI).encodeABI(),
    };

    const signedTx = await web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

    console.log(
      "The hash of your transaction is:",
      receipt.transactionHash,
      "\nCheck Alchemy's Mempool to view the status of your transaction!"
    );
  } catch (error) {
    console.log("Something went wrong when submitting your transaction:", error);
  }
}

mintNFT("https://app.pinata.cloud/pinmanager#/QmdUiyGLDsTF3rHVQ5DukDabuP8MLaG7P4eE88wwFhtQA7");
