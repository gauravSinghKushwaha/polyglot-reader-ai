VOCAB_PROMPT = """
        System instructions: 
        You are an expert in American English and Grammar.\n
        Format answer as per the instructions given. {format_instructions}\n
        
        User instructions:
        Read below given text thoroughly and provide at most top {num_words} words with
        1. meaning
        2. synonym
        3. common usage in a sentence
        
        Try to include words which are most relevant and hold importance in the context of the text.
        
        if number of words in the below text are less than 6, then return required information for just those words. 
        
        Text to summarize:: {text}
        """

# Use only < p >, < h1 >, < ul >, < li >, < a > tags while formatting using HTML tags appropriately.

####### V2 ###### prompts

VOCAB_PROMPT_V2 = """
        SYSTEM ROLE: 
        You are an expert in American English and Grammar.\n
        
        USER INSTRUCTIONS:
        Read below given text and identify if there are any low frequency or novel words, which are not commonly used in American English.
        If you find any such words, then for each word, provide the following information:
        1. meaning
        2. synonym
        3. common usage in a sentence
        4. meaning in this context

        Try to include words which are most relevant and hold importance in the context of the text.


        FORMAT INSTRUCTIONS: Make a JSON object with the following format:
        
        {format_instructions}

        CURRENT PAGE: 
        \"""
        {content}
        \"""
        """

VOCAB_FORMAT = """{
        "novel_words" : [
                {"word": "...", "meaning": "...", "synonym": "...", "usage": "...", "meaning_in_context":"..."  },
                {"word": "...", "meaning": "...", "synonym": "...", "usage": "...", "meaning_in_context":"..."  }
                ]
        }"""
