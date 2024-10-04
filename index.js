require("dotenv").config();
const { ethers } = require("ethers");
const ERC20ABI = require("./ERC20ABI.json");
const ERC721ABI = require("./ERC721ABI.json");

const provider = new ethers.providers.JsonRpcProvider(
  process.env.PROVIDER_URL
);
const COIN_CONTRACT_ADDRESS = process.env.ERC20_CONTRACT_ADDRESS;
const NFT_CONTRACT_ADDRESS = process.env.ERC721_NFT_CONTRACT_ADDRESS;
const depositWallet = new ethers.Wallet(
  process.env.DEPOSIT_WALLET_PRIVATE_KEY,
  provider
);

const COIN = new ethers.Contract(COIN_CONTRACT_ADDRESS, ERC20ABI, provider);
const NFT = new ethers.Contract(NFT_CONTRACT_ADDRESS, ERC721ABI, provider);

const bot = async () => {
  const depositWalletAddress = await depositWallet.getAddress();
  console.log(`Withdraw from address: ${depositWalletAddress}`);
  provider.on("block", async () => {
    console.log(">>> Checking ...");
    const balance = await COIN.balanceOf(depositWalletAddress);
    const balanceFormatted = ethers.utils.formatUnits(balance, 18);
    // const getNFT = await NFT.balanceOf(depositWalletAddress);
    if (Number(balanceFormatted) > 0) {
      const contractSigner = COIN.connect(depositWallet);
      console.log(`Balance : ${balanceFormatted}`);
      const gasPrice = await provider.getGasPrice();
      const amount = ethers.utils.parseUnits(balanceFormatted.toString(), 18);
      try {
        await contractSigner.transfer(
          process.env.VAULT_WALLET_ADDRESS,
          amount,
          {
            gasPrice: gasPrice,
          }
        );
        console.log(`Withdraw success -->${balanceFormatted}`);
      } catch (e) {
        console.log(`Withdraw failed -->${balanceFormatted}`);
      }
    } else {
      // console.log("!");
    }
  });
};

bot();
