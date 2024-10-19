import { IBook } from "../../api_service/interface";
import { usePolyglotReader } from "../../state";
import { Box } from "../basic/Box";
import { Button } from "../basic/Button";
import { Image } from "../basic/Image";
import './styles.scss';

const Book: React.FC<IBook> = (props) => {
    return (
        <Box className="book">
            <Image src={props.thumbnail} />
            {/* <Box>
                <Box>{props.name}</Box>
                <Box>{props.author}</Box>
            </Box> */}
            <Box className="hovered-state">
                <Button>Read Book</Button>
            </Box>
        </Box>
    )
}

export const BookList = ({ onBookSelect }: any) => {
    const { bookList, setCurrentBook } = usePolyglotReader();

    return (
        <Box className="book-list">
            {bookList.map((book: IBook) => <Box onClick={() => {
                setCurrentBook(book);
                onBookSelect();
            }}><Book {...book} /></Box>)}
        </Box>
    );
}