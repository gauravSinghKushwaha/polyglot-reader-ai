import { useEffect, useState } from "react";
import { usePolyglotReader } from "../../state";
import { Box } from "../basic/Box";
import { Button } from "../basic/Button";
import './styles.scss';
import apiService from "../../api_service";
import { IBookInfo } from "../../api_service/interface";
import { DetailView } from "../DetailView";

const SUPPORTED_LANGUAGES = ['English', 'Hindi', 'Spanish', 'French'];

export const BookReader = ({ onBack }: any) => {
    const { currentBook, defaultLanguage, setDefaultLanguage } = usePolyglotReader();
    const [currentPage, setCurrentPage] = useState(0);
    const [bookInfo, setBookInfo] = useState<IBookInfo>();
    const [showDetailView, toggleDetailView] = useState(false);

    useEffect(() => {
        if (currentBook?.isbn) {
            apiService.getBookInfo("pg766").then((res) => {
                setBookInfo(res);
            });
        }
    }, [currentBook?.isbn])

    if (!currentBook?.name || !bookInfo?.isbn) {
        return null;
    }

    return (
        <Box className="book-reader">
            <Box className="header">
                <Button onClick={onBack}>Go back to Library</Button>
                <Box><h3>{currentBook.name}</h3><sub><i>- by {currentBook.author}</i></sub></Box>
                <select value={defaultLanguage} onChange={(e) => {
                    setDefaultLanguage(e.currentTarget.value);
                }}>
                    {SUPPORTED_LANGUAGES.map((item) => <option value={item}>{item}</option>)}
                </select>
                {/* <Button><b>Try Polyglot Assistance ?</b></Button> */}
            </Box>
            <Box className="body">
                <Box className="book-content">
                    <Box className="chapter-name"><small><b>{bookInfo.pages[currentPage].chapter}</b></small></Box>
                    <Box className="para-list">
                        {bookInfo.pages[currentPage].paragraphs.map((item) => (
                            <Box className="para">
                                <Box className="para-margin"></Box>
                                {item.content}
                            </Box>
                        ))}
                    </Box>
                    <Box className="pagination">
                        <Button disabled={currentPage == 0} onClick={() => setCurrentPage(pre => pre - 1)} className="page-action">Prev</Button>
                        <Box><small>{currentPage + 1} / {bookInfo.pages.length} pages</small></Box>
                        <Button disabled={currentPage == bookInfo.pages.length - 1} onClick={() => setCurrentPage(pre => pre + 1)} className="page-action">Next</Button>
                    </Box>
                </Box>
                <Box className="detail-view" style={{ width: showDetailView ? "calc(100vw - 800px)" : 0 }}>
                    {showDetailView && <Box onClick={() => toggleDetailView(false)} className="polyglot-reader-close">{">>"}</Box>}
                    <DetailView />
                </Box>
            </Box>
            {!showDetailView && <Box onClick={() => toggleDetailView(true)} className="polyglot-reader-trigger">?</Box>}
        </Box>
    )
}