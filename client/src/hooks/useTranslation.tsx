import React, { useEffect, useMemo, useState } from "react";
import { usePolygotReader } from "../state";
import { useEventStream } from "./useEventStream";


const cachePagesTranslation: any = {}

export const useTranslation = ({ selectedBook, currentPage, pageContent, selectedLang }: any) => {
    const bookId = selectedBook?.id;
    const [pagesTranslation, setPagesTranslation] = useState(cachePagesTranslation);
    
    const callApi = async (bookId: number, currentPage: number, pageContent: any, selectedLang: string) => {
        try {
            const text = pageContent?.map((item: any) => item?.hasEOL ? `${item.str}\n` : item.str).join(" ");
            const res = await fetch(`http://localhost:8000/translate`, {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({text, target_language: selectedLang})
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
                    if (chunk.indexOf("data: ") > -1) {
                        if (!cachePagesTranslation[bookId]) {
                            cachePagesTranslation[bookId] = {};
                        }
                        const data = extractTranslations(chunk.replace("data:", ""))
                        setTranslation(bookId, currentPage, data, selectedLang);
                    }
                }
            }
        } catch (e) {
            // return "AI could not respond to your request"
        }
    }

    const extractTranslations = (translatedText: any) => {
        // Use a regular expression to match the array format
        const regex = /\['(.*?)'\]/g; 
        const matches = [...translatedText.matchAll(regex)];
        
        // Extract the translations from the matches
        const translations = matches.map(match => match[1]);
        
        return translations;
    };

    useEffect(() => {
        const controller = new AbortController();
        const { signal } = controller;
        if (bookId && pageContent) {
            getPageTranslation(bookId, currentPage, pageContent, selectedLang);
        }
        return () => controller?.abort();
    }, [bookId, currentPage, pageContent, selectedLang]);

    const setTranslation = (bookId: number, currentPage: number, data: any, selectedLang: string) => {
        if (bookId) {
            if (!cachePagesTranslation[bookId]) {
                cachePagesTranslation[bookId] = {};
            }
            if (!cachePagesTranslation[bookId][currentPage]) {
                cachePagesTranslation[bookId][currentPage] = {};
            }
            cachePagesTranslation[bookId][currentPage][selectedLang] = data?.join(" ");
            setPagesTranslation({...cachePagesTranslation});
            console.log(cachePagesTranslation);
        }
    }

    const getPageTranslation = async (bookId: number, currentPage: number, pageContent: any, selectedLang: string) => {
        const pageTranslation = getTranslation(bookId, currentPage, selectedLang);
        if (!(pageTranslation?.translation || pageTranslation?.isLoading)) {
            // setTranslation(bookId, currentPage, [], selectedLang);
            
            await callApi(bookId, currentPage, pageContent, selectedLang);
        }
    }

    const getTranslation = (bookId: number, pageNumber: number, selectedLang: string) => {
        if(bookId) {
            if(!pagesTranslation[bookId]) {
                pagesTranslation[bookId] = {};
            }

            if(!pagesTranslation[bookId][pageNumber]) {
                pagesTranslation[bookId][pageNumber] = {};
            }

            if(!pagesTranslation[bookId][pageNumber][selectedLang]) {
                pagesTranslation[bookId][pageNumber][selectedLang] = {};
            }
            return pagesTranslation[bookId][pageNumber][selectedLang];
        }
        return "";
    }

    return { pagesTranslation }
}