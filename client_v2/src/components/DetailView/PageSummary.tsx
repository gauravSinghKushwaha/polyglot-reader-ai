import { usePolyglotReader } from "../../state"
import { Box } from "../basic/Box"

export const PageSummary = () => {
    const { bookInfo, currentPage } = usePolyglotReader()

    return (
        <Box>
            <h3>Recap ...</h3>
            <i>{bookInfo?.pages?.[currentPage]?.summary_so_far}</i>
            <div>
                <h3>Important Text</h3>
                {bookInfo?.pages?.[currentPage]?.cultural_ref?.map((item, index) => (
                    <div key={index} className="text-card">
                        <h4>Part of Text: "{item.part_of_text}"</h4>
                        <p><strong>Significance:</strong> {item.significance}</p>
                        <p><strong>Improvement in Understanding:</strong> {item.improve_understanding_of_text}</p>
                    </div>
                ))}
            </div>
        </Box>
    )
}