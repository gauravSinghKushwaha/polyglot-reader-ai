import React, { useEffect, useMemo, useState } from "react";
import { usePolygotReader } from "../state";
import { useEventStream } from "./useEventStream";


const cachePagesVocab: any = {}

export const useVocab = ({ selectedBook, currentPage, pageContent }: any) => {
    const bookId = selectedBook?.id;
    const [pagesVocab, setPagesVocab] = useState(cachePagesVocab);
    
    const callApi = async (bookId: number, currentPage: number, pageContent: any) => {
        try {
            const text = pageContent?.map((item: any) => item.str).join(" ");
            const res = await fetch(`http://localhost:8000/vocab`, {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({text})
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
                        if (!cachePagesVocab[bookId]) {
                            cachePagesVocab[bookId] = {};
                        }
                        const data = extractTopWords(chunk.replace("data:", ""))
                        setVocab(bookId, currentPage, data);
                    }
                }
            }
        } catch (e) {
            // return "AI could not respond to your request"
        }
    }

    function extractTopWords(text: string) {
        const wordsInfoList = [];
    
        // Regex to match individual word information blocks
        const wordRegex = /Words\(word='(.*?)',\s*meaning='(.*?)',\s*synonym='(.*?)',\s*example='(.*?)'\)/g;
    
        let match;
        while ((match = wordRegex.exec(text)) !== null) {
            const wordInfo = {
                word: match[1],
                meaning: match[2],
                synonym: match[3],
                example: match[4]
            };
            wordsInfoList.push(wordInfo);
        }
    
        return wordsInfoList;
    }
    useEffect(() => {
        const controller = new AbortController();
        const { signal } = controller;
        if (bookId && pageContent) {
            getPageVocab(bookId, currentPage, pageContent);
        }
        return () => controller?.abort();
    }, [bookId, currentPage, pageContent]);

    const setVocab = (bookId: number, currentPage: number, data: any) => {
        if (bookId) {
            if (!cachePagesVocab[bookId]) {
                cachePagesVocab[bookId] = {};
            }
            cachePagesVocab[bookId][currentPage] = {...(cachePagesVocab[bookId][currentPage] || {}), ...data};
            setPagesVocab({...cachePagesVocab});
            console.log(cachePagesVocab);
        }
    }

    const getPageVocab = async (bookId: number, currentPage: number, pageContent: any) => {
        const pageVocab = getVocab(bookId, currentPage);
        if (!(pageVocab?.vocab || pageVocab?.isLoading)) {
            setVocab(bookId, currentPage, { isLoading: true });
            
            await callApi(bookId, currentPage, pageContent);
            setVocab(bookId, currentPage, { isLoading: false });
        }
    }

    const getVocab = (bookId: number, pageNumber: number) => {
        if(bookId) {
            if(!pagesVocab[bookId]) {
                pagesVocab[bookId] = {};
            }

            if(!pagesVocab[bookId][pageNumber]) {
                pagesVocab[bookId][pageNumber] = {};
            }
            return pagesVocab[bookId][pageNumber];
        }
        return {};
    }

    return { pagesVocab }
}