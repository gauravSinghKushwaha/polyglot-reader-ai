import React, { useState } from "react";
import { IBook, usePolygotReader } from "../state";
import { Card, Button, ListGroup, Collapse, Alert, Dropdown, DropdownButton, Spinner } from 'react-bootstrap';
import { SUPPORTED_LANGUAGES } from "../constants";

export const RightSection = ({ onBack, book }: { onBack: Function, book: IBook }) => {
    const { selectedLang, setSelectedLang, toggleChat } = usePolygotReader();
    const pageSummary: any = null;
    const [openSummary, setOpenSummary] = useState(true);
    const [openInferences, setOpenInferences] = useState(true);
    const [openTopWords, setOpenTopWords] = useState(true);

    if (!pageSummary) {
        return null;
    }

    return (
        <div className="right-section">
            <div className="header">
                <div></div>
                <Button size="sm" variant="outline-secondary" onClick={() => onBack()} className="back-button">Go back to Library</Button>
            </div>

            <div className="body">
                {/* Translation Service Banner */}
                <Alert variant="info" className="d-flex justify-content-between align-items-center">
                    <span>If you want to use the translation service, please choose your language:</span>
                    <DropdownButton
                        id="dropdown-basic-button"
                        title={selectedLang}
                        onSelect={(lang) => setSelectedLang(lang || 'English')}
                    >
                        {SUPPORTED_LANGUAGES.map((lang) => (
                            <Dropdown.Item key={lang} eventKey={lang}>{lang}</Dropdown.Item>
                        ))}
                    </DropdownButton>
                </Alert>

                <Card className="mb-4 shadow-sm">
                    <Card.Body>
                        <Card.Title className="book-title">{book.title}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">by {book.author}</Card.Subtitle>
                    </Card.Body>
                </Card>

                {/* Fallback for loading state */}
                {pageSummary.isLoading ? (
                    <div className="loading-state">
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </div>
                ) : (
                    <div dangerouslySetInnerHTML={{__html: pageSummary || "Loading ..."}}/>
                )}
            </div>
            <Button variant="success" onClick={() => toggleChat(true)}>Ask more question to polygot assistance</Button>
        </div>
    );
};


{/* <>
    <Card className="mb-4 shadow-sm">
        <Card.Header
            onClick={() => setOpenSummary(!openSummary)}
            aria-controls="summary-collapse-text"
            aria-expanded={openSummary}
            style={{ cursor: 'pointer' }}
            className="d-flex justify-content-between align-items-center"
        >
            <h5>Summary</h5>
            {openSummary ? "▲" : "▼"}
        </Card.Header>
        <Collapse in={openSummary}>
            <Card.Body>
                <Card.Text>{pageSummary?.summary}</Card.Text>
            </Card.Body>
        </Collapse>
    </Card>
    <Card className="mb-4 shadow-sm">
        <Card.Header
            onClick={() => setOpenInferences(!openInferences)}
            aria-controls="inferences-collapse-text"
            aria-expanded={openInferences}
            style={{ cursor: 'pointer' }}
            className="d-flex justify-content-between align-items-center"
        >
            <h5>Cultural Inferences</h5>
            {openInferences ? "▲" : "▼"}
        </Card.Header>
        <Collapse in={openInferences}>
            <ListGroup variant="flush">
                {pageSummary?.cultural_inferences?.map((item: string, index: number) => (
                    <ListGroup.Item key={index}>{item}</ListGroup.Item>
                ))}
            </ListGroup>
        </Collapse>
    </Card>
    <Card className="mb-4 shadow-sm">
        <Card.Header
            onClick={() => setOpenTopWords(!openTopWords)}
            aria-controls="topwords-collapse-text"
            aria-expanded={openTopWords}
            style={{ cursor: 'pointer' }}
            className="d-flex justify-content-between align-items-center"
        >
            <h5>Top Words</h5>
            {openTopWords ? "▲" : "▼"}
        </Card.Header>
        <Collapse in={openTopWords}>
            <ListGroup variant="flush">
                {pageSummary?.top_words?.map((item: any, index: number) => (
                    <ListGroup.Item key={index}>
                        <strong>{item.word}</strong>: {item.meaning}
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </Collapse>
    </Card>
</> */}