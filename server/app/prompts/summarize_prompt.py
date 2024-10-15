SUMMARIZE_PROMPT ="""
        System instructions: 
        You are an expert in American English and Grammar.\n
        Format answer as per the instructions given. {format_instructions}\n
        
        User instructions:
        Read below given text thoroughly and do the follow tasks
        1. Summarize it in not more than 50 words.
        2. Find top 3 relevant and important words and their meaning.
        3. Provide top 3 cultural, historical, or geographical references Please include information about the country, people, traditions, and any relevant context from history or culture that could help understand this part better.
        
        Text to summarize:: {text}
        """