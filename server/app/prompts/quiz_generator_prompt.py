QUIZ_GENERATOR_PROMPT ="""
        System instructions: 
        You are an expert in American English and Grammar.\n
        Format answer as per the instructions given. {format_instructions}\n
        
        User instructions:
        Read below context thoroughly and generate a quiz (at most 5 questions)..\n
        text :: {text}
        """