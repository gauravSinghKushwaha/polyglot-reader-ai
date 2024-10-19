import baseService from "./base_service";
import { BOOK_INFO_DUMMY, BOOK_LIST } from "./constants";
import { IBook, IBookInfo, IBookParaInfo } from "./interface";

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

  async getBookInfo(bookId: string): Promise<IBookInfo> {
    const { response } = await baseService.get("/book", { book_id: bookId });
    const parsedRes = {
      isbn: bookId,
      pages: Object.keys(response).slice(0, 145).map((id, index) => {
        const bookInfo = response[id];
        const paragraphs: IBookParaInfo[] = Object.keys(bookInfo.paragraphs).map((paraId) => ({ id: paraId, ...bookInfo.paragraphs[paraId] }));
        return {
          id,
          chapter: bookInfo.chapter,
          paragraphs,
          summary_so_far: `${bookInfo?.summary?.page_summary_so_far} ${bookInfo?.summary?.current_page_summary}`,
          vocab: bookInfo?.vocab?.novel_words,
          cultural_ref: bookInfo?.cultural_ref,
          content: bookInfo?.content
        }
      })
    }
    return parsedRes;
  }

  async getTranslations(text: string, target_language: string, callback: (chunk: string) => void): Promise<any> {
    return await baseService.streamPost("/translate", { text, target_language }, callback);
  }

  async askQuery(text: string, query: string, callback: (chunk: string) => void): Promise<any> {
    return await baseService.streamPost("/ask", { text, query }, callback);
  }
}

// Export a single instance of ApiService
const apiService = new ApiService();
export default apiService;
