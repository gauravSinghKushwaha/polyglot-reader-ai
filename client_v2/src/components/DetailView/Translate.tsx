import { useEffect, useState } from "react"
import { Box } from "../basic/Box"
import apiService from "../../api_service";
import { usePolyglotReader } from "../../state";
import { Button } from "../basic/Button";
import { SpeakerIcon } from "../basic/Speaker";

export const Translate = () => {
    const { bookInfo, currentPage, defaultLanguage } = usePolyglotReader();
    const [translation, setTranslation] = useState<string>();

    const extractTranslations = (data: any) => {
        let translation: string = ""; // Object to store the latest version of each word
        const lines = data.split('\r\n\r\n'); // Split the data into chunks based on double newlines
        lines.forEach((line: any) => {
            if (line.startsWith('data: ')) {
                try {
                    translation = line.replaceAll('data: ', '');
                    translation = translation.replaceAll("↵", "<br/><br/>");
                    translation = translation.replaceAll("\n", "<br/><br/>");
                } catch (e) {
                    console.error("Failed to parse line:", line, e);
                }
            }
        });

        return translation;
    };

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

    const speak = (index: number = 0) => {
        const para = translation?.split("<br/>").filter(a => a?.length) || [];
        const content = para?.[index];

        if(!content?.length) {
            return;
        }

        // Create a SpeechSynthesisUtterance
        const utterance = new SpeechSynthesisUtterance(content);
        utterance.rate = 0.9;

        // Select a voice
        const voices = speechSynthesis.getVoices();
        const hindiVoice = voices.find(voice => voice.lang === 'hi-IN'); 

        utterance.voice = hindiVoice || voices[0];

        // Move to the next paragraph after the current one finishes
        utterance.onend = () => {
            if ((index + 1) < para.length) {
                speak(index + 1);
            } else {
                speechSynthesis.cancel();
                return;
            }
        };

        // Speak the text
        speechSynthesis.speak(utterance);
    };


    useEffect(() => {
        setTranslation("Loading ...");
        let isTranslationFound = false;
        const text = bookInfo?.pages[currentPage].paragraphs.map((item: any) => {
            const key = `content_${defaultLanguage.toLowerCase()}`;
            if(item[key]) {
                isTranslationFound = true;
                return item[key];
            }
            return item.content;
        }).join(" ↵ ") || "";

        if(isTranslationFound) {
            setTranslation(text.replaceAll("↵", "<br/><br/>"));
        } else {
            apiService.getTranslations(text, defaultLanguage, (chunk) => {
                setTranslation(extractTranslations(chunk));
            })
        }
    }, [currentPage, defaultLanguage])

    return (
        <>
            <Box className="translate" dangerouslySetInnerHTML={{__html: translation || ""}}></Box>
            <Button className="read-to-me-button" onClick={() => speak()}>Read for me <SpeakerIcon /></Button>
        </>
    )
}