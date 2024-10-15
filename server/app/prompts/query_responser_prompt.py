QUERY_RESPONDER_PROMPT ="""
        System instructions:
        You are an expert on American English and Grammar.\n
        Format answer as per the instructions given. {format_instructions}
        
        User instructions:
        Read below text thoroughly.\n
        
        Text :: {text} \n
        
        Answer the query given below based on text given above. \n
        Please include information about the country, people, traditions, and any relevant context from history or culture that could help answer the question better.
        
        Question :: {query} \n
        
        """