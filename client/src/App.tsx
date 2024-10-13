import React, { ReactElement } from 'react';
import './App.scss';
import BookList from './BookList';
import { PolygotReaderProvider } from './state';


function App() {

  return (
    <PolygotReaderProvider>
      <BookList />
    </PolygotReaderProvider>
  );
}

export default App;
