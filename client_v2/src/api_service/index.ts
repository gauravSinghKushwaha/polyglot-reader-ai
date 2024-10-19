import { BOOK_LIST } from "./constants";
import { IBook } from "./interface";

class ApiService {
    static instance: ApiService;
  
    constructor() {
      if (ApiService.instance) {
        return ApiService.instance; // Return the existing instance
      }
      ApiService.instance = this;
    }

    async getBookList(): Promise<IBook[]> {
        return BOOK_LIST;
    }
  }
  
  // Export a single instance of ApiService
  const apiService = new ApiService();
  export default apiService;
  