import { useEffect, useMemo, useState } from "react";
import { usePolyglotReader } from "../../state";
import { Box } from "../basic/Box";
import { Button } from "../basic/Button";
import './styles.scss';
import apiService from "../../api_service";
import { IBookInfo } from "../../api_service/interface";
import { DetailView } from "../DetailView";
import { SpeakerIcon } from "../basic/Speaker";

const SUPPORTED_LANGUAGES = ['English', 'Hindi', 'Spanish', 'French'];

export const BookReader = ({ onBack }: any) => {
    const { currentBook, defaultLanguage, setDefaultLanguage, setBookInfo, bookInfo, currentPage, setCurrentPage, selectedTab, selectionText } = usePolyglotReader();
    const [showDetailView, toggleDetailView] = useState(false);
    const [currentPara, setCurrentPara] = useState(0);
    const [highlightedIndex, setHighlightedIndex] = useState(-1); // To track the word being highlighted

    useEffect(() => {
        return () => {
            speechSynthesis.cancel();
        }
    }, [])

    useEffect(() => {
        if(speechSynthesis.speaking || speechSynthesis.pending) {
            speechSynthesis.cancel();
        }

        return () => {
            speechSynthesis.cancel();
        }
    }, [currentPage])

    useEffect(() => {
        if (currentBook?.isbn) {
            apiService.getBookInfo("pg"+currentBook.isbn).then((res) => {
                setBookInfo(res);
            });
        }
    }, [currentBook?.isbn]);

    useEffect(() => {
        if(selectionText?.length) {
            toggleDetailView(true);
        }
    }, [selectionText]);

    const searchWords = useMemo(() => {
        if(selectedTab?.label) {
            switch(selectedTab.label) {
                case 'Summary':
                    return bookInfo?.pages?.[currentPage]?.cultural_ref?.map((item) => item.part_of_text) || [];
                case 'Vocabulary':
                    return bookInfo?.pages?.[currentPage]?.vocab?.map((item) => item.word) || [];
            }
        }

        return [];
    }, [selectedTab, currentPage]);

    if (!currentBook?.name || !bookInfo?.isbn) {
        return null;
    }


    const speak = (index: number = 0) => {
        const para = bookInfo?.pages[currentPage]?.paragraphs;
        const content = para?.[index]?.content;

        if(speechSynthesis.speaking || speechSynthesis.pending) {
            setHighlightedIndex(-1);
            speechSynthesis.cancel();
            return;
        }

        if(!content?.length) {
            return;
        }

        // Create a SpeechSynthesisUtterance
        const utterance = new SpeechSynthesisUtterance(content);
        utterance.pitch = 1;
        utterance.rate = 0.9;

        // Select a voice
        const voices = speechSynthesis.getVoices();
        utterance.voice = voices[1]; // Choose a specific voice

        // Highlight text while reading
        utterance.onboundary = (event) => {
            if (event.name === 'word') {
                const spokenWordIndex = event.charIndex; // Get the character index of the spoken word
                const wordsBefore = content.slice(0, spokenWordIndex).split(' ').length - 1;
                console.log(content.slice(0, spokenWordIndex).split(' '))
                setHighlightedIndex(wordsBefore); // Set the index of the highlighted word
            }
        };

        // Move to the next paragraph after the current one finishes
        utterance.onend = () => {
            if ((index + 1) < para.length) {
                setCurrentPara(index + 1); // Update paragraph index
                setTimeout(() => {
                    speak(index + 1);
                }, 1000)
            } else {
                speechSynthesis.cancel();
                return;
            }
        };

        // Speak the text
        speechSynthesis.speak(utterance);
    };

    return (
        <Box key={currentBook?.isbn} className={`book-reader ${selectedTab?.label}`}>
            <Box className="header">
                <Button onClick={onBack}>Go back to Library</Button>
                {/* <Box> */}
                    <h3>{currentBook.name}</h3>
                    {/* <sub><i>- by {currentBook.author}</i></sub> */}
                {/* </Box> */}
                <select value={defaultLanguage} onChange={(e) => {
                    setDefaultLanguage(e.currentTarget.value);
                }}>
                    {SUPPORTED_LANGUAGES.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
            </Box>

            <Box className="body">
                <Box className="book-content">
                    <Box className="chapter-name">
                        {bookInfo.pages[currentPage].chapter}
                        <Button onClick={() => speak()}><SpeakerIcon /></Button>
                        {/* (<small><i><a onClick={() => speak()}>Read page</a></i></small>) */}
                    </Box>
                    
                    <Box className="para-list">
                        {bookInfo.pages[currentPage].paragraphs.map((item, paraIndex) => {
                            let content = item.content.replaceAll("\n", " ");
                            searchWords.forEach((item) => {
                                content = content.split(item).join(`<span class="highlight">${item}</span>`);
                            });
                            return (
                                <Box key={paraIndex} className="para">
                                    <Box className="para-margin"></Box>
                                    {/* Highlight words dynamically */}
                                    {(highlightedIndex === -1) && <span dangerouslySetInnerHTML={{__html: content}}></span>}
                                    {(highlightedIndex > -1) && item.content.replaceAll("\n", " ").split(' ').map((word, wordIndex) => {
                                        const cleanWord = word.replace(/[.,!?"']/g, "").trim().toLowerCase();
                                        return (
                                            <span
                                                key={wordIndex}
                                                style={{
                                                    backgroundColor: wordIndex === highlightedIndex && paraIndex === currentPara ? 'yellow' : 'transparent',
                                                    borderBottom: searchWords.includes(cleanWord) ? "3px solid rgb(140, 41, 233)" : "none"
                                                }}
                                            >
                                                {word}{' '}
                                            </span>
                                        )
                                    })}
                                </Box>
                            )
                        })}
                    </Box>

                    <Box className="pagination">
                        <Button disabled={currentPage === 0} onClick={() => setCurrentPage(prev => prev - 1)} className="page-action">Prev</Button>
                        <Box><small>{currentPage + 1} / {bookInfo.pages.length} pages</small></Box>
                        <Button disabled={currentPage === bookInfo.pages.length - 1} onClick={() => setCurrentPage(prev => prev + 1)} className="page-action">Next</Button>
                    </Box>
                </Box>

                <Box className="detail-view" style={{ width: showDetailView ? "calc(100vw - 800px)" : 0 }}>
                    {showDetailView && <Box onClick={() => toggleDetailView(false)} className="polyglot-reader-close">{"X"}</Box>}
                    <DetailView />
                </Box>
            </Box>

            {!showDetailView && <Box onClick={() => toggleDetailView(true)} className="polyglot-reader-trigger"><img width={30} height={30} src="/logo.jpg"/></Box>}
        </Box>
    );
};
