class BaseService {
    static instance: BaseService;
    baseUrl = 'http://localhost:8000'; // Hardcoded base URL
    headers = {};
  
    constructor() {
      if (BaseService.instance) {
        return BaseService.instance; // Return the existing instance
      }
      BaseService.instance = this;
    }
  
    async get(endpoint: string, params: any) {
      try {
        const queryString = new URLSearchParams(params || {}).toString();
        const response = await fetch(`${this.baseUrl}${endpoint}?${queryString}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...this.headers,
          }
        });
        if (!response.ok) {
          throw new Error(`GET request failed with status: ${response.status}`);
        }
        return await response.json();
      } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
      }
    }
  
    async post(endpoint: string, data: any) {
      try {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...this.headers,
          },
          body: JSON.stringify(data),
        });
        if (!response.ok) {
          throw new Error(`POST request failed with status: ${response.status}`);
        }
        return await response.json();
      } catch (error) {
        console.error('Error posting data:', error);
        throw error;
      }
    }
  
    // New streamPost method
    async streamPost(endpoint: string, data: any, onChunk: (chunk: string) => void) {
      try {
        const res = await fetch(`${this.baseUrl}${endpoint}`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            ...this.headers,
          },
          body: JSON.stringify(data),
        });
  
        if (res.body) {
          const reader = res.body.getReader();
          const decoder = new TextDecoder('utf-8');
  
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
  
            const chunk = decoder.decode(value, { stream: true });
            if (chunk.indexOf('data: ') > -1) {
              onChunk(chunk);
            }
          }
        }
      } catch (error) {
        console.error('Error in streamPost:', error);
        throw error;
      }
    }
  }
  
  // Export a single instance of BaseService
  const baseService = new BaseService();
  export default baseService;
  