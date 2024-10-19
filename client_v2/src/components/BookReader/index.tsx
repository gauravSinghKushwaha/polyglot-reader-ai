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
    const { currentBook, defaultLanguage, setDefaultLanguage, setBookInfo, bookInfo, currentPage, setCurrentPage } = usePolyglotReader();
    const [showDetailView, toggleDetailView] = useState(false);
    const [currentPara, setCurrentPara] = useState(0);
    const [highlightedIndex, setHighlightedIndex] = useState(-1); // To track the word being highlighted

    useEffect(() => {
        return () => {
            speechSynthesis.cancel();
        }
    }, [currentPara]);

    useEffect(() => {
        if (currentBook?.isbn) {
            apiService.getBookInfo("pg"+currentBook.isbn).then((res) => {
                setBookInfo(res);
            });
        }
    }, [currentBook?.isbn]);

    if (!currentBook?.name || !bookInfo?.isbn) {
        return null;
    }

    const speak1 = (index: number = 0) => {
        const para = bookInfo?.pages[currentPage]?.paragraphs;
        const content = para?.[index]?.content;

        if(!content?.length) {
            return null;
        }

        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'API-Subscription-Key': 'ae86d0e7-7c49-4896-84fb-2c63ce35f2c9' },
            body: JSON.stringify({ "inputs": [content], "target_language_code": "en-IN", "speaker": "amol", "pitch": 0, "pace": 1, "loudness": 1.5, "speech_sample_rate": 8000, "enable_preprocessing": true, "model": "bulbul:v1" })
        };

        fetch('https://api.sarvam.ai/text-to-speech', options)
            .then(response => response.json())
            .then(response => {
                const binaryString = atob(response?.audios?.[0]);

                // Convert binary string to Uint8Array
                const len = binaryString.length;
                const bytes = new Uint8Array(len);
                for (let i = 0; i < len; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                }

                // Create a Blob from the Uint8Array
                const blob = new Blob([bytes], { type: "audio/wav" });
                const url = URL.createObjectURL(blob);
                // setAudioUrl(url);

                 // Create audio element
                 const audioElement = document.createElement('audio');
                 audioElement.src = url;
                 audioElement.controls = true; // Add controls to play/pause the audio
                 audioElement.autoplay = true; // Automatically play audio

                 // Clear previous audio and append new audio element
                 audioElement.innerHTML = ''; // Clear previous audio elements
                 audioElement.appendChild(audioElement);

                //  audioElement.play();

                 audioElement.addEventListener("ended", () => {
                    setCurrentPara(pre => pre+1);
                    setTimeout(() => {
                        speak(currentPara + 1);
                    }, 0)
                 })
            })
            .catch(err => console.error(err));
    };

    const speak = (index: number = 0) => {
        const para = bookInfo?.pages[currentPage]?.paragraphs;
        const content = para?.[index]?.content;

        if(!content?.length) {
            return;
        } else {
            speechSynthesis.cancel();
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
            }
        };

        // Speak the text
        speechSynthesis.speak(utterance);
    };

    return (
        <Box className="book-reader">
            <Box className="header">
                <Button onClick={onBack}>Go back to Library</Button>
                <Box>
                    <h3>{currentBook.name}</h3>
                    <sub><i>- by {currentBook.author}</i></sub>
                </Box>
                <select value={defaultLanguage} onChange={(e) => {
                    setDefaultLanguage(e.currentTarget.value);
                }}>
                    {SUPPORTED_LANGUAGES.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
            </Box>

            <Box className="body">
                <Box className="book-content">
                    <Box className="chapter-name">
                        <b>{bookInfo.pages[currentPage].chapter}</b>
                        (<small><i><a onClick={() => speak()}>Read page</a></i></small>)
                    </Box>
                    
                    <Box className="para-list">
                        {bookInfo.pages[currentPage].paragraphs.map((item, paraIndex) => (
                            <Box key={paraIndex} className="para">
                                <Box className="para-margin"></Box>
                                {/* Highlight words dynamically */}
                                {item.content.split(' ').map((word, wordIndex) => (
                                    <span
                                        key={wordIndex}
                                        style={{
                                            backgroundColor: wordIndex === highlightedIndex && paraIndex === currentPara ? 'yellow' : 'transparent',
                                        }}
                                    >
                                        {word}{' '}
                                    </span>
                                ))}
                            </Box>
                        ))}
                    </Box>

                    <Box className="pagination">
                        <Button disabled={currentPage === 0} onClick={() => setCurrentPage(prev => prev - 1)} className="page-action">Prev</Button>
                        <Box><small>{currentPage + 1} / {bookInfo.pages.length} pages</small></Box>
                        <Button disabled={currentPage === bookInfo.pages.length - 1} onClick={() => setCurrentPage(prev => prev + 1)} className="page-action">Next</Button>
                    </Box>
                </Box>

                <Box className="detail-view" style={{ width: showDetailView ? "calc(100vw - 800px)" : 0 }}>
                    {showDetailView && <Box onClick={() => toggleDetailView(false)} className="polyglot-reader-close">{">>"}</Box>}
                    <DetailView />
                </Box>
            </Box>

            {!showDetailView && <Box onClick={() => toggleDetailView(true)} className="polyglot-reader-trigger">?</Box>}
        </Box>
    );
};
