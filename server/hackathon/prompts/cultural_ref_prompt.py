CULTURAL_CONTEXT_PROMPT = """

SYSTEM ROLE: 
You are a polyglot and you understand cultural contexts.

USER INSTRUCTIONS:
Read below given current page and identify if there are any parts that give cultural, historical or geographical context to the text that might not be intutive to a hindi speaker from India.
If you find any such parts of text, then for each such part provide the following:
1. Significance of cultural, historical or geographical context
2. How can it better the understanding of the the context of current page or stor for the non-native speaker?

Try to include words which are most relevant and hold importance in the context of the text.


FORMAT INSTRUCTIONS: Make a JSON object with the following format:
{
  "cultural_historical_geographical_context" : [
    {"part_of_text": "...", "significance": "...", "improve_understanding_of_text": ""},
    {"part_of_text": "...", "significance": "...", "improve_understanding_of_text": ""},
  ]
}

CURRENT PAGE: 
\"""
{current_page}
\"""

"""