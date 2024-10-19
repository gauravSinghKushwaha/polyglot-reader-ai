import { usePolyglotReader } from "../../state"
import { Box } from "../basic/Box"

export const PageVocab = () => {
    const { bookInfo, currentPage } = usePolyglotReader()

    return (
        <Box>
            {bookInfo?.pages?.[currentPage]?.vocab?.map((wordObj, index) => (
                <div key={index} className="word-card">
                    <h3>{wordObj.word}</h3>
                    <p><strong>Meaning:</strong> {wordObj.meaning}</p>
                    <p><strong>Synonym:</strong> {wordObj.synonym}</p>
                    <p><strong>Usage:</strong> "{wordObj.usage}"</p>
                    <p><strong>Meaning in Context:</strong> {wordObj.meaning_in_context}</p>
                </div>
            ))}
        </Box>
    )
}