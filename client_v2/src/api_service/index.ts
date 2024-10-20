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
          summary_so_far_hindi: `${bookInfo?.summary?.page_summary_so_far_hindi} ${bookInfo?.summary?.current_page_summary_hindi}`,
          vocab: bookInfo?.vocab?.novel_words,
          cultural_ref: bookInfo?.cultural_ref,
          content: bookInfo?.content,
          grade5: bookInfo?.grade5,
          grade5_hindi: bookInfo?.grade5_hindi
        }
      })
    }
    return parsedRes;
  }

  async getTranslations(text: string, target_language: string, callback: (chunk: string) => void): Promise<any> {
    return await baseService.streamPost("/translate", { text, target_language }, callback);
  }

  async askQuery(book_id: string, page_no: number, text: string, query: string, callback: (chunk: string) => void): Promise<any> {
    return await baseService.streamPost("/ask", { book_id, page_no: page_no.toString(), text, query }, callback);
  }

  async getSelectionInfo(text: string, content: string, target_language: string, callback: (chunk: string) => void): Promise<any> {
    return await baseService.streamPost("/selected_text", { text, content, target_language }, callback);
  }
}

// Export a single instance of ApiService
const apiService = new ApiService();
export default apiService;
