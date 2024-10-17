import React, { useEffect, useRef } from "react";
import { RenderPageProps } from '@react-pdf-viewer/core';

interface CustomPageLayerProps {
    renderPageProps: RenderPageProps;
    onTextSelect: (event: MouseEvent, selectedText: string, position: DOMRect) => void;
}

const CustomPageLayer: React.FC<CustomPageLayerProps> = ({ renderPageProps, onTextSelect }) => {
    const pageRef = useRef<HTMLDivElement>(null);

    const handleMouseUp = (event: MouseEvent) => {
        if (pageRef.current && pageRef.current.contains(event.target as Node)) {
            const selection = window.getSelection();
            if (selection && selection.toString().length > 0) {
                const selectedText = selection.toString();
                const range = selection.getRangeAt(0);
                const rect = range.getBoundingClientRect();
                onTextSelect(event, selectedText, rect);
            }
        }
    };

    useEffect(() => {
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

    if(renderPageProps.canvasLayer.attrs && renderPageProps.canvasLayer.attrs.style)
    renderPageProps.canvasLayer.attrs.id = "text"

    return (
        <div ref={pageRef}>
            {renderPageProps.canvasLayer.children}
            {renderPageProps.textLayer.children}
            {renderPageProps.annotationLayer.children}
        </div>
    );
};

export default CustomPageLayer;
