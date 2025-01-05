// Add type declaration for ethereum provider
declare global {
  interface Window {
      ethereum?: ethers.providers.ExternalProvider;
  }
}
