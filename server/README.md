## Running the Application


```aiignore
    Install python version (ideally 3.12)
```

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