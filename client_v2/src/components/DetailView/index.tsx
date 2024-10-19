import { useEffect, useState } from "react";
import { Box } from "../basic/Box"
import { PageSummary } from "./PageSummary";
import { PageVocab } from "./PageVocab";
import { Translate } from "./Translate";
import { QuesAndAns } from "./QuesAndAns";
import './styles.scss';
import { usePolyglotReader } from "../../state";
import { EasyLevel } from "./EasyLevel";

const Tabs = [
    {
        icon: 'bi-journal-text',
        label: 'Summary',
        Component: <PageSummary />
    },
    {
        icon: 'bi-bookshelf',
        label: 'Vocabulary',
        Component: <PageVocab />
    },
    {
        icon: 'bi-journal-text',
        label: 'Easy Reading',
        Component: <EasyLevel />
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

export const DetailView = () => {
    const { currentPage, selectedTab, setSelectedTab, setSelectionText, selectionText } = usePolyglotReader();

    const handleSelectionChange = () => {
        const selection = window.getSelection();
        if (selection) {
            const selectedText = selection.toString();
            if (selectedText) {
                setSelectionText(selectedText);
            } else {
                setSelectionText('');
            }
        }
    };

    useEffect(() => {
        // Listen for the selectionchange event
        document.addEventListener('selectionchange', handleSelectionChange);

        // Cleanup the event listener on component unmount
        return () => {
            document.removeEventListener('selectionchange', handleSelectionChange);
        };
    }, []);

    useEffect(() => {
        if(!selectedTab?.label) {
            setSelectedTab(Tabs[0]);
        }
    }, []);

    useEffect(() => {
        if(selectionText?.length) {
            setSelectedTab(Tabs[Tabs.length-1]);
        }
    }, [selectionText]);

    return (
        <>
            <Box className="tabs">
                {Tabs.map((item) => <div onClick={() => setSelectedTab(item)} className={selectedTab?.label == item.label ? 'active' : ''}><i className={`bi ${item.icon}`}></i> {item.label}</div>)}
            </Box>
            <Box key={currentPage} style={{padding: 24, height: "calc(100vh - 165px)", overflow: "auto"}}>{selectedTab?.Component}</Box>
        </>
    )
}