import React, { useEffect, useState } from "react";
import { usePolygotReader } from "../state";
import ChatBot from "../chatbox";
import { PageSummary } from "./PageSummary";
import { PageVocab } from "./PageVocab";
import { Translate } from "./Translate";
import { QuesAndAns } from "../Q&A";

const Tabs = [
    {
        icon: 'bi-journal-text',
        label: 'Page Summary',
        Component: <PageSummary />
    },
    {
        icon: 'bi-bookshelf',
        label: 'Vocabulary',
        Component: <PageVocab />
    },
    {
        icon: 'bi-translate',
        label: 'Translate',
        Component: <Translate />
    },
    {
        icon: 'bi-chat-dots-fill',
        label: 'Q&A',
        Component: <QuesAndAns />
    },
]

export const RightSection = () => {
    const { isChatbotOpen, currentPage, toggleChat } = usePolygotReader();
    const [selectedTab, setSelectedTab] = useState(Tabs[0]);

    useEffect(() => {
        if(isChatbotOpen && (selectedTab?.label !== "Q&A")) {
            const temp = Tabs.find((item) => item.label === "Q&A");
            if(temp)  
                setSelectedTab(temp);
            }
    }, [isChatbotOpen])

    useEffect(() => {
        toggleChat(selectedTab?.label === "Q&A");
    }, [selectedTab])

    // if(isChatbotOpen) {
    //     return (
    //         <div className="right-section">
    //             <div className="tabs"><div>Q&A</div></div>
    //             <QuesAndAns />
    //         </div>
    //     )
    // }

    return (
        <div className="right-section">
            <div className="tabs">
                {Tabs.map((item) => <div onClick={() => setSelectedTab(item)} className={selectedTab.label == item.label ? 'active' : ''}><i className={`bi ${item.icon}`}></i> {item.label}</div>)}
            </div>
            {selectedTab?.Component}
        </div>
    )
}