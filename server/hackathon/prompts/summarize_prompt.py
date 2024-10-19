SUMMARIZE_PROMPT ="""
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