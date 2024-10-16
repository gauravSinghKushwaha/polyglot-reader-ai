import React, { useEffect, useMemo, useState } from "react";
import { usePolygotReader } from "../state";
import { useEventStream } from "./useEventStream";


const cachePagesSummary: any = {}

export const useSummary = ({ selectedBook, currentPage, pageContent }: any) => {
    const bookId = selectedBook?.id;
    const [pagesSummary, setPagesSummary] = useState(cachePagesSummary);
    
    const callApi = async (bookId: number, currentPage: number, pageContent: any) => {
        try {
            const text = pageContent?.map((item: any) => item.str).join(" ");
            const res = await fetch(`http://localhost:8000/summary`, {
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
                        if (!cachePagesSummary[bookId]) {
                            cachePagesSummary[bookId] = {};
                        }
                        const data = extractSummaryAndCulturalInfo(chunk.replace("data:", ""))
                        setSummary(bookId, currentPage, data);
                    }
                }
            }
        } catch (e) {
            // return "AI could not respond to your request"
        }
    }

    const extractSummaryAndCulturalInfo = (text: string) => {
        // Use regular expressions to extract the summary and cultural information sections
        const summaryMatch = text.match(/Summary:\s*(.*?)\s*,\s*Cultural information:/);
        const culturalInfoMatch = text.match(/\[CulturalInferences\((.*)\)\]/);

        // Extract summary
        const summary = summaryMatch ? summaryMatch[1].trim() : '';

        // Extract cultural information and split into individual CulturalInferences
        const culturalInfoArray = culturalInfoMatch ? culturalInfoMatch[1].split('CulturalInferences').map(info => {
            const culturalInferenceMatch = info.match(/cultural_inference='(.*?)'/);
            const relevanceMatch = info.match(/relevance_to_text=['"](.*?)['"]/);
            const additionalInfoMatch = info.match(/additional_info=['"](.*?)['"]/);

            return {
                cultural_inference: culturalInferenceMatch ? culturalInferenceMatch[1] : '',
                relevance_to_text: relevanceMatch ? relevanceMatch[1] : '',
                additional_info: additionalInfoMatch ? additionalInfoMatch[1] : ''
            };
        }).filter(info => info.cultural_inference) : [];

        // Return the object with summary and cultural information
        return {
            summary: summary,
            culturalInformation: culturalInfoArray
        };
    }

    useEffect(() => {
        const controller = new AbortController();
        const { signal } = controller;
        if (bookId && pageContent) {
            getPageSummary(bookId, currentPage, pageContent);
        }
        return () => controller?.abort();
    }, [bookId, currentPage, pageContent]);

    const setSummary = (bookId: number, currentPage: number, data: any) => {
        if (bookId) {
            if (!cachePagesSummary[bookId]) {
                cachePagesSummary[bookId] = {};
            }
            cachePagesSummary[bookId][currentPage] = {...(cachePagesSummary[bookId][currentPage] || {}), ...data};
            setPagesSummary({...cachePagesSummary});
            console.log(cachePagesSummary);
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

    const getSummary = (bookId: number, pageNumber: number) => {
        if(bookId) {
            if(!pagesSummary[bookId]) {
                pagesSummary[bookId] = {};
            }

            if(!pagesSummary[bookId][pageNumber]) {
                pagesSummary[bookId][pageNumber] = {};
            }
            return pagesSummary[bookId][pageNumber];
        }
        return {};
    }

    return { pagesSummary }
}