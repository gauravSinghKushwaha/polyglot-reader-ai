import React, { useState } from 'react';
import { IBook, usePolygotReader } from '../state';
import BookLauncher from '../BookLauncher';
import './styles.scss';

const BookList: React.FC = () => {
  const { books, selectedBook, setSelectedBook } = usePolygotReader();


  const onBack = () => {
    setSelectedBook(null);
  }

  return (
    <>
      {
        !selectedBook?.id &&
        <div className='book-list-component'>
          <h1>Book Library</h1>
          <div className='book-list'>
            {books.map(book => (
              <div key={book.id} className='book-card'>
                <img className='book-thumbnail' src={book.thumbnail} alt={`${book.title} cover`} />
                <div className='book-info'>
                  <h2 className='book-title'>{book.title}</h2>
                  <p className='book-author'>Author: {book.author || "NA"}</p>
                  <p className='book-author'>Total Pages: {book.totalPages}</p>
                  <button className='read-book-btn' onClick={() => setSelectedBook(book)}>
                    Read Book
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      }
      {selectedBook?.id && <BookLauncher key={selectedBook.id} bookId={selectedBook.id} onBack={onBack} />}
    </>
  );
};

export default BookList;
