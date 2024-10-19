CULTURAL_CONTEXT_PROMPT = """

SYSTEM ROLE: 
You are a polyglot and you understand cultural contexts.

USER INSTRUCTIONS:

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
