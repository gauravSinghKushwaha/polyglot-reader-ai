import React, { useEffect, useMemo, useState } from "react";
import { usePolygotReader } from "../state";
import { useEventStream } from "./useEventStream";


const cachePagesSummary: any = JSON.parse(sessionStorage.getItem("cachePagesSummary") || "{}");

export const useSummary = ({ selectedBook, currentPage, pageContent }: any) => {
    const bookId = selectedBook?.id;
    const [pagesSummary, setPagesSummary] = useState(cachePagesSummary);

    const extractSummaryAndCulturalInfo = (data: string) => {
        let summary: any = {}; // Object to store the latest version of each word
        const lines = data.split('\r\n\r\n'); // Split the data into chunks based on double newlines

        lines.forEach(line => {
            if (line.startsWith('data: ')) {
                try {
                    summary = JSON.parse(line.replace('data: ', ''))
                } catch (e) {
                    console.error("Failed to parse line:", line, e);
                }
            }
        });

        // Convert the topWords object back into an array of words
        return summary;
    }

    const setSummary = (bookId: number, currentPage: number, data: any) => {
        if (bookId) {
            if (!cachePagesSummary[bookId]) {
                cachePagesSummary[bookId] = {};
            }
            cachePagesSummary[bookId][currentPage] = { ...(cachePagesSummary[bookId][currentPage] || {}), ...data };
            setPagesSummary({ ...cachePagesSummary });
            // sessionStorage.setItem("cachePagesSummary", JSON.stringify(cachePagesSummary));
        }
    }

    const getSummary = (bookId: number, pageNumber: number) => {
        if (bookId) {
            if (!pagesSummary[bookId]) {
                pagesSummary[bookId] = {};
            }

            if (!pagesSummary[bookId][pageNumber]) {
                pagesSummary[bookId][pageNumber] = {};
            }
            return pagesSummary[bookId][pageNumber];
        }
        return {};
    }

    const callApi = async (bookId: number, currentPage: number, pageContent: any) => {
        try {
            const text = pageContent?.map((item: any) => item.str).join(" ");
            if (!text?.length) {
                setSummary(bookId, currentPage, { error: "Text Content not found!" });
                return;
            }
            const res = await fetch(`http://localhost:8000/summary`, {
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
                        if (!cachePagesSummary[bookId]) {
                            cachePagesSummary[bookId] = {};
                        }
                        const data = extractSummaryAndCulturalInfo(chunk)
                        console.log(chunk, data);
                        setSummary(bookId, currentPage, data);
                    }
                }
            }
        } catch (e) {
            // return "AI could not respond to your request"
        }
    }

    const getPageSummary = async (bookId: number, currentPage: number, pageContent: any) => {
        const pageSummary = getSummary(bookId, currentPage);
        if (!(pageSummary?.summary || pageSummary?.isLoading)) {
            setSummary(bookId, currentPage, { isLoading: true });

            await callApi(bookId, currentPage, pageContent);
            setSummary(bookId, currentPage, { isLoading: false });
        }
    }

    useEffect(() => {
        if (bookId && pageContent) {
            getPageSummary(bookId, currentPage, pageContent);
        }
    }, [bookId, currentPage, pageContent]);

    return { pagesSummary }
}