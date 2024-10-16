TRANSLATE_PROMPT ="""
        You are an expert language translator.\n
        Format answer as per the instructions given. {format_instructions}
        
        You are given a text excerpt from a English language book. 
        Read below given text thoroughly and translate it to {target_language} language. 
        Note: Ensure the translation is in {target_language} script and not written in English letters.\n
        If target language is Hindi, use Devanagari script.
        
        Text :: {text} \n
        """