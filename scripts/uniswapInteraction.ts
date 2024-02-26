import { ethers } from 'ethers';
import { UniswapRouterABI } from '../contracts/UniswapRouterABI.sol';


 // Import Uniswap Router ABI

// Define your Ethereum provider (e.g., Infura)
const provider = new ethers.providers.JsonRpcProvider('YOUR_INFURA_ENDPOINT');

// Define your Ethereum wallet with private key
const privateKey = 'a0ede47fdc7ea1c70461bec7db9c39771554b4e39f2fdf5af4193d3cb044ffb8';
const wallet = new ethers.Wallet(privateKey, provider);

// Address of the Uniswap Router contract
const uniswapRouterAddress = '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD';

// Instantiate Uniswap Router contract
const uniswapRouterContract = new ethers.Contract(uniswapRouterAddress, UniswapRouterABI, wallet);

// Example function to swap tokens on Uniswap
async function swapTokens() {
    // Set up transaction parameters
    const amountIn = ethers.utils.parseEther('0.1'); // Amount of input token
    const amountOutMin = 0; // Minimum amount of output token
    const path = ['0x1f9840a85d5af5bf1d1762f925bdaddc4201f984', '0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6']; // Token swap path
    const to = 'RECIPIENT_ADDRESS'; // Recipient of the swapped tokens
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from now

    // Call the swapExactTokensForTokens function on Uniswap Router
    const tx = await uniswapRouterContract.swapExactTokensForTokens(
        amountIn,
        amountOutMin,
        path,
        to,
        deadline,
        { gasLimit: 4000000 } // Adjust gas limit as necessary
    );

    // Wait for transaction to be mined
    await tx.wait();
    console.log('Tokens swapped successfully!');
}

// Example function to add liquidity on Uniswap
async function addLiquidity() {
    // Set up transaction parameters
    const tokenA = '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984';
    const tokenB = '0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6';
    const amountADesired = ethers.utils.parseEther('0.1'); // Desired amount of WETH
    const amountBDesired = ethers.utils.parseEther('0.2'); // Desired amount of WBTC
    const amountAMin = 10; // Minimum amount of WETH
    const amountBMin = 10; // Minimum amount of WBTC
    const to = '0xaAa9637522506Ee1600d10AF37705dADA816bE2A'; // Recipient of the liquidity tokens
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from now

    // Call the addLiquidity function on Uniswap Router
    const tx = await uniswapRouterContract.addLiquidity(
        tokenA,
        tokenB,
        amountADesired,
        amountBDesired,
        amountAMin,
        amountBMin,
        to,
        deadline,
        { gasLimit: 4000000 } // Adjust gas limit as necessary
    );

    // Wait for transaction to be mined
    await tx.wait();
    console.log('Liquidity added successfully!');
}

// Execute the functions
swapTokens().then(() => addLiquidity());
