import os
import os.path
import re
from time import sleep
from retry import retry
from langchain.prompts import PromptTemplate
import requests
import json

from hackathon.services.vector_store import add_pages_to_vector_store, query_db
from prompts.cultural_ref_prompt import CULTURAL_CONTEXT_PROMPT, CULTURAL_REF_FORMAT

from utils.file_reader import read_json_file

from utils.ai_helper import invoke_simple_chain
from utils.file_writer import write_json_file
from tqdm import tqdm
from prompts.summarize_prompt import (
    SUMMARIZE_FIRST_PAGE_PROMPT,
    SUMMARIZE_OTHER_PAGE_PROMPT,
    SUMMARY_FORMAT,
)
from prompts.vocab_prompt import VOCAB_PROMPT_V2, VOCAB_FORMAT
from prompts.grade_appropriate import GRADE_LEVEL_5_PROMPT, GRADE_LEVEL_FORMAT

FIRST_N_PAGES = 50


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


def translate_page_wise(page_no, book):
    page = book[page_no]
    paragraphs = page["paragraphs"]
    tqdm_para = tqdm(paragraphs)
    for paragraph_number in tqdm_para:
        tqdm_para.set_description(
            "page>>" + page_no + " paragraph_number >>" + paragraph_number
        )
        try:
            if "content_hindi" not in page["paragraphs"][paragraph_number]:
                paragraph = paragraphs[paragraph_number]
                output = translate_text_with_sarvam(
                    "en-IN", "hi-IN", paragraph["content"]
                )
                # output = translate_text_with_llama("English", "Spanish", paragraph['content'])
                page["paragraphs"][paragraph_number]["content_hindi"] = output
        except Exception as ex:
            print(ex)

    return book


@retry(
    exceptions=(Exception),
    delay=1,
    backoff=2,
    max_delay=4,
    tries=1,
)
def translate_word(page):
    if (
        not "vocab" in page
        or not page["vocab"]["novel_words"]
        or len(page["vocab"]["novel_words"]) <= 0
    ):
        return

    words = page["vocab"]["novel_words"]
    tqdm_words = tqdm(words)
    for elem in tqdm_words:
        tqdm_elem = tqdm(elem)
        hindi_dict = {}
        for key in tqdm_elem:
            key_hindi = key + "_hindi" if "_hindi" not in key else key
            if key_hindi in elem:
                continue
            value = elem[key]
            if len(value) > 0:
                tqdm_elem.set_description("key >>" + key + " value >> " + value)
                try:
                    output = translate_text_with_sarvam("en-IN", "hi-IN", value)
                    hindi_dict[key_hindi] = remove_unwanted_characters_from_str(output)
                except Exception as ex:
                    print(ex)

        if len(hindi_dict) > 0:
            for k in hindi_dict:
                elem[k] = hindi_dict[k]


@retry(
    exceptions=(Exception),
    delay=1,
    backoff=2,
    max_delay=4,
    tries=1,
)
def translate_summary(page):

    if not "summary" in page:
        return

    summaries = page["summary"]
    tqdm_summaries = tqdm(summaries)

    hindi_dict = {}
    for summary in tqdm_summaries:
        key_hindi = summary + "_hindi" if "_hindi" not in summary else summary

        if key_hindi in summary:
            continue
        try:
            output = translate_text_with_sarvam(
                "en-IN",
                "hi-IN",
                remove_unwanted_characters_from_str(summaries[summary]),
            )
            hindi_dict[key_hindi] = remove_unwanted_characters_from_str(output)
        except Exception as ex:
            print(ex)

    if len(hindi_dict) > 0:
        for k in hindi_dict:
            summaries[k] = hindi_dict[k]


@retry(
    exceptions=(Exception),
    delay=1,
    backoff=2,
    max_delay=4,
    tries=1,
)
def translate_cultural_ref(page):

    if not "cultural_ref" in page:
        return

    cultural_refs = page["cultural_ref"]
    if len(cultural_refs) <= 0:
        return

    tqdm_cultural_refs = tqdm(cultural_refs)

    for cultural_ref in tqdm_cultural_refs:
        hindi_dict = {}
        for k in cultural_ref:
            key_hindi = k + "_hindi" if "_hindi" not in k else k
            if key_hindi in cultural_ref:
                continue
            try:
                output = translate_text_with_sarvam( 
                    "en-IN",
                    "hi-IN",
                    remove_unwanted_characters_from_str(cultural_ref[k]),
                )
                hindi_dict[key_hindi] = remove_unwanted_characters_from_str(output)
            except Exception as ex:
                print(ex)

        if len(hindi_dict) > 0:
            for k in hindi_dict:
                cultural_ref[k] = hindi_dict[k]


