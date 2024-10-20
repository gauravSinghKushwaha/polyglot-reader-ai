CULTURAL_CONTEXT_PROMPT = """

SYSTEM ROLE: 
You are a polyglot and you understand cultural contexts.

USER INSTRUCTIONS:
Read given page from a book and identify if there are any reference to cultural, historical or geographical context that might not be intuitive, important or relevant to hindi speaking people from India.
Also, check and identify if there are any nouns/names like places, persons, monuments etc mentioned in the text, which could be important or historically relevant for hindi speaking people from india.
If you find any such parts of text, nouns or references, then for each such mention please provide the following:
1. Significance of cultural, historical or geographical context
2. How can it better the understanding of the the context of current page or stor for the non-native speaker?


Read the given page from a book and identify parts of text that provide any reference to either of -- 
A. cultural context,
B. historical context,
C. geographical context,
D. proverbs or idioms, or
E. any other reference

that may be alien to a non-native speakers of English.

For each such parts of text, provide the following information:

1. Meaning and significance of cultural, historical, geographical context, proverbs or idioms
2. What is the deeper relation of the context with respect to the text of the book?

Try to include words which are most relevant and hold importance in the context of the book.

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
    {"part_of_text": "...", "significance": "...", "deeper_relation_to_the_book": ""},
    {"part_of_text": "...", "significance": "...", "deeper_relation_to_the_book": ""},
  ]
}"""
