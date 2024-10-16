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
    const { askQuestion, selectedLang, toggleChat } = usePolygotReader();
    const {response, callApi} = useEventStream();

    useEffect(() => {
        // Simulate fetching answer based on selected text
        const payload = {
            text: selectedText, query: `
            Provide me details of this text,
            if this text is name of anything famous provide me details of that name
            else provide info like meaning, synonyms, antonyms, figure of speech if available. 
            also provide translation of text in ${selectedLang}.
            Provide response in html format to show in a popup use tag h1, p, ul, li only and links in a[target = _blank] tag.
            please provide response faster.`
        }
        callApi("comprehend/ask_question_stream", payload);
    }, [selectedText]);

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
            <div className="context-menu" ref={menuRef} style={{ top: `${menuPosition.top + 10}px`, left: `${menuPosition.left}px` }}>
                <div className="context-menu-content">
                    <div className="ans" dangerouslySetInnerHTML={{ __html: response || `Loading details for <b><i>${selectedText}</i></b> ...` }} />
                    {(ans?.length > 0) && <button onClick={() => toggleChat()}>
                        Ask more to Assistance
                    </button>}
                </div>
            </div>
        </>
    );
};

export default ContextMenu;
