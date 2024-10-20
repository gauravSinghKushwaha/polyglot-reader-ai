import { usePolyglotReader } from "../../state"
import { Box } from "../basic/Box"

export const PageVocab = () => {
    const { bookInfo, currentPage } = usePolyglotReader()

    return (
        <Box className="vocab">
            {bookInfo?.pages?.[currentPage]?.vocab?.map((wordObj, index) => (
                <div key={index} className="word-card">
                    <Box className="word"><h3 style={{textTransform: "capitalize"}}>{wordObj.word}</h3> <small>({wordObj["word_hindi"]})</small> - <i>{wordObj.meaning}</i></Box>
                    <p><strong>Synonym:</strong> {wordObj.synonym}</p>
                    <p><strong>Usage:</strong> "{wordObj.usage}"</p>
                    <p><strong>Meaning in Context:</strong> {wordObj.meaning_in_context}</p>
                </div>
            ))}
        </Box>
    )
}