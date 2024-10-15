import React, { useEffect, useState } from "react";
import './styles.scss';
import { usePolygotReader } from "../state";
import { SUPPORTED_LANGUAGES } from "../constants";
import { useEventStream } from "../useEventStream";


export const QuesAndAns: React.FC = () => {
    const [ques, setQues] = useState<string>('');
    const [selectionText, setSelectionText] = useState<string>('');
    const [chatList, setChatList] = useState<any>({});
    const [activeQues, setActiveQues] = useState<any>({});
    const { getTranslations, selectedLang, getSummary, askQuestion, togglePagePreview, showPagePreview, translationsToDispatch, pageContent } = usePolygotReader();
    const {response, callApi} = useEventStream();

    const handleSelectionChange = () => {
        const selection = window.getSelection();
        if (selection) {
            const selectedText = selection.toString();
            if (selectedText) {
                setSelectionText(selectedText);
            } else {
                setSelectionText('');
            }
        }
    };

    useEffect(() => {
        // Listen for the selectionchange event
        document.addEventListener('selectionchange', handleSelectionChange);

        // Cleanup the event listener on component unmount
        return () => {
            document.removeEventListener('selectionchange', handleSelectionChange);
        };
    }, []);

    useEffect(() => {
        if(activeQues.id) {
            const text = pageContent?.map((item: any) => item.str).join(" ");
            const query = activeQues.query == "page" ? text : activeQues.query
            const strings = (query || "").split(".");
            const response: string[] = [];
            strings.map((item: string, index: number) => {
                response[index] = translationsToDispatch[activeQues.lang][item]
            })
            chatList[activeQues.id] = {...chatList[activeQues.id], ans: response.join(".")};
            setChatList({...chatList});
        }
    }, [translationsToDispatch])

    useEffect(() => {
        if(activeQues.id) {
            chatList[activeQues.id] = {...chatList[activeQues.id], ans: response};
            setChatList({...chatList});
        }
    }, [response])

    const setMessage = async (action: string, query: string) => {
        const id = btoa(Date.now().toString());
        chatList[id] = {id, action, query, lang: selectedLang};
        setActiveQues(chatList[id]);
        setChatList({...chatList});
        setSelectionText('');
        setQues('');
        const text = pageContent?.map((item: any) => item.str).join(" ");

        switch(action) {
            case 'translate':
                await callApi("comprehend/ask_question_stream", {text: query == "page" ? text : query, query: `translate text to ${selectedLang}`});
                return;
            case 'build_summary':
                await callApi("comprehend/ask_question_stream", {text: query == "page" ? text : query, query: `summarize text`});
                return;
            case 'ask_question':
                await callApi("comprehend/ask_question_stream", {query, text});
                return;
        }
    }

    return (
        <div className="ques-and-ans">
            <div className="chat-area">
                {
                    Object.values(chatList).map((item: any) => (
                        <>
                            <div className="selected-text">
                                <div className="text"><span>{item.action}{item.action === "translate" ? ` (${item.lang})` : ''}:-</span>{item.query} {(item.action === "translate") && (item.query === "page") && (item.lang !== SUPPORTED_LANGUAGES[0]) && (item.ans?.length > 0) && <a onClick={() => togglePagePreview(!showPagePreview)}>{showPagePreview ? 'Close' : 'Open'} Preview</a>}</div>
                                {/* <div className="controls">
                                    <button>{item.action}</button>
                                </div> */}
                            </div>
                            <div className="selected-text left">
                                <div className="text" dangerouslySetInnerHTML={{__html: item.ans || "Loading..."}} />
                                {/* <div className="controls">
                                    <button>{item.action}</button>
                                </div> */}
                            </div>
                        </>
                    ))
                }
                {
                    selectionText.length > 0 && (
                        <div className="selected-text">
                            <div className="text">{selectionText}</div>
                            <div className="controls">
                                <button onClick={() => setMessage('translate', selectionText)}>Translate</button>
                                <button onClick={() => setMessage('build_summary', selectionText)}>Comprehension</button>
                            </div>
                        </div>
                    )
                }
            </div>
            <div className="page-ques">
                <div className="pre-ques">
                    <button onClick={() => setMessage('translate', "page")}>Translate Page</button>
                    <button onClick={() => setMessage('build_summary', "page")}>Summary of Page</button>
                </div>
                <form onSubmit={(event) => {
                    event.preventDefault();
                    setMessage('ask_question', ques)
                }}>
                    <input value={ques} onChange={(event) => setQues(event.target.value)} type="text" placeholder="You can ask question here ..."/>
                </form>
            </div>
        </div>
    )
}