import React, { useState } from "react";

export const useEventStream = () => {
    const [response, setResponse] = useState("");

    const callApi = async (endpoint: string, body: any) => {
        try {
            const res = await fetch(`http://localhost:8000/${endpoint}`, {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body || {})
            });

            if (res.body) {
                const reader = res.body.getReader();
                const decoder = new TextDecoder('utf-8');

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) {
                        break; // No more data
                    }
                    const chunk = decoder.decode(value, { stream: true });
                    if(chunk.indexOf("Answer") > -1) {
                        setResponse(chunk.replace("data: Answer: ", ""));
                    }
                    console.log(chunk.replace("data: Answer: ", ""));
                }
            }
        } catch (e) {
            // return "AI could not respond to your request"
        }
    }

    return {
        response,
        callApi
    }
}