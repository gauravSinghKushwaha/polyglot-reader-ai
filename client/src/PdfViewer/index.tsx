import React, { useEffect, useRef, useState } from "react";
import { PageChangeEvent, ScrollMode, SpecialZoomLevel, Viewer, ViewMode } from '@react-pdf-viewer/core';
import { IBook, usePolygotReader } from "../state";
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import CustomPageLayer from "./CustomPageLayer";
import ContextMenu from "./ContextMenu";
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import './styles.scss';

const disableScrollPlugin = () => {
    const renderViewer = (props: any) => {
        const { slot } = props;
        if (slot.subSlot && slot.subSlot.attrs && slot.subSlot.attrs.style) {
            slot.subSlot.attrs.style = { ...slot.subSlot.attrs.style, overflow: 'hidden' };
        }
        return slot;
    };
    return { renderViewer };
};

export const PDFViewer: React.FC = () => {
    const [menuVisible, setMenuVisible] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const { setCurrentPage, setPageContent, selectedBook, currentPage, selectionText, setSelectionText, isChatbotOpen, showPagePreview } = usePolygotReader();

    const handleTextSelect = (event: MouseEvent, text: string, rect: DOMRect) => {
        setSelectionText(text);
        if(!(showPagePreview && isChatbotOpen)) {
            setMenuPosition({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX });
            setTimeout(() => {
                setMenuVisible(true);
            }, 0)
        }
    };

    const disableScrollPluginInstance = disableScrollPlugin();
    const defaultLayoutPluginInstance = defaultLayoutPlugin({
        sidebarTabs: () => []
    });

    useEffect(() => {
        function onArrowPress(event: any) {
            if (event.key === 'ArrowLeft') {
                defaultLayoutPluginInstance.toolbarPluginInstance.pageNavigationPluginInstance.jumpToPreviousPage()
            } else if (event.key === 'ArrowRight') {
                defaultLayoutPluginInstance.toolbarPluginInstance.pageNavigationPluginInstance.jumpToNextPage()
            }
        }
        document.addEventListener('keydown', onArrowPress);

        return () => {
            document.removeEventListener('keydown', onArrowPress);
        }
    }, [])

    if (!selectedBook?.link) {
        return null;
    }

    return (
        <>
            <div className="pdf-viewer">
                <Viewer
                    // initialPage={1}
                    defaultScale={SpecialZoomLevel.PageWidth}
                    viewMode={ViewMode.SinglePage}
                    fileUrl={selectedBook?.link}
                    scrollMode={ScrollMode.Page}
                    plugins={[
                        disableScrollPluginInstance,
                        defaultLayoutPluginInstance
                    ]}
                    renderPage={(renderPageProps) => (
                        <CustomPageLayer renderPageProps={renderPageProps} onTextSelect={handleTextSelect} />
                    )}
                    onPageChange={(e: PageChangeEvent) => {
                        setPageContent(null);
                        setCurrentPage(e.currentPage + 1);
                        e.doc.getPage(e.currentPage + 1).then((page) => {
                            page.getTextContent().then(({ items }) => {
                                setPageContent(items);
                            });
                        });
                    }}
                    onDocumentLoad={(e) => {
                    }}
                />
            </div>
            {menuVisible && (
                <ContextMenu
                    selectedText={selectionText}
                    menuPosition={menuPosition}
                    onClose={() => {
                        window.getSelection()?.removeAllRanges();
                        setMenuVisible(false);
                    }}
                />
            )}
            <div className="page-button">
                <a onClick={() => defaultLayoutPluginInstance.toolbarPluginInstance.pageNavigationPluginInstance.jumpToPreviousPage()}><i className="bi bi-arrow-left-circle"></i></a>
                <div>{currentPage} of {selectedBook?.totalPages} pages</div>
                <a onClick={() => {
                    defaultLayoutPluginInstance.toolbarPluginInstance.pageNavigationPluginInstance.jumpToNextPage()
                }}><i className="bi bi-arrow-right-circle"></i></a>
            </div>
        </>
    );
};
