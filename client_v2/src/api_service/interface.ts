export type IBook = {
    isbn: string; 
    name: string;
    author: string;
    thumbnail: string;
}

export type IVocabInfo = {
    word: string;
    meaning: string;
    synonym: string;
    usage: string;
    meaning_in_context: string;
}

export type IBookParaInfo = {
    id: string;
    content: string; 
}

export type ICultureRef = {
    part_of_text: string;
    significance: string; 
    improve_understanding_of_text: string;
}

export type IBookPage = {
    id: string; 
    chapter: string;
    summary_so_far: string;
    vocab: IVocabInfo[];
    paragraphs: IBookParaInfo[];
    cultural_ref: ICultureRef[];
    content: string;
}
export type IBookInfo = {
    isbn: string; 
    pages: IBookPage[];
}