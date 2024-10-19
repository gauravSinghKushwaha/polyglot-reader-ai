## Running the Application

```aiignore
cd in to the python project root (Example: /Users/sarthakbaweja/projects/polyglot-reader-ai/server)
```

Install Dependencies

```
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Start the FastAPI Server

```
uvicorn hackathon.app:app --reload
```
Access the API Documentation

```aiignore
Open your browser and navigate to http://127.0.0.1:8000/docs to interact with the API using the automatically generated Swagger UI.
```


## Example Usage

1. Vocabulary Assistance
Endpoint: /vocab
Method: POST
Payload:

```aiignore
{
    "text": "The quick brown fox jumps over the lazy dog."
}
```

Request:

```aiignore
curl -X POST "http://127.0.0.1:8000/vocab" -H "Content-Type: application/json" -d '{"text": "The quick brown fox jumps over the lazy dog."}'
```

Response:

```aiignore
{
    "response": "LLM response for prompt: Provide vocabulary assistance for the following text: The quick brown fox jumps over the lazy dog."
}
```

2. Translation
Endpoint: /translate
Method: POST
Payload:

```aiignore
{
    "text": "Hello, world!",
    "target_language": "Spanish"
}
```

Request:

```aiignore
curl -X POST "http://127.0.0.1:8000/translate" -H "Content-Type: application/json" -d '{"text": "Hello, world!", "target_language": "Spanish"}'
Response:
```


```aiignore
{
    "response": "LLM response for prompt: Translate the following text to Spanish: Hello, world!"
}
```

