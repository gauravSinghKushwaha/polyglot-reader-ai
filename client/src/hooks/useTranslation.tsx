import React, { useEffect, useMemo, useState } from "react";
import { usePolygotReader } from "../state";
import { useEventStream } from "./useEventStream";


const cachePagesTranslation: any = JSON.parse(sessionStorage.getItem("cachePagesTranslation") || "{}");

export const useTranslation = ({ selectedBook, currentPage, pageContent, selectedLang }: any) => {
    const bookId = selectedBook?.id;
    const [pagesTranslation, setPagesTranslation] = useState(cachePagesTranslation);


    const extractTranslations = (data: any) => {
        let translation: any = ""; // Object to store the latest version of each word
        const lines = data.split('\r\n\r\n'); // Split the data into chunks based on double newlines

        lines.forEach((line: any) => {
            if (line.startsWith('data: ')) {
                try {
                    translation = line.replaceAll('data: ', '');
                    translation = translation.replaceAll("↵", "<br/>");
                    translation = translation.replaceAll("\n", "<br/>");
                } catch (e) {
                    console.error("Failed to parse line:", line, e);
                }
            }
        });

        return {translation};
    };

    const setTranslation = (bookId: number, currentPage: number, data: any, selectedLang: string) => {
        if (bookId) {
            if (!cachePagesTranslation[bookId]) {
                cachePagesTranslation[bookId] = {};
            }
            if (!cachePagesTranslation[bookId][currentPage]) {
                cachePagesTranslation[bookId][currentPage] = {};
            }
            cachePagesTranslation[bookId][currentPage][selectedLang] = {...(cachePagesTranslation[bookId][currentPage][selectedLang] || {}), ...data};
            setPagesTranslation({ ...cachePagesTranslation });
            // sessionStorage.setItem("cachePagesTranslation", JSON.stringify(cachePagesTranslation));
        }
    }

    const getTranslation = (bookId: number, pageNumber: number, selectedLang: string) => {
        if (bookId) {
            if (!pagesTranslation[bookId]) {
                pagesTranslation[bookId] = {};
            }

            if (!pagesTranslation[bookId][pageNumber]) {
                pagesTranslation[bookId][pageNumber] = {};
            }

            if (!pagesTranslation[bookId][pageNumber][selectedLang]) {
                pagesTranslation[bookId][pageNumber][selectedLang] = {};
            }
            return pagesTranslation[bookId][pageNumber][selectedLang];
        }
        return "";
    }

    const callApi = async (bookId: number, currentPage: number, pageContent: any, selectedLang: string) => {
        try {
            const text = pageContent?.map((item: any) => item?.hasEOL ? `${item.str} ↵ ` : item.str).join(" ");
            if(!text?.length) {
                setTranslation(bookId, currentPage, {error: "Text Content not found!"}, selectedLang);
                return;
            }
            const res = await fetch(`http://localhost:8000/translate`, {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text, target_language: selectedLang })
            });

            if (res.body) {
                const reader = res.body.getReader();
                const decoder = new TextDecoder('utf-8');

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) {
                        break;
                    }
                    const chunk = decoder.decode(value, { stream: true });
                    console.log(chunk);
                    if (chunk.indexOf("data: ") > -1) {
                        const data = extractTranslations(chunk)
                        setTranslation(bookId, currentPage, data, selectedLang);
                    }
                }
            }
        } catch (e) {
            // return "AI could not respond to your request"
        }
    }


    const getPageTranslation = async (bookId: number, currentPage: number, pageContent: any, selectedLang: string) => {
        const pageTranslation = getTranslation(bookId, currentPage, selectedLang);
        if (!(pageTranslation?.translation || pageTranslation?.isLoading)) {
            setTranslation(bookId, currentPage, {isLoading: true}, selectedLang);

            await callApi(bookId, currentPage, pageContent, selectedLang);
            setTranslation(bookId, currentPage, {isLoading: false}, selectedLang);
        }
    }

    useEffect(() => {
        if (bookId && pageContent) {
            getPageTranslation(bookId, currentPage, pageContent, selectedLang);
        }
    }, [bookId, currentPage, pageContent, selectedLang]);

    return { pagesTranslation }
}