import { useState } from "react";
import { Box } from "../basic/Box"
import { PageSummary } from "./PageSummary";
import { PageVocab } from "./PageVocab";
import { Translate } from "./Translate";
import { QuesAndAns } from "./QuesAndAns";
import './styles.scss';

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

export const DetailView = () => {
    const [selectedTab, setSelectedTab] = useState(Tabs[0]);

    return (
        <>
            <Box className="tabs">
                {Tabs.map((item) => <div onClick={() => setSelectedTab(item)} className={selectedTab.label == item.label ? 'active' : ''}><i className={`bi ${item.icon}`}></i> {item.label}</div>)}
            </Box>
            {selectedTab?.Component}
        </>
    )
}