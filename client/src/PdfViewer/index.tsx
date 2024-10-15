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

export const PDFViewer: React.FC<{ book: IBook }> = ({ book }) => {
    const [menuVisible, setMenuVisible] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const [selectedText, setSelectedText] = useState("");
    const { setCurrentPage, setPageContent } = usePolygotReader();

    const handleTextSelect = (event: MouseEvent, text: string, rect: DOMRect) => {
        setSelectedText(text);
        setMenuPosition({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX });
        setTimeout(() => {
            setMenuVisible(true);
        }, 0)
    };

    const disableScrollPluginInstance = disableScrollPlugin();
    const defaultLayoutPluginInstance = defaultLayoutPlugin();
    defaultLayoutPluginInstance.toolbarPluginInstance.scrollModePluginInstance.switchScrollMode(ScrollMode.Page);

    return (
        <div className="pdf-viewer">
            <Viewer
                // initialPage={1}
                defaultScale={SpecialZoomLevel.PageWidth}
                viewMode={ViewMode.SinglePage}
                fileUrl={book.link}
                plugins={[disableScrollPluginInstance, defaultLayoutPluginInstance]}
                renderPage={(renderPageProps) => (
                    <CustomPageLayer renderPageProps={renderPageProps} onTextSelect={handleTextSelect} />
                )}
                onPageChange={(e: PageChangeEvent) => {
                    setPageContent(null);
                    setCurrentPage(e.currentPage + 1);
                    e.doc.getPage(e.currentPage + 1).then((page) => {
                        page.getTextContent().then(({items}) => {
                            setPageContent(items);
                        });
                    });
                }}
            />
            {menuVisible && (
                <ContextMenu
                    selectedText={selectedText}
                    menuPosition={menuPosition}
                    onClose={() => setMenuVisible(false)}
                />
            )}
        </div>
    );
};
