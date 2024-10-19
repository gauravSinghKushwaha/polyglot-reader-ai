import os
import json
from typing import List, Dict
from langchain.prompts import PromptTemplate

from hackathon.utils.ai_helper import invoke_simple_chain

def read_book(file_path: str) -> str:
    with open(file_path, 'r', encoding='utf-8') as file:
        return file.read()


def extract_main_content(content: str) -> Dict:
    prompt = PromptTemplate(
        input_variables=["content"],
        template="""
        Given the following book content, please extract the following information:
        1. Book name
        2. Author
        3. Total number of pages
        4. Start page of the main content (excluding preface, table of contents, etc.)
        5. End page of the main content (excluding appendices, index, etc.)
        6. The main content of the book (excluding front matter and back matter)

        Book content:
        {content}

        Provide the information in the following JSON format:
        {{
            "name": "Book name",
            "author": "Author name",
            "num_pages": total number of pages,
            "book_start_page": start page number,
            "book_end_page": end page number,
            "main_content": "The extracted main content of the book"
        }}
        """
    )

    result = invoke_simple_chain(prompt=prompt, input_data={ "content": content})

    # Parse the JSON result
    try:
        info = json.loads(result)
    except json.JSONDecodeError:
        print("Error parsing LLM output. Using default values.")
        info = {
            "name": "",
            "author": "",
            "num_pages": len(content.split('\n')) // 30,  # Assume 30 lines per page
            "book_start_page": 1,
            "book_end_page": len(content.split('\n')) // 30,
            "main_content": content
        }

    return info


def process_paragraphs(content: str) -> List[Dict]:
    paragraphs = content.split('\n\n')
    processed_paragraphs = []

    for idx, para in enumerate(paragraphs):
        processed_paragraphs.append({
            "content": para,
            "num_characters": len(para)
        })

    return processed_paragraphs


def identify_chapters(paragraphs: List[Dict]) -> List[Dict]:
    chapter_prompt = PromptTemplate(
        input_variables=["paragraph"],
        template="""
        Given the following paragraph, determine if it's the start of a new chapter.
        If it is, provide the chapter number. If not, respond with "Not a chapter start".

        Paragraph:
        {paragraph}

        Respond in the following format:
        Chapter: [Chapter number or "Not a chapter start"]
        """
    )

    current_chapter = None
    for para in paragraphs:
        result = invoke_simple_chain(prompt=chapter_prompt, input_data={"paragraph": para['content']})
        chapter_info = result.split(':')[1].strip()

        if chapter_info != "Not a chapter start":
            try:
                current_chapter = int(chapter_info)
            except ValueError:
                current_chapter = None

        para['chapter'] = [current_chapter] if current_chapter is not None else []

    return paragraphs


def process_book(file_path: str) -> Dict:
    content = read_book(file_path)
    book_info = extract_main_content(content)

    paragraphs = process_paragraphs(book_info['main_content'])
    paragraphs_with_chapters = identify_chapters(paragraphs)

    return {
        "isbn": "",  # You might want to add ISBN extraction logic
        "name": book_info['name'],
        "author": book_info['author'],
        "num_pages": book_info['num_pages'],
        "book_start_page": book_info['book_start_page'],
        "book_end_page": book_info['book_end_page'],
        "content": book_info['main_content'],
        "paragraphs": {str(i): para for i, para in enumerate(paragraphs_with_chapters)}
    }


def main():
    input_folder = "/Users/sarthakbaweja/projects/polyglot-reader-ai/server/hackathon/books"
    output_folder = "/Users/sarthakbaweja/projects/polyglot-reader-ai/server/hackathon/output"

    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    for filename in os.listdir(input_folder):
        if filename.endswith(".txt"):
            file_path = os.path.join(input_folder, filename)
            book_data = process_book(file_path)

            output_file = os.path.join(output_folder, f"{filename[:-4]}.json")
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(book_data, f, ensure_ascii=False, indent=2)

            print(f"Processed {filename} and saved to {output_file}")


if __name__ == "__main__":
    main()