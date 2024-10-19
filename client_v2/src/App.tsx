import React from 'react';
import logo from './logo.svg';
import './App.scss';
import { PolyglotReaderProvider } from './state';

function App() {
  return (
    <PolyglotReaderProvider>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    </PolyglotReaderProvider>
  );
}

export default App;
