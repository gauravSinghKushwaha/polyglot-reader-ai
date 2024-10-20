import { usePolyglotReader } from "../../state"
import { Box } from "../basic/Box"

export const PageSummary = () => {
    const { bookInfo, currentPage, defaultLanguage } = usePolyglotReader()
    const isHindi = (defaultLanguage === "Hindi");
    return (
        <Box className="page-summary">
            {/* <h3>Recap ...</h3> */}
            <Box className="recap"><i>{bookInfo?.pages?.[currentPage]?.summary_so_far}</i></Box><br />
            {isHindi && <Box className="recap"><i>"{bookInfo?.pages?.[currentPage]?.summary_so_far_hindi}"</i></Box>}
            <div>
                <h3>Important Text</h3>
                {bookInfo?.pages?.[currentPage]?.cultural_ref?.map((item, index) => (
                    <div key={index} className="text-card">
                        <h4><i>"{item.part_of_text}"</i> {isHindi && <i>({item.part_of_text_hindi})</i>}</h4>
                        {
                            !!item?.significance?.length &&
                            <>
                                {/* <strong>Significance:</strong> */}
                                <p>{item.significance}</p>
                            </>
                        }
                        {
                            !!item?.improve_understanding_of_text?.length &&
                            <>
                                {/* <strong>Improvement in Understanding:</strong> */}
                                <p>{item.improve_understanding_of_text}</p>
                            </>
                        }
                    </div>
                ))}
            </div>
        </Box>
    )
}