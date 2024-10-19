export type IBook = {
    isbn: string; 
    name: string;
    author: string;
    thumbnail: string;
}

export type IVocabInfo = {
    word: string;
    meaning: string;
    example_usage: string;
}

export type IBookParaInfo = {
    id: string;
    content: string; 
}

export type IBookPage = {
    id: string; 
    chapter: string;
    summary_so_far: string;
    vocab: IVocabInfo[];
    paragraphs: IBookParaInfo[];
}
export type IBookInfo = {
    isbn: string; 
    pages: IBookPage[];
}