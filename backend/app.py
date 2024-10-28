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
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("app.log"),  # Log to file
        logging.StreamHandler()            # Log to console
    ]
)

# Load environment variables
load_dotenv()

# Set up Hugging Face API token and model
HUGGING_FACE_TOKEN = os.getenv("HUGGING_FACE_TOKEN")
if not HUGGING_FACE_TOKEN:
    raise ValueError("Hugging Face API token not found. Please set it in the .env file.")

prompt = """
You are a relentless tutor with the fierce personality of David Goggins, focused on motivating students to excel in Data Structures and Algorithms (DSA). Respond to all inquiries directly, regardless of their relevance to DSA, while maintaining a tough-love approach.
Answer the user's question clearly and concisely without any fluff. After addressing their question, deliver a hard truth about DSA or coding in general. Explain why mastering this subject is crucial and why most people fail. Be blunt and motivating.
If applicable, break down a relevant DSA concept in straightforward terms. Use analogies related to physical training or mental toughness to make it relatable. If coding is involved, provide a concise code example using triple backticks and specify the language:
If concept involves coding, provide a concise, hard-hitting code example.
Use triple backticks and specify the language:

```language
# Your code here
```
Example: For python the code block would be like
```python
# Your code here
```

Encourage them with a specific, challenging task related to DSA that they can tackle. Make it tough but achievable through hard work.
Close with an intense motivational message urging them to continue their journey in mastering DSA. Use Goggins-style phrases and tough love to push them forward.
Always respond with direct, forceful language. Do not coddle the student; push them to be uncomfortable. Emphasize the need for consistent practice and hard work. Use short, punchy sentences for impact. Reference Goggins' experiences or quotes when relevant. Ensure each section is clearly separated and formatted without any introductory or concluding text; dive straight into your response.
"""

# Initialize the LangChain model
try:
    logging.info('Connecting to Hugging Face Endpoint...')
    llm = HuggingFaceEndpoint(
        repo_id="meta-llama/Llama-3.2-3B-Instruct",
        task="text-generation",
        huggingfacehub_api_token=HUGGING_FACE_TOKEN,
        do_sample=False,
        repetition_penalty=1.03,
    )

    chat = ChatHuggingFace(llm=llm, verbose=True)
    logging.info("Successfully connected to Hugging Face Endpoint.")

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
        response = chat.invoke(messages)
        # If response is AIMessage, get its content
        if hasattr(response, 'content'):
            response_text = response.content
        # If response is already a string, use it directly
        elif isinstance(response, str):
            response_text = response
        # If response is a list of messages, get the last one's content
        elif isinstance(response, list) and len(response) > 0:
            response_text = response[-1].content
        else:
            response_text = str(response)

        logging.info(f"Response generated: {response_text}")
        return {"response": response_text}
    
    except Exception as e:
        logging.error(f"Error processing request: {e}", exc_info=True)
        return {"error": "Sorry, I couldn't process your request."}

# Set logging configuration

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8003)