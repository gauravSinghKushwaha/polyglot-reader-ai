import React, { createContext, useContext, useState, ReactNode, useEffect, useMemo } from 'react';
import { IBook, IBookInfo } from './api_service/interface';
import apiService from './api_service';

interface PolyglotReaderContextType {
    bookList: IBook[];
    currentBook: IBook | undefined;
    setCurrentBook: React.Dispatch<React.SetStateAction<IBook | undefined>>;
    defaultLanguage: string; 
    setDefaultLanguage: React.Dispatch<React.SetStateAction<string>>;
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    bookInfo: IBookInfo | undefined;
    setBookInfo: React.Dispatch<React.SetStateAction<IBookInfo | undefined>>;
    selectionText: string | undefined; 
    setSelectionText: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const PolyglotReaderContext = createContext<PolyglotReaderContextType | undefined>(undefined);

export const PolyglotReaderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [bookList, setBookList] = useState<IBook[]>([]);
    const [defaultLanguage, setDefaultLanguage] = useState<string>("Hindi");
    const [currentBook, setCurrentBook] = useState<IBook | undefined>();
    const [currentPage, setCurrentPage] = useState(0);
    const [bookInfo, setBookInfo] = useState<IBookInfo>();
    const [selectionText, setSelectionText] = useState<string>();

    useEffect(() => {
        apiService.getBookList().then((response) => setBookList(response));
    }, []);

    return (
        <PolyglotReaderContext.Provider
            value={{
                bookList,
                currentBook,
                defaultLanguage,
                currentPage,
                bookInfo,
                selectionText,
                setCurrentBook,
                setDefaultLanguage,
                setCurrentPage,
                setBookInfo,
                setSelectionText
            }}
        >
            {children}
        </PolyglotReaderContext.Provider>
    );
};

export const usePolyglotReader = (): PolyglotReaderContextType => {
    const context = useContext(PolyglotReaderContext);
    if (!context) {
        throw new Error('usePolyglotReader must be used within a PolyglotReaderProvider');
    }
    return context;
};
