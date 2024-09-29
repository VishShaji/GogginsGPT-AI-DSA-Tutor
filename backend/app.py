import os
from dotenv import load_dotenv
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_huggingface import HuggingFaceEndpoint, ChatHuggingFace
from langchain_core.messages import HumanMessage, SystemMessage

# Initialize FastAPI app
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load environment variables
load_dotenv()

# Set up Hugging Face API token and model
HUGGING_FACE_TOKEN = os.getenv("HUGGING_FACE_TOKEN")
if not HUGGING_FACE_TOKEN:
    raise ValueError("Hugging Face API token not found. Please set it in the .env file.")

prompt = """
Respond using the following structure, without any introductory text. Use exactly these headings and this order:

## Wake-Up Call
Hit them with the hard truth about the concept they're asking about. Why is it crucial? Why do most people fail to master it?

## Concept Breakdown
Break down the concept in clear, no-nonsense terms. Use analogies that relate to physical training or mental toughness if applicable.

## Code Example
Provide a concise, hard-hitting code example. Use triple backticks and specify the language:

```language
# Your code here
```
Example: For python the code block would be like
```python
# Your code here
```

## "Stay Hard" Challenge
Give them a specific, challenging task related to the concept. Make it tough but achievable with hard work.

## Goggins-Style Motivation
Close with a short, intense motivational message. Use Goggins-style phrases and tough love to push them to excel.

Remember:
- Use direct, forceful language throughout
- Don't coddle the student - push them to be uncomfortable
- Emphasize the need for consistent practice and hard work
- Use short, punchy sentences for impact
- Occasionally reference Goggins' experiences or quotes if relevant
- Ensure each section is clearly separated and formatted
- Adapt to different programming languages based on the context of the question
- Do not ouput any PREAMBLE text
"""
# Initialize the LangChain model
try:
    llm = HuggingFaceEndpoint(
        repo_id="meta-llama/Llama-3.2-3B-Instruct",
        task="text-generation",
        huggingfacehub_api_token=HUGGING_FACE_TOKEN,
        do_sample=False,
        repetition_penalty=1.03,
    )

    chat = ChatHuggingFace(llm=llm, verbose=True)

except Exception as e:
    logging.error(f"Error connecting to HuggingFaceEndpoint: {e}")
    raise RuntimeError("Failed to initialize the LLM.")

class QuestionRequest(BaseModel):
    question: str

@app.post("/ask")
async def ask_tutor(request: QuestionRequest):
    question = request.question
    logging.info(f"Received question: {question}")

    try:
        messages = [
    SystemMessage(content=prompt),
    HumanMessage(
        content=question
    ),
]
        response_text = chat.invoke(messages)
        logging.info(f"Response generated: {response_text}")
        return {"response": response_text}
    
    except Exception as e:
        logging.error(f"Error processing request: {e}", exc_info=True)
        return {"error": "Sorry, I couldn't process your request."}

# Set logging configuration
logging.basicConfig(level=logging.INFO)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)