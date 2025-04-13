
import { MedicalSummary } from '@/components/SummaryCard';

// Simulate a local server for storing and retrieving NFT data
class MockLocalServer {
  private static instance: MockLocalServer;
  private storage: Map<string, MedicalSummary>;
  
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
  
  // Save summary to "server" (localStorage)
  public async saveSummary(summary: MedicalSummary): Promise<MedicalSummary> {
    return new Promise((resolve) => {
      // Simulate network delay
      setTimeout(() => {
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
        const summary = this.storage.get(id);
        if (!summary) {
          reject(new Error('Summary not found'));
          return;
        }
        
        // Update the summary status to minted
        const updatedSummary = { ...summary, status: 'minted' as const };
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
