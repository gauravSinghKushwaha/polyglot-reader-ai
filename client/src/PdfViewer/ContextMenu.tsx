import React, { useEffect, useRef, useState } from "react";
import { usePolygotReader } from "../state";
import { useEventStream } from "../hooks/useEventStream";

interface ContextMenuProps {
    selectedText: string;
    menuPosition: { top: number; left: number };
    onClose: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ selectedText, menuPosition, onClose }) => {
    const menuRef = useRef<HTMLDivElement>(null);
    const [ans, setAns] = useState("");
    const { askQuestion, selectedLang, toggleChat, togglePagePreview } = usePolygotReader();

    // Close menu when clicked outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [menuRef]);

    // Disable background scrolling
    useEffect(() => {
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        return () => {
            document.body.style.overflow = 'auto'; // Re-enable scrolling on close
        };
    }, []);

    return (
        <>
            <div className="context-menu-overlay" onClick={onClose} />
            <div className="context-menu" ref={menuRef} style={{ top: `${menuPosition.top}px`, left: `${menuPosition.left}px` }}>
                <div className="context-menu-content">
                    <div onClick={() => {
                        onClose();
                        toggleChat(true);
                        togglePagePreview(true);
                    }}><i className="bi bi-info-circle-fill"></i></div>
                </div>
            </div>
        </>
    );
};

export default ContextMenu;
