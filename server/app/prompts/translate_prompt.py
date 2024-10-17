TRANSLATE_PROMPT ="""
        You are an expert language translator.\n
        Format answer as per the instructions given. {format_instructions}
        
        You are given a text excerpt from a English language book. 
        Read below given text thoroughly and translate it to {target_language} language. 
        
        Text :: {text} \n
        """