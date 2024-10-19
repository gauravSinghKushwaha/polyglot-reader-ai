import { useState } from "react";
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
        icon: 'bi-journal-text',
        label: 'Easy Reading',
        Component: <EasyLevel />
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

export const DetailView = () => {
    const { currentPage } = usePolyglotReader();
    const [selectedTab, setSelectedTab] = useState(Tabs[0]);

    return (
        <>
            <Box className="tabs">
                {Tabs.map((item) => <div onClick={() => setSelectedTab(item)} className={selectedTab.label == item.label ? 'active' : ''}><i className={`bi ${item.icon}`}></i> {item.label}</div>)}
            </Box>
            <Box key={currentPage} style={{padding: 24, height: "calc(100vh - 165px)", overflow: "auto"}}>{selectedTab?.Component}</Box>
        </>
    )
}