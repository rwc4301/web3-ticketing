import { BrowserProvider, Signer } from "ethers";

export async function connectWallet(): Promise<Signer | null> {
    try {
        if (typeof window.ethereum === "undefined") {
            alert("Please install MetaMask!");
            return null;
        }
            
        const provider = new BrowserProvider(window.ethereum);
            
        await provider.send("eth_requestAccounts", []);
        return provider.getSigner(); 
    }
    catch (error) {
        console.error("Error connecting to wallet:", error);
        alert("Failed to connect to wallet. Please try again.");
        return null;
    }
}