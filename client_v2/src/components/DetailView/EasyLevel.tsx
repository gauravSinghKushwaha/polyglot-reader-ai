import { usePolyglotReader } from "../../state"
import { Box } from "../basic/Box"

export const EasyLevel = () => {
    const { bookInfo, currentPage, defaultLanguage } = usePolyglotReader()

    const isHindi = (defaultLanguage === "Hindi");
    const array = bookInfo?.pages?.[currentPage]?.grade5?.split(".")
    const arrayHindi = bookInfo?.pages?.[currentPage]?.grade5?.split(".")

    return (
        <Box className="easy-level">
            {array?.map((item) => <Box>{item}.</Box>)}
            <br />
            {isHindi && arrayHindi?.map((item) => <Box>{item}.</Box>)}
        </Box>
    )
}