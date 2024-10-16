import React from "react";
import { PDFViewer } from "../PdfViewer";
import './styles.scss';
import { usePolygotReader } from "../state";
import { RightSection } from "./RightSection";

export const BookReader = () => {
    const { selectedBook, currentPage, showPagePreview, togglePagePreview, setSelectedBook, isChatbotOpen } = usePolygotReader();

    return (
        <div className="book-reader">
            <div className="book-pages" style={{ width: showPagePreview ? "65%" : "100%" }}>
                <div className="progress-bar"><div className="progress" style={{ width: `${(currentPage / (selectedBook?.totalPages || 1)) * 100}%` }}></div></div>
                <div className="pdf-viewer-header">
                    <div className="home-button" onClick={() => setSelectedBook(null)}><i className="bi bi-arrow-left"></i><i className="bi bi-house-fill"></i></div>
                    <h1>{selectedBook?.title}</h1>
                    {showPagePreview ? <button onClick={() => togglePagePreview(false)}><i className="bi bi-box-arrow-in-right"></i></button> : <button onClick={() => togglePagePreview(true)}><i className="bi bi-book-fill"></i> Try Polygot Reader</button>}
                </div>
                <div className="pdf-viewer-box">
                    <PDFViewer />
                </div>
            </div>
            {(showPagePreview || isChatbotOpen) && (
                <RightSection />
            )}
        </div>
    )
}