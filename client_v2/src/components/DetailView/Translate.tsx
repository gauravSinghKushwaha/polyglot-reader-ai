import { useEffect, useState } from "react"
import { Box } from "../basic/Box"
import apiService from "../../api_service";
import { usePolyglotReader } from "../../state";

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
        <Box className="translate" dangerouslySetInnerHTML={{__html: translation || ""}}></Box>
    )
}