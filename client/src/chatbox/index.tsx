import React, { useState } from 'react';
import './style.scss';
import { usePolygotReader } from '../state';
import { QuesAndAns } from '../Q&A';

const ChatBot = () => {
    const { isChatbotOpen, toggleChat } = usePolygotReader();
    return (
        <div className="chatbot-container">
            {isChatbotOpen && (
                <div className="chatbot-window slide-up">
                    <div className="chatbot-header">
                        <h2>Chat Bot</h2>
                        <button className="close-button" onClick={() => toggleChat()}>
                            &times;
                        </button>
                    </div>
                    <QuesAndAns />
                </div>
            )}
        </div>
    );
};

export default ChatBot;
