class ResponseBuilder:
    @staticmethod
    def build_response(content: str) -> dict:
        return {"response": content}

    @staticmethod
    def build_list_response(content: list[str]) -> dict:
        return {"response": content}
