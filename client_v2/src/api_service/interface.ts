export type IBook = {
    isbn: string; 
    name: string;
    author: string;
    thumbnail: string;
}

export type IVocabInfo = {
    word: string;
    word_hindi: string;
    meaning: string;
    synonym: string;
    usage: string;
    meaning_in_context: string;
    meaning_in_context_hindi: string;
}

export type IBookParaInfo = {
    id: string;
    content: string; 
}

export type ICultureRef = {
    part_of_text: string;
    part_of_text_hindi: string;
    significance: string; 
    improve_understanding_of_text: string;
}

export type IBookPage = {
    id: string; 
    chapter: string;
    summary_so_far: string;
    summary_so_far_hindi: string;
    vocab: IVocabInfo[];
    paragraphs: IBookParaInfo[];
    cultural_ref: ICultureRef[];
    content: string;
    grade5: string;
}

export type IBookInfo = {
    isbn: string; 
    pages: IBookPage[];
}