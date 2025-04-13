
import { MedicalSummary } from '@/components/SummaryCard';

// Simulate a local server for storing and retrieving NFT data
class MockLocalServer {
  private static instance: MockLocalServer;
  private storage: Map<string, MedicalSummary>;
  private connectedWallet: string | null = null;
  private readonly defaultWalletAddress = '0xc44428675a04509cea912d79a922da889328c739da67274abc7974d68c21de96';
  
  private constructor() {
    this.storage = new Map();
    
    // Initialize with local storage data if available
    const storedData = localStorage.getItem('healthscribe_nfts');
    if (storedData) {
      const parsedData = JSON.parse(storedData) as MedicalSummary[];
      parsedData.forEach(summary => {
        this.storage.set(summary.id, summary);
      });
    }
  }
  
  public static getInstance(): MockLocalServer {
    if (!MockLocalServer.instance) {
      MockLocalServer.instance = new MockLocalServer();
    }
    return MockLocalServer.instance;
  }
  
  // Get default wallet address
  public getDefaultWalletAddress(): string {
    return this.defaultWalletAddress;
  }
  
  // Connect a wallet for minting
  public connectWallet(walletAddress: string): void {
    this.connectedWallet = walletAddress;
    console.log(`Wallet connected: ${walletAddress}`);
    // Save to localStorage
    localStorage.setItem('connected_wallet', walletAddress);
  }
  
  // Get connected wallet address
  public getConnectedWallet(): string | null {
    // If wallet is not connected, try to retrieve from localStorage
    if (!this.connectedWallet) {
      const savedWallet = localStorage.getItem('connected_wallet');
      if (savedWallet) {
        this.connectedWallet = savedWallet;
      }
    }
    return this.connectedWallet;
  }
  
  // Save summary to "server" (localStorage)
  public async saveSummary(summary: MedicalSummary): Promise<MedicalSummary> {
    return new Promise((resolve) => {
      // Simulate network delay
      setTimeout(() => {
        // If wallet is connected, associate the summary with the wallet
        if (this.connectedWallet) {
          summary.ownerWallet = this.connectedWallet;
        }
        
        this.storage.set(summary.id, summary);
        this.persistToLocalStorage();
        resolve(summary);
      }, 800);
    });
  }
  
  // Get all summaries
  public async getAllSummaries(): Promise<MedicalSummary[]> {
    return new Promise((resolve) => {
      // Simulate network delay
      setTimeout(() => {
        resolve(Array.from(this.storage.values()));
      }, 800);
    });
  }
  
  // Get summary by ID
  public async getSummaryById(id: string): Promise<MedicalSummary | null> {
    return new Promise((resolve) => {
      // Simulate network delay
      setTimeout(() => {
        const summary = this.storage.get(id) || null;
        resolve(summary);
      }, 500);
    });
  }
  
  // Mint summary as NFT
  public async mintSummaryAsNFT(id: string): Promise<MedicalSummary> {
    return new Promise((resolve, reject) => {
      // Simulate network delay
      setTimeout(() => {
        if (!this.connectedWallet) {
          reject(new Error('No wallet connected, please connect your wallet first'));
          return;
        }
        
        const summary = this.storage.get(id);
        if (!summary) {
          reject(new Error('Summary not found'));
          return;
        }
        
        // Update the summary status to minted and add wallet info
        const updatedSummary = { 
          ...summary, 
          status: 'minted' as const,
          ownerWallet: this.connectedWallet
        };
        this.storage.set(id, updatedSummary);
        this.persistToLocalStorage();
        resolve(updatedSummary);
      }, 1500); // Longer delay to simulate blockchain transaction
    });
  }
  
  // Persist to localStorage
  private persistToLocalStorage(): void {
    const data = Array.from(this.storage.values());
    localStorage.setItem('healthscribe_nfts', JSON.stringify(data));
  }
}

export default MockLocalServer.getInstance();
