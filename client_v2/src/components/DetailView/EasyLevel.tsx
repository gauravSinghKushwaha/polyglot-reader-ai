import { usePolyglotReader } from "../../state"
import { Box } from "../basic/Box"

export const EasyLevel = () => {
    const { bookInfo, currentPage } = usePolyglotReader()

    const array = bookInfo?.pages?.[currentPage]?.grade5?.split(".")

    return (
        <Box>
            {array?.map((item) => <Box><i>{item}.</i></Box>)}
        </Box>
    )
}