import React, { useEffect, useState } from "react";
import { useVocab } from "../hooks/useVocab";
import { usePolygotReader } from "../state";

export const PageVocab = () => {
  const [pageVocab, setPagesVocab] = useState<any>({});
  const { selectedBook, currentPage, pagesVocab } = usePolygotReader();

  useEffect(() => {
    if (selectedBook?.id) {
      setPagesVocab(pagesVocab?.[selectedBook?.id]?.[currentPage] || {});
    }
  }, [pagesVocab, currentPage])

  return (
    <div className="page-socab">
      {pageVocab?.isLoading ? <div className="loader">Loading...</div> : null}
      {(pageVocab?.top_words || []).map((data: any) => {
        if (data.word) {
          return (
            <div key={data.word} className="word-container">
              <div>
                <span className="word">{data.word} -</span>
                <span className="meaning"><i>{data.meaning}</i></span>
              </div>
              <br />
              <div className="synonym"><b>Synonym:</b> {data.synonym}</div>
              <div className="example"><b>Example:</b> {data.example}</div>
            </div>
          );
        }
        return "helo";
      })}
    </div>
  )
}