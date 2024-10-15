// state.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect, useMemo } from 'react';
import { books, SUPPORTED_LANGUAGES } from './constants'; // Adjust the path as necessary
import * as pdfjs from 'pdfjs-dist';
import { useEventStream } from './useEventStream';

pdfjs.GlobalWorkerOptions.workerSrc = `pdfjs-dist/build/pdf.worker.js`;
const cacheTranslations: any = {};

export interface IBook {
  id: number;
  title: string;
  link: string;
  thumbnail: string;
  totalPages: number;
  pdf: pdfjs.PDFDocumentProxy;
  author: string;
  creationDate: string;
  creator: string;
  language: string;
  producer: string;
  subject: string;
}

interface PolygotReaderContextType {
  books: IBook[];
  setBooks: React.Dispatch<React.SetStateAction<IBook[]>>;
  selectedLang: string;
  setSelectedLang: React.Dispatch<React.SetStateAction<string>>;
  getBookById: (id: number) => IBook | undefined;
  getTranslations: (string: string) => Promise<string>;
  getSummary: (string: string, signal?: AbortSignal) => Promise<string>;
  askQuestion: (string: string, query: string) => Promise<string>;
  showPagePreview: boolean;
  togglePagePreview: React.Dispatch<React.SetStateAction<boolean>>;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  pageContent: any;
  setPageContent: React.Dispatch<React.SetStateAction<any>>;
  translationsToDispatch: any;
  pageSummary: any;
  selectedBook: IBook | null;
  setSelectedBook: React.Dispatch<React.SetStateAction<IBook | null>>;
  toggleChat: Function;
  isChatbotOpen: boolean
}

const PolygotReaderContext = createContext<PolygotReaderContextType | undefined>(undefined);

