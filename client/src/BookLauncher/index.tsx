import React, { useState } from 'react'; // Import useState
import { usePolygotReader } from '../state'; // Adjust the import path as necessary
import './styles.scss';
import { PDFViewer } from '../PdfViewer';
import { RightSection } from '../RightSection';
import ChatBot from '../chatbox';

interface BookLauncherProps {
    bookId: number;
    onBack: Function;
}

const BookLauncher: React.FC<BookLauncherProps> = ({ bookId, onBack }) => {
    const { getBookById } = usePolygotReader();
    const book = getBookById(bookId);

    if (!book) {
        return <div>Book not found.</div>;
    }

    return (
        <>
            <div className='book-launcher-component'>
                <PDFViewer book={book} />
                <RightSection book={book} onBack={onBack} />
            </div>
            <ChatBot />
        </>
    );
};

export default BookLauncher;
