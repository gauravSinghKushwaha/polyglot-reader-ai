VOCAB_PROMPT ="""
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