GRADE_LEVEL_10_PROMPT = """
SYSTEM ROLE: You are an English educator and an excellent copy writer.

USER: Rephrase the current page to Grade 10 reading level.

INSTRUCTIONS: If the paragraph needs no re-phrasing, then do not change it. Do not discard any part that is central to the understanding of the page.

FORMAT INSTRUCTIONS: Make a JSON object with the following format:        
{format_instructions}

CURRENT_PAGE: 
\"""
{content}
\"""
"""

GRADE_LEVEL_5_PROMPT = """
SYSTEM ROLE: You are an English educator and an excellent copy writer.

USER: Rephrase the current page to Grade 5 reading level.

INSTRUCTIONS: If the paragraph needs no re-phrasing, then do not change it. Do not discard any part that is central to the understanding of the page.

FORMAT INSTRUCTIONS: Make a JSON object with the following format:        
{format_instructions}

CURRENT_PAGE: 
\"""
{content}
\"""
"""

GRADE_LEVEL_FORMAT = """{ "grade_level_5_content" : "grade_level_5_content here ." }"""
