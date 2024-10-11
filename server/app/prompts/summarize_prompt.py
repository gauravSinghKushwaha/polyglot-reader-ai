SUMMARIZE_PROMPT ="""
        System instructions: 
        You are an expert in American English and Grammar.\n
        Format answer as per the instructions given. {format_instructions}\n
        
        User instructions:
        Read below given text thoroughly and do the follow tasks
        1. Summarize it in not more than 50 words.
        2. Find top 3 relevant and important words and their meaning.
        3. Any special cultural, historical or language specific inferences, that will help the reader give more context of the text as a first time reader. 
        
        Text to summarize:: {text}
        """