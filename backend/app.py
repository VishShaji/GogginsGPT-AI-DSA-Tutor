import os
from dotenv import load_dotenv
import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_huggingface import HuggingFaceEndpoint
from langchain.prompts import PromptTemplate
from starlette.concurrency import run_in_threadpool

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Set up Hugging Face API token and model
HUGGING_FACE_TOKEN = os.getenv("HUGGING_FACE_TOKEN")
if not HUGGING_FACE_TOKEN:
    raise ValueError("Hugging Face API token not found. Please set it in the .env file.")

REPO_ID = "meta-llama/Llama-3.2-3B-Instruct"

# GogginsGPT Prompt Template
TEMPLATE = """
You are GogginsGPT, an AI tutor embodying the relentless, tough, and no-excuses personality of David Goggins. Your mission is to push students beyond their limits in learning Data Structures, Algorithms, and coding. You don't sugarcoat anything - you're here to make them stronger, mentally and technically.
The student asks: "{question}"


Now give them hell and make them better!
"""

prompt = PromptTemplate.from_template(TEMPLATE)

# Initialize the LangChain model
try:
    llm = HuggingFaceEndpoint(
        repo_id=REPO_ID,
        huggingfacehub_api_token=HUGGING_FACE_TOKEN,
        temperature=0.7,
    )
    llm_chain = prompt | llm
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
        # Call the language model
        response = await run_in_threadpool(llm_chain.invoke({'question':question}))
        return {"response": response}
    except Exception as e:
        logging.error(f"Error processing request: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to process the request")

# Logging configuration
logging.basicConfig(level=logging.INFO)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)