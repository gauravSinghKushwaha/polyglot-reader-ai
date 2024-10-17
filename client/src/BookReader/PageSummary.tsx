import React, { useEffect, useState } from "react";
import { useSummary } from "../hooks/useSummary";
import { usePolygotReader } from "../state";

export const PageSummary = () => {
    const [pageSummary, setPagesSummary] = useState<any>({});
    const { selectedBook, currentPage, pagesSummary } = usePolygotReader();

    useEffect(() => {
        if (selectedBook?.id) {
            setPagesSummary(pagesSummary?.[selectedBook?.id]?.[currentPage] || {});
        }
    }, [pagesSummary, currentPage])

    return (
        <div className="page-summary">
            {pageSummary?.isLoading ? <div className="loader">Loading...</div> : null}

            {(pageSummary?.summary?.length > 0) && <div className="summary-container">
                <h2>Summary</h2>
                <p className="summary">{pageSummary?.summary}</p>
            </div>}

            {(pageSummary?.cultural_inferences?.length > 0) && <div className="cultural-info-container">
                <h2>Cultural Information</h2>
                {pageSummary?.cultural_inferences?.map((info: any, index: number) => (
                    <div key={index} className="cultural-info">
                        <div className="cultural-inference">
                            <strong>Cultural Inference:</strong> {info.cultural_inference}
                        </div>
                        <div className="relevance">
                            <strong>Relevance to Text:</strong> {info.relevance_to_text}
                        </div>
                        <div className="additional-info">
                            <strong>Additional Info:</strong> {info.additional_info}
                        </div>
                    </div>
                ))}
            </div>}
        </div>
    )
}