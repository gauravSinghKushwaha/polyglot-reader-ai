SUMMARIZE_PROMPT = """
        System instructions: 
        You are an expert in American English and Grammar.\n
        Format answer as per the instructions given. {format_instructions}\n
        
        User instructions:
        Read below given text thoroughly and do the follow tasks
        1. Summarize it in not more than 150 words.
        2. Provide top 3 cultural, historical, or geographical references present in the text and why they are important in the context of the text.
           Also explain those cultural references like you would to a fresh or non-native reader.
           Please include any additional information about the country, people, traditions, and any relevant context from history or culture that could 
           help understand the text better.
                   
        Text to summarize:: {text}
        """

# Use only < p >, < h1 >, < ul >, < li >, < a > tags while formatting using HTML tags appropriately.

############ V2 prompts ############

SUMMARIZE_FIRST_PAGE_PROMPT = """
        SYSTEM ROLE: You are an English educator and an excellent copy writer.

        USER: Summarize the first page of the book.

        INSTRUCTIONS: Summarize the first page of the book in less than 100 words. Do not miss the key details, events and characters.

        FORMAT INSTRUCTIONS: Make a JSON object with the following format:        
        {format_instructions}

        FIRST PAGE 1:\"""
        {content}
        \""" 

        """

SUMMARIZE_OTHER_PAGE_PROMPT = """
        SYSTEM ROLE: You are an English educator and an excellent copy writer.

        USER: Use the summary of the previous pages as context and summarize the current page to include the summary of the previous pages.

        INSTRUCTIONS: Summarize the current page in less than 300 words. Take consideration of the summary of previous pages while generating one consolidated summary.

        SUMMARY OF PREVIOUS PAGES: \"""
        {previous_summary}
        \""" 
        
        FORMAT INSTRUCTIONS: Make a JSON object with the following format:
        {format_instructions}

        CURRENT PAGE: \"""
        {content}
        \""" 

        """


SUMMARIZE_FIRST_PAGE_PROMPT_GRADE_10 = """
        SYSTEM ROLE: You are an English educator and an excellent copy writer.

        USER: Summarize the first page of the book to Grade level 10.

        INSTRUCTIONS: Summarize the first page of the book in no more than 300 words.

        FORMAT INSTRUCTIONS: Make a JSON object with the following format:
        {format_instructions}

        FIRST PAGE 1:\"""
        {first_page}
        \""" 

        """

SUMMARIZE_OTHER_PAGE_PROMPT_GRADE_10 = """
        SYSTEM ROLE: You are an English educator and an excellent copy writer.

        USER: Use the summary of the previous pages as context and summarize the subsequent to Grade level 10.

        INSTRUCTIONS: Use the summary of the previous pages as context and summarize the current page to include the summary of the previous pages.

        SUMMARY OF PREVIOUS PAGES: \"""
        {previous_page_summary}
        \""" 
        
        FORMAT INSTRUCTIONS: Make a JSON object with the following format:
        {format_instructions}

        CURRENT PAGE: \"""
        {current_page}
        \""" 

        """

SUMMARY_FORMAT = """{ "page_summary_so_far" :"..."
          "current_page_summary": "..."
        }"""
