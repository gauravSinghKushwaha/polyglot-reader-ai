import React, { useEffect, useMemo, useState } from "react";
import { usePolygotReader } from "../state";
import { useEventStream } from "./useEventStream";


const cachePagesVocab: any = JSON.parse(sessionStorage.getItem("cachePagesVocab") || "{}");

export const useVocab = ({ selectedBook, currentPage, pageContent }: any) => {
    const bookId = selectedBook?.id;
    const [pagesVocab, setPagesVocab] = useState(cachePagesVocab);

    const extractTopWords = (data: string) => {
        let topWords: any = {}; // Object to store the latest version of each word
        const lines = data.split('\r\n\r\n'); // Split the data into chunks based on double newlines

        lines.forEach(line => {
            if (line.startsWith('data: ')) {
                try {
                    // Remove 'data: ' prefix and parse the JSON
                    const jsonData = JSON.parse(line.replace('data: ', ''));

                    // Extract the top words array from the JSON data
                    topWords = jsonData.top_words;
                } catch (e) {
                    console.error("Failed to parse line:", line, e);
                }
            }
        });

        // Convert the topWords object back into an array of words
        return {top_words: topWords};
    }

    const setVocab = (bookId: number, currentPage: number, data: any) => {
        if (bookId) {
            if (!cachePagesVocab[bookId]) {
                cachePagesVocab[bookId] = {};
            }
            cachePagesVocab[bookId][currentPage] = { ...(cachePagesVocab[bookId][currentPage] || {}), ...data };
            setPagesVocab({ ...cachePagesVocab });
            // sessionStorage.setItem("cachePagesVocab", JSON.stringify(cachePagesVocab));
        }
    }

    const getVocab = (bookId: number, pageNumber: number) => {
        if (bookId) {
            if (!pagesVocab[bookId]) {
                pagesVocab[bookId] = {};
            }

            if (!pagesVocab[bookId][pageNumber]) {
                pagesVocab[bookId][pageNumber] = {};
            }
            return pagesVocab[bookId][pageNumber];
        }
        return {};
    }

    const callApi = async (bookId: number, currentPage: number, pageContent: any) => {
        try {
            const text = pageContent?.map((item: any) => item.str).join(" ");
            if(!text?.length) {
                setVocab(bookId, currentPage, {error: "Text Content not found!"});
                return;
            }
            const res = await fetch(`http://localhost:8000/vocab`, {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text })
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
                        const data = extractTopWords(chunk);
                        setVocab(bookId, currentPage, data);
                    }
                }
            }
        } catch (e) {
            // return "AI could not respond to your request"
        }
    }

     const getPageVocab = async (bookId: number, currentPage: number, pageContent: any) => {
        const pageVocab = getVocab(bookId, currentPage);
        if (!(pageVocab?.top_words || pageVocab?.isLoading)) {
            setVocab(bookId, currentPage, { isLoading: true });

            await callApi(bookId, currentPage, pageContent);
            setVocab(bookId, currentPage, { isLoading: false });
        }
    }

    useEffect(() => {
        if (bookId && pageContent) {
            getPageVocab(bookId, currentPage, pageContent);
        }
    }, [bookId, currentPage, pageContent]);


    return { pagesVocab }
}