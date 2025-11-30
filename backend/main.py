
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import ollama # TODO Part 4: Use ollama SDK to interact with local ollama

# TODO Part 5: Use boto3 to interact with Amazon Bedrock
# import boto3
# session = boto3.Session(
#     aws_access_key_id="XXX",
#     aws_secret_access_key="XXXXXXXXXXXXXXX",
#     region_name="us-east-1"
# )
# client = session.client('bedrock-runtime')

class PromptRequest(BaseModel):
    prompt: str

class PromptResponse(BaseModel):
    answer: str

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/chat")
def chat(promptRequest: PromptRequest) -> PromptResponse:
    return PromptResponse(answer="Hello from backend!")

@app.post("/bedrock")
def chat(promptRequest: PromptRequest) -> PromptResponse:
    return PromptResponse(answer="Hello from bedrock!")


