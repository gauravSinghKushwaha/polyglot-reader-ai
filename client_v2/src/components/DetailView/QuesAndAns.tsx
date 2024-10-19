import React, { useEffect, useRef, useState } from "react";
import './styles.scss';
import { usePolyglotReader } from "../../state";
import apiService from "../../api_service";


export const QuesAndAns: React.FC = () => {
    const chatAreaRef = useRef<HTMLDivElement>(null);
    const [ques, setQues] = useState<string>('');
    const [chatList, setChatList] = useState<any>({});
    const [activeQues, setActiveQues] = useState<any>({});
    const { selectionText, setSelectionText, defaultLanguage, currentPage, bookInfo } = usePolyglotReader();

    useEffect(() => {
        setTimeout(() => {
            if (chatAreaRef.current) {
                chatAreaRef.current.scrollTo({
                    top: chatAreaRef.current.scrollHeight,
                    behavior: "smooth"
                });
            }
        }, 200)
    }, [chatList, selectionText]);

    const extractText = (data: any) => {
        let translation: string = ""; // Object to store the latest version of each word
        const lines = data.split('\r\n\r\n'); // Split the data into chunks based on double newlines
        lines.forEach((line: any) => {
            if (line.startsWith('data: ')) {
                try {
                    translation = line.replaceAll('data: ', '');
                    translation = translation.replaceAll("↵", "<br/><br/>");
                    translation = translation.replaceAll("\n", "<br/><br/>");
                } catch (e) {
                    console.error("Failed to parse line:", line, e);
                }
            }
        });

        return translation;
    };

    const setAnswer = (id: string, text: string, query: string) => {
        apiService.askQuery(text, query, (chunk) => {
            chatList[id] = { ...chatList[id], ans: extractText(chunk) };
            setChatList({ ...chatList });
        });
    }

    const setSelectionInfo = (id: string, text: string, content: string) => {
        apiService.getSelectionInfo(text, content, defaultLanguage, (chunk) => {
            chatList[id] = { ...chatList[id], ans: extractText(chunk) };
            setChatList({ ...chatList });
        });
    }

    const setMessage = async (action: string, query: string) => {
        const id = btoa(Date.now().toString());
        chatList[id] = { id, action, query, lang: defaultLanguage };
        setActiveQues(chatList[id]);
        setChatList({ ...chatList });
        setSelectionText('');
        setQues('');
        const text = bookInfo?.pages[currentPage].content || "";
        if(action === "ask_question") {
            setAnswer(id, text, query);
        } else {
            setSelectionInfo(id, selectionText || "", text);
        }
    }

    const isWord = selectionText?.split(" ")?.length == 1;

    return (
        <div className="ques-and-ans">
            <div className="chat-area" ref={chatAreaRef}>
                {
                    Object.values(chatList).map((item: any) => (
                        <>
                            <div className="selected-text right">
                                <div className="text">{item.query}</div>
                                {/* <div className="controls">
                                    <button>{item.action}</button>
                                </div> */}
                            </div>
                            <div className="selected-text left">
                                <div className="text" dangerouslySetInnerHTML={{ __html: item.ans || "Loading..." }} />
                                {/* <div className="controls">
                                    <button>{item.action}</button>
                                </div> */}
                            </div>
                        </>
                    ))
                }
                {
                    !!selectionText?.length && (
                        <div className="selected-text right">
                            <div className="text">{selectionText}</div>
                            <div className="controls">
                                <button onClick={() => setMessage('get_info', selectionText)}>Explain</button>
                                {/* <button onClick={() => setMessage('translate', selectionText)}>Translate</button> */}
                                {/* <button onClick={() => setMessage(isWord ? 'vocab' : 'build_summary', selectionText)}>{isWord ? 'Vocab' : 'Comprehension'}</button> */}
                            </div>
                        </div>
                    )
                }
            </div>
            <div className="page-ques">
                {/* <div className="pre-ques">
                    <button onClick={() => setMessage('translate', "page")}>Translate Page</button>
                    <button onClick={() => setMessage('build_summary', "page")}>Summary of Page</button>
                </div> */}
                <form onSubmit={(event) => {
                    event.preventDefault();
                    setMessage('ask_question', ques)
                }}>
                    <input value={ques} onChange={(event) => setQues(event.target.value)} type="text" placeholder="You can ask question here ..." />
                </form>
            </div>
        </div>
    )
}