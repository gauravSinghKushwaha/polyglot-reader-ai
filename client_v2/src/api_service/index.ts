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
      pages: Object.keys(response).map((id) => {
        const bookInfo = response[id];
        const paragraphs: IBookParaInfo[] = Object.keys(bookInfo.paragraphs).map((paraId) => ({ id: paraId, content: bookInfo.paragraphs[paraId].content }));
        return {
          id,
          chapter: bookInfo.chapter,
          paragraphs,
          summary_so_far: "",
          vocab: [
            {
              word: "",
              meaning: "",
              example_usage: ""
            }
          ]
        }
      })
    }
    return parsedRes;
  }
}

// Export a single instance of ApiService
const apiService = new ApiService();
export default apiService;
