TRANSLATE_PROMPT ="""
        You are an expert language translator.\n
        Format answer as per the instructions given. {format_instructions}
        
        You are given a text excerpt from a English language book. 
        The text is in a form of array of sentences.
        Read below given text thoroughly and translate it to {target_language} language. Try to make sure the translated text is at the same index in your response as the original text.\n
        Text :: {text} \n
        
        """