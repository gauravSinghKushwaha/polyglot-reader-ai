import React, { useEffect, useState } from "react";
import { useVocab } from "../hooks/useVocab";
import { usePolygotReader } from "../state";

export const PageVocab = () => {
    const [pageVocab, setPagesVocab] = useState<any>({});
    const { selectedBook, currentPage, pagesVocab } = usePolygotReader();

    useEffect(() => {
        if(selectedBook?.id) {
            setPagesVocab(pagesVocab?.[selectedBook?.id]?.[currentPage] || {});
        }
    }, [pagesVocab, currentPage])
    

    return (
        <div className="page-socab">
            {Object.keys(pageVocab).map((key) => {
        if (pageVocab[key]?.word) {
          return (
            <div key={key} className="word-container">
              <div className="word">Word: {pageVocab[key].word}</div>
              <div className="meaning">Meaning: {pageVocab[key].meaning}</div>
              <div className="synonym">Synonym: {pageVocab[key].synonym}</div>
              <div className="example">Example: {pageVocab[key].example}</div>
            </div>
          );
        }
        return null;
      })}
        </div>
    )
}