import React, { useEffect, useState } from "react";
import { SUPPORTED_LANGUAGES } from "../constants";
import { usePolygotReader } from "../state";

export const Translate = () => {
    const { selectedLang, setSelectedLang, currentPage, selectedBook, pagesTranslation } = usePolygotReader();
    const [translatedValue, setTranslation] = useState("");

    useEffect(() => {
        if(selectedBook?.id) {
            setTranslation(pagesTranslation?.[selectedBook?.id]?.[currentPage]?.[selectedLang]);
        }
    }, [pagesTranslation, currentPage, selectedLang])

    return (
        <div className="page-translate">
            <div className="languages">{SUPPORTED_LANGUAGES.sort().map((item) => <div onClick={() => setSelectedLang(item)} className={selectedLang === item ? "active" : ""}>{item}</div>)}</div>
            <div>{JSON.stringify(translatedValue)}</div>
        </div>
    )
}