@retry(
    exceptions=(Exception),
    delay=1,
    backoff=2,
    max_delay=4,
    tries=1,
)
def translate_text_with_sarvam(
    source_language, target_language, text, speaker_gender="Male", mode="formal"
):
    url = "https://api.sarvam.ai/translate"
    headers = {
        "Content-Type": "application/json",
        "api-subscription-key": "cf0b850b-1357-4dfa-a604-704e427d62f7",
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

    if response.status_code == 429:
        print("429 error received, waiting for 1 minute")
        sleep(60)
        response = requests.post(url, headers=headers, data=json.dumps(payload))

    if response.status_code == 200:
        translated_data = response.json()
        return translated_data.get("translated_text", "Translation failed, no output.")
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

    files = os.listdir(input_folder)
    for filename in files:
        extract_pages_paragraphs_from_txt_file(input_folder, output_folder, filename)

    files = tqdm(os.listdir(output_folder))
    for filename in files:
        output = output_folder + "/" + filename
        book = read_json_file(output)

        previous_summary = ""
        tqdm_book = tqdm(book)
        for page_no in tqdm_book:
            """TODO for POC only processing max 50 pages of book"""
            if int(page_no) > FIRST_N_PAGES:
                continue
            tqdm_book.set_description("pageNo :" + page_no)
            page = book[page_no]
            cleanse_text_of_unwanted_characters(page=page)

            if "summary" not in page:
                summaries = summarize_by_page(
                    page_no=page_no, previous_summary=previous_summary, page=page
                )
                if summaries and "previous_summary" in summaries:
                    previous_summary = summaries["previous_summary"]

            if "vocab" not in page:
                fetch_vocab_by_page(page=page)

            if "cultural_ref" not in page:
                fetch_culture_ref_by_page(page_no=page_no, book=book)


            if "grade5" not in page: 
                convert_to_chosen_grade(page=page, grade=None)

            translate_page_wise(page_no=page_no, book=book)

            translate_word(page=page)

            translate_summary(page=page)

            translate_cultural_ref(page=page)

            if int(page_no) % 5 == 0:
                write_json_file(output, book)

        write_json_file(output, book)


def extract_pages_paragraphs_from_txt_file(input_folder, output_folder, filename):
    output = output_folder + "/" + filename.replace("txt", "json")
    if not os.path.isfile(output):
        book_structure = extract_chapters_and_paragraphs(input_folder + "/" + filename)
        pages = paginate_book(book_structure)
        write_json_file(output, pages)


def summarize_by_page(page_no, previous_summary, page):
    page_content = page["content"]
    input_data = {"content": page_content}
    if page_no == "1":
        template = SUMMARIZE_FIRST_PAGE_PROMPT
        prompt = PromptTemplate(
            input_variables=["content"],
            template=template,
            partial_variables={"format_instructions": SUMMARY_FORMAT},
        )

    else:
        template = SUMMARIZE_OTHER_PAGE_PROMPT.replace(
            "{previous_summary}", previous_summary
        )
        prompt = PromptTemplate(
            input_variables=["content", previous_summary],
            template=template,
            partial_variables={"format_instructions": SUMMARY_FORMAT},
        )
        input_data["previous_summary"] = previous_summary

    try:
        result = invoke_simple_chain(prompt, input_data=input_data)
        json_object = json.loads(result)

        if page_no == "1":
            previous_summary = json_object["current_page_summary"]
        else:
            previous_summary = json_object["page_summary_so_far"]

        page["summary"] = json_object

        return {"summary": page["summary"], "previous_summary": previous_summary}
    except Exception as ex:
        print(ex)


def fetch_culture_ref_by_page(page_no, book):

    page = book[page_no]
    page_content = page["content"]
    input_data = {"content": page_content}
    try:
        prompt = PromptTemplate(
            input_variables=["content"],
            template=CULTURAL_CONTEXT_PROMPT,
            partial_variables={"format_instructions": CULTURAL_REF_FORMAT},
        )
        result = invoke_simple_chain(prompt, input_data=input_data)
        json_object = json.loads(result)
        book[page_no]["cultural_ref"] = json_object[
            "cultural_historical_geographical_context"
        ]
    except Exception as ex:
        print(ex)


def fetch_vocab_by_page(page):

    page_content = page["content"]
    input_data = {"content": page_content}
    try:

        prompt = PromptTemplate(
            input_variables=["content"],
            template=VOCAB_PROMPT_V2,
            partial_variables={"format_instructions": VOCAB_FORMAT},
        )

        result = invoke_simple_chain(prompt, input_data=input_data)
        json_object = json.loads(result)
        page["vocab"] = json_object
    except Exception as ex:
        print(ex)


def convert_to_chosen_grade(page, grade):

    page_content = page["content"]
    input_data = {"content": page_content}
    try:

        prompt = PromptTemplate(
            input_variables=["content"],
            template=GRADE_LEVEL_5_PROMPT,
            partial_variables={"format_instructions": GRADE_LEVEL_FORMAT},
        )

        result = invoke_simple_chain(prompt, input_data=input_data)
        json_object = json.loads(result)
        page["grade5"] = (
            json_object["grade_level_5_content"]
            if "grade_level_5_content" in json_object
            else ""
        )
    except Exception as ex:
        print(ex)


def cleanse_text_of_unwanted_characters(page):
    page["content"] = remove_unwanted_characters_from_str(page["content"])

    for para in page["paragraphs"]:
        if para in page["paragraphs"]:
            page["paragraphs"][para]["content"] = remove_unwanted_characters_from_str(
                page["paragraphs"][para]["content"]
            )


def remove_unwanted_characters_from_str(str):
    return (
        str.replace("\u2019", "'")
        .replace("\u2018", "'")
        .replace("\u2013", "-")
        .replace("\u00a9", "©")
        .replace("\u201c", "“")
        .replace("\u201d", "”")
    )

# one time script to populate vector db
def populate_vector_store():
    output_folder = get_absolute_path("hackathon/output")
    files = os.listdir(output_folder)
    for filename in files:
        output = output_folder + "/" + filename
        book = read_json_file(output)
        add_pages_to_vector_store(book_id=filename.replace(".json", ""), pages=book)