export const PolygotReaderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [bookList, setBookList] = useState<IBook[]>([]);
  const [selectedLang, setSelectedLang] = useState<string>("Hindi");
  const [showPagePreview, togglePagePreview] = useState<boolean>(false);
  const [translationsToDispatch, setTranslationsToDispatch] = useState<any>({});
  const [selectedBook, setSelectedBook] = useState<IBook | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageContent, setPageContent] = useState<any>("");
  const [pagesSummary, setPagesSummary] = useState<any>({});
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const {response: summaryResponse, callApi: callSummaryApi} = useEventStream();

  const toggleChat = () => {
    setIsChatbotOpen(!isChatbotOpen);
  };

  const pageSummary = useMemo(() => {
    if (selectedBook) {
      if (!pagesSummary[selectedBook.id]) {
        pagesSummary[selectedBook.id] = {};
      }
      if (!pagesSummary[selectedBook.id][currentPage]) {
        pagesSummary[selectedBook.id][currentPage] = { isLoading: true };
      }
      return pagesSummary[selectedBook.id][currentPage];
    }
  }, [pageContent, pagesSummary])

  const setSummary = (data: any) => {
    if (selectedBook) {
      if (!pagesSummary[selectedBook.id]) {
        pagesSummary[selectedBook.id] = {};
      }
      pagesSummary[selectedBook.id][currentPage] = data;
      setPagesSummary({ ...pagesSummary });
    }
  }

  useEffect(() => {
    setSummary(summaryResponse);
  }, [summaryResponse])

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    if (pageContent) {
      getPageSummary(signal);
    }
    return () => controller.abort();
  }, [pageContent]);

  const getPageSummary = (signal: AbortSignal) => {
    if (!pageSummary?.summary) {
      setSummary({ isLoading: true });
      const text = pageContent?.map((item: any) => item.str).join(" ");
      if (text.length) {
        const payload = {
          text: text, query: `
          Provide summary of text,
          Provide translation of given text in ${selectedLang} language,
          if this text has any cultural inference provide me list of that
          Provide info important word like meaning, synonyms, antonyms, figure of speech if available and translation in ${selectedLang} language, 
          Provide response in html format to show in a popup use tag h1, p, ul, li only and links in a[target = _blank] tag.
          `
      }
        callSummaryApi("comprehend/ask_question_stream", payload);
      } else {
        setSummary({ isLoading: false });
      }
    }
  }

  const askQuestion = async (string: string, query: string) => {
    try {
      const res = await fetch("http://localhost:8000/comprehend/ask_question", {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: string,
          query
        })
      });

      if (res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder('utf-8');

        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            break; // No more data
          }
          const chunk = decoder.decode(value, { stream: true });
          console.log(chunk.replace("data: Answer: ", "")); // Process your chunk here
        }
      }

      return "";

      // const data = await res.json();

      // return data?.response[1]?.answer || data["detail"];
    } catch (e) {
      return "AI could not respond to your request"
    }
  }

  const getSummary = async (string: string, signal?: AbortSignal) => {
    try {
      const res = await fetch("http://localhost:8000/comprehend/build_summary", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: string }),
        signal // Pass the signal to the fetch request
      });

      const data = await res.json();

      return data?.response || data["detail"];
    } catch (e: any) {
      if (e.name === 'AbortError') {
        console.log("Fetch aborted");
        throw e;  // Handle abort error separately
      }
      return "AI could not respond to your request";
    }
  };

  const translateString = async (string: string) => {
    if (selectedLang === SUPPORTED_LANGUAGES[0]) {
      return string;
    }

    if (!string?.trim()?.length) {
      return string;
    }

    if (!cacheTranslations[selectedLang]) {
      cacheTranslations[selectedLang] = {};
    }

    if (cacheTranslations[selectedLang][string]) {
      return cacheTranslations[selectedLang][string];
    }

    try {
      const res = await fetch("http://localhost:8000/translate", {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: [string],
          target_language: selectedLang
        })
      });

      const data = await res.json();

      cacheTranslations[selectedLang][string] = data?.response?.[0] || data["detail"];
      if (!translationsToDispatch[selectedLang]) {
        translationsToDispatch[selectedLang] = {};
      }
      translationsToDispatch[selectedLang][string] = cacheTranslations[selectedLang][string];
      setTranslationsToDispatch({ ...translationsToDispatch })
    } catch (e) {
      return "AI could not respond to your request"
    }
    return cacheTranslations[selectedLang][string] || "";
  }

  const getTranslations = async (textContent: string) => {
    const strings = textContent.split(".");
    const translations = await Promise.all(strings.map((item) => translateString(item)));
    let translationString = translations.join(".");
    translationString = translationString.replaceAll("↵", "<br/>");
    translationString = translationString.replaceAll("\n", "<br/>");
    return translationString;
  }

  const getBookById = (id: number): IBook | undefined => {
    return bookList.find(book => book.id === id);
  };

  const fetchBookDetails = async (book: any) => { // Updated function name
    try {
      const loadingTask = pdfjs.getDocument(book.link);
      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 0.5 });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d') as CanvasRenderingContext2D;
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      const { info }: any = await pdf.getMetadata()

      await page.render({ canvasContext: context, viewport }).promise;

      return {
        ...book,
        thumbnail: canvas.toDataURL(),
        totalPages: pdf.numPages,
        pdf,
        author: info.Author,
        creationDate: info.CreationDate,
        creator: info.Creator,
        language: info.Language,
        producer: info.Producer,
        subject: info.Subject
      };
    } catch (error) {
      console.error(`Error fetching details for ${book.title}:`, error);
    }
    return {};
  };


  useEffect(() => {
    Promise.all(books.map((book) => fetchBookDetails(book))).then((updatedBooks) => {
      setBookList(updatedBooks);
    })
  }, []);

  return (
    <PolygotReaderContext.Provider value={{ books: bookList, setBooks: setBookList, getBookById, setSelectedLang, selectedLang, getTranslations, getSummary, askQuestion, showPagePreview, togglePagePreview, translationsToDispatch, currentPage, setCurrentPage, pageContent, setPageContent, pageSummary, selectedBook, setSelectedBook, toggleChat, isChatbotOpen }}>
      {children}
    </PolygotReaderContext.Provider>
  );
};

export const usePolygotReader = (): PolygotReaderContextType => {
  const context = useContext(PolygotReaderContext);
  if (!context) {
    throw new Error('usePolygotReader must be used within a PolygotReaderProvider');
  }
  return context;
};
