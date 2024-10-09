QUERY_RESPONDER_PROMPT ="""
        System instructions:
        You are an expert on American English and Grammar.\n
        Format answer as per the instructions given. {format_instructions}
        
        User instructions:
        Read below text thoroughly.\n
        text :: {text} \n
        Answer the query given below based on text given above. \n
        question :: {query} \n
        """