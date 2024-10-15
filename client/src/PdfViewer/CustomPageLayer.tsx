import React, { useEffect } from "react";
import { RenderPageProps } from '@react-pdf-viewer/core';

interface CustomPageLayerProps {
    renderPageProps: RenderPageProps;
    onTextSelect: (event: MouseEvent, selectedText: string, position: DOMRect) => void;
}

const CustomPageLayer: React.FC<CustomPageLayerProps> = ({ renderPageProps, onTextSelect }) => {
    useEffect(() => {
        const handleMouseUp = (event: MouseEvent) => {
            const selection = window.getSelection();
            if (selection && selection.toString().length > 0) {
                const selectedText = selection.toString();
                const range = selection.getRangeAt(0);
                const rect = range.getBoundingClientRect();
                onTextSelect(event, selectedText, rect);
            }
        };

        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [onTextSelect]);

    useEffect(() => {
        if (renderPageProps.textLayerRendered) {
            renderPageProps.markRendered(renderPageProps.pageIndex);
        }
    }, [renderPageProps.textLayerRendered]);

    useEffect(() => {
        setTimeout(() => {
            renderPageProps.markRendered(renderPageProps.pageIndex);
        }, 5000);
    }, []);

    return (
        <>
            {renderPageProps.svgLayer.children}
            {renderPageProps.textLayer.children}
            {renderPageProps.annotationLayer.children}
        </>
    );
};

export default CustomPageLayer;
