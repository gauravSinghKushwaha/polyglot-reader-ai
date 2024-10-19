CULTURAL_CONTEXT_PROMPT = """

SYSTEM ROLE: 
You are a polyglot and you understand cultural contexts.

USER INSTRUCTIONS:
Read given page from a book and identify if there are any reference to cultural, historical or geographical context that might not be intuitive, important or relevant to hindi speaking people from India.
Also, check and identify if there are any nouns/names like places, persons, monuments etc mentioned in the text, which could be important or historically relevant for hindi speaking people from india.
If you find any such parts of text, nouns or references, then for each such mention please provide the following:
1. Significance of cultural, historical or geographical context
2. How can it better the understanding of the the context of current page or stor for the non-native speaker?

Try to include words which are most relevant and hold importance in the context of the text.

FORMAT INSTRUCTIONS: Make a JSON object with the following format:
{format_instructions}

CURRENT PAGE: 
\"""
{content}
\"""

"""

CULTURAL_REF_FORMAT = """
{
  "cultural_historical_geographical_context" : [
    {"part_of_text": "...", "significance": "...", "improve_understanding_of_text": ""},
    {"part_of_text": "...", "significance": "...", "improve_understanding_of_text": ""},
  ]
}"""