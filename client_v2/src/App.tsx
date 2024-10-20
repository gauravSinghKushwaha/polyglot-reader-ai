import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './components/basic/styles.scss';
import './App.scss';
import { BookList } from './components/BookList';
import { BookReader } from './components/BookReader';
import { Box } from './components/basic/Box';

function App() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    speechSynthesis.cancel();
  }, [])

  const showReaderPage = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % 2);
  };

  const showBookListPage = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1) % 2);
  };

  return (
    <Box className='app' style={{ transform: `translateX(-${activeIndex * 100}vw)` }}>
      <BookList onBookSelect={showReaderPage}/>
      <BookReader onBack={showBookListPage}/>
    </Box>
  );
}

export default App;
