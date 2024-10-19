import os
import json
import re
from typing import List, Dict
from langchain.prompts import PromptTemplate
import requests
import json
from utils.file_reader import read_json_file

from utils.ai_helper import invoke_simple_chain
from utils.file_writer import write_json_file
from tqdm import tqdm
from prompts.summarize_prompt import (
    SUMMARIZE_FIRST_PAGE_PROMPT,
    SUMMARIZE_OTHER_PAGE_PROMPT,
)


def get_absolute_path(relative_path):
    return os.path.abspath(relative_path)


def extract_chapters_and_paragraphs(file_path):
    with open(file_path, "r", encoding="utf-8") as file:
        content = file.read()

    # Pattern to match chapter titles (assuming they start with "CHAPTER" and a number)
    chapter_pattern = r"CHAPTER\s+\d+.*"
    chapters = re.split(chapter_pattern, content)
    chapter_titles = re.findall(chapter_pattern, content)

    # Collect paragraphs and map them to their corresponding chapters
    result = {"paragraphs": []}
    paragraph_index = 0

    for i, chapter_text in enumerate(chapters):
        if (
            chapter_text.strip()
        ):  # To handle cases where the split produces empty content
            chapter_title = (
                chapter_titles[i] if i < len(chapter_titles) else "Unknown Chapter"
            )

            # Split the chapter content into paragraphs (each separated by two or more newlines)
            paragraphs = re.split(r"\n\s*\n", chapter_text.strip())

            for paragraph in paragraphs:
                if paragraph.strip():  # Ignore empty paragraphs
                    paragraph_data = {
                        "content": paragraph.strip(),
                        "num_words": len(paragraph.split()),
                        "chapter": chapter_title.strip(),
                    }
                    result["paragraphs"].append({paragraph_index: paragraph_data})
                    paragraph_index += 1

        json.dumps(result, indent=4)
    return result


def paginate_book(book_json, word_limit=1200, next_paragraph_padding=80):
    pages = {}
    current_page = {"content": "", "paragraphs": {}, "num_words": 0, "chapter": None}
    current_character_count = 0
    page_count = 0  # To keep track of page number

    # Iterate over the paragraphs in the book_json
    for paragraph in book_json["paragraphs"]:
        for key, details in paragraph.items():
            paragraph_content = details["content"].strip()
            num_words = details["num_words"]
            num_characters = (
                len(paragraph_content)
                if paragraph_content and len(paragraph_content) >= 0
                else 0
            )
            chapter = details["chapter"].strip()

            # Check if we need to start a new page
            if (
                current_character_count + num_characters + next_paragraph_padding
                > word_limit
                or current_page["chapter"] is None
                or current_page["chapter"] != chapter
            ):
                # Save the current page to pages dictionary if it has content
                if current_character_count > 0:
                    current_page["num_chars"] = (
                        current_character_count  # Update num_words here
                    )
                    pages[str(page_count)] = current_page

                # Start a new page
                current_page = {
                    "content": "",
                    "paragraphs": {},
                    "num_chars": 0,
                    "chapter": chapter,
                }
                current_character_count = 0
                page_count += 1

            # Append the paragraph content and update counts
            current_page["content"] += paragraph_content + "\n"
            current_page["paragraphs"][key] = {
                "content": paragraph_content,
                "num_words": num_words,
            }
            current_character_count += num_characters

    # Add the last page if it has content
    if current_character_count > 0:
        current_page["num_chars"] = current_character_count
        pages[str(page_count)] = current_page

    return pages


def translate_page_wise(pages):
    print("Translating chapter wise")
    translated_pages = []
    for page in pages:
        output = translate_text_with_sarvam("English", "Hindi", page)
        # output = translate_text_with_llama("English", "Spanish", page)
        translated_pages.append(output)
    return translated_pages


def translate_text_with_sarvam(
    source_language, target_language, text, speaker_gender="Male", mode="formal"
):
    url = "https://api.sarvam.ai/translate"
    headers = {
        "Content-Type": "application/json",
        "api-subscription-key": "30908b39-df16-4c6a-a64c-7819055ab33c",
    }

    payload = {
        "source_language_code": source_language,
        "target_language_code": target_language,
        "mode": mode,
        "model": "mayura:v1",
        "enable_preprocessing": True,
        "input": text,
        "speaker_gender": speaker_gender,
    }

    response = requests.post(url, headers=headers, data=json.dumps(payload))

    if response.status_code == 200:
        translated_data = response.json()
        return translated_data.get("output", "Translation failed, no output.")
    else:
        return f"Error: {response.status_code}, {response.text}"


def translate_text_with_llama(source_language, target_language, text):
    prompt = PromptTemplate(
        input_variables=["content"],
        template="""

        """,
    )
    result = invoke_simple_chain(prompt, input_data={"content": text})
    return result


def pre_process():
    input_folder = get_absolute_path("server/hackathon/books")
    output_folder = get_absolute_path("server/hackathon/output")

    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    files = tqdm(os.listdir(input_folder))
    for filename in files:

        # Extract chapters and paragraphs
        book_structure = extract_chapters_and_paragraphs(input_folder + "/" + filename)
        pages = paginate_book(book_structure)
        write_json_file(output_folder + "/" + filename.replace("txt", "json"), pages)

        # translate_page_wise(pages)
        # summarize_page_wise(pages)


def summarize_by_page():
    # def summarize_by_page(source_language, target_language, text):

    output_folder = get_absolute_path("server/hackathon/output")

    files = tqdm(os.listdir(output_folder))
    for filename in files:

        file_path = file_path = output_folder + "/" + filename
        book = read_json_file(file_path)
        previous_summary = ""

        tqdm_book = tqdm(book)
        for page_no in tqdm_book:
            tqdm_book.set_description("pageNo :" + page_no)
            page = book[page_no]
            page_content = page["content"]
            input_data = {"content": page_content}
            if page_no == "1":
                template = SUMMARIZE_FIRST_PAGE_PROMPT
                prompt = PromptTemplate(
                    input_variables=["content"],
                    template=template,
                )

            else:
                template = SUMMARIZE_OTHER_PAGE_PROMPT.replace(
                    "{previous_summary}", previous_summary
                )
                prompt = PromptTemplate(
                    input_variables=["content", previous_summary],
                    template=template,
                )
                input_data["previous_summary"] = previous_summary

            try:
                result = invoke_simple_chain(prompt, input_data=input_data)
                previous_summary = (
                    result.strip().replace("\n", "").replace("{", "").replace("}", "")
                )
                book[page_no]["summary"] = previous_summary
            except Exception as ex:
                print("error " + str(ex))

        write_json_file(file_path, book)


# summarize_by_page()
# pre_process()
