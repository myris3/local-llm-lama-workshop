# AI Workshop

## Part 2: LLMs in Your Browser

We will now dive into the `frontend` code in this repository.

To spin it up, follow these steps:

```
cd frontend/
npm install
npm start
```

1. Familiarize yourself with the code. This is a standard React app with TailwindCSS and a [Web Worker](https://developer.mozilla.org/en-US/docs/Web/API/Worker) that will handle the heavy lifting. If you haven’t worked with a Web Worker before, you can use the [Web Worker tutorial](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) as a reference on how to send messages back and forth between the worker and your main code. The key files are `src/App.tsx` and `public/worker.js`.
2. Next, we will load a model into `worker.js` that will act as our chat model. The [library](https://www.npmjs.com/package/@xenova/transformers) we will use is already imported at the top of `worker.js`. Check out the documentation for the [Transformers library](https://www.npmjs.com/package/@xenova/transformers) for details on how to use it. Inside the documentation, you’ll find a reference to "[hosted pretrained models](https://huggingface.co/models?library=transformers.js&sort=trending)," which is a list of compatible models. Find a model with a cool name and set its name as `MODEL_NAME` in `App.tsx`.

<details>
<summary>What are ONNX models?</summary>

ONNX (Open Neural Network Exchange) models are an open, platform-independent format for representing machine learning models.

It defines a computational graph consisting of nodes (operations) and edges (data flow) and supports a standardized set of operators and data types. ONNX enables interoperability between different ML frameworks, simplifies model optimization and deployment, and is supported by a broad ecosystem of tools.

The format includes metadata and is extensible for specific use cases. This makes ONNX a key technology for standardizing the exchange and deployment of AI models across platforms and environments.

</details>

3. The `MODEL_NAME` is sent to the Web Worker when you click the "Download model" button in the UI. Complete the `downloadModel` function in `worker.js` to load a model through `transformers.js`. Check the library's documentation for details on how to do this. Tip: It might be a good idea to store the loaded model in the "global" scope within `worker.js`.
4. Congratulations! You now have a model running locally on your machine! Next, we need to use it to [generate text](https://huggingface.co/tasks/text-generation#completion-generation-models). Most models compatible with `transformers.js` have a README with [usage examples](https://huggingface.co/Xenova/Qwen1.5-0.5B-Chat). Implement the `generateResponse` function in `worker.js` to take a message from the user and return a response from the model.
5. You now have a working chatbot! Experiment with various prompts and tests, just like you did with Amazon Bedrock’s interface. Is your local model as good as AWS’s models?
6. **Bonus Task**: Currently, the AI model only receives a single message and responds to it. Can you modify the API to send the entire chat history so the model has more context?

## Part 3: O-la-la-la LLaMa!

In this part, you’ll download and run larger models locally. There are many tools for this, some dependent on your operating system and hardware architecture. We’ll use [Ollama](https://ollama.com/), which (in theory) works on Windows, Mac, and Linux.

1. Follow the [instructions](https://ollama.com/) to download and install Ollama.
2. Download and test [LLaMa 3.2](https://ollama.com/library/llama3.2:3b), Meta’s latest model optimized for machines with limited resources (yes, your 64GB M3 Mac counts as limited).
3. Experiment with a few other models from the [list of supported models](https://ollama.com/library).
4. **Bonus Task**: Try another engine, [llama.cpp](https://github.com/ggerganov/llama.cpp). This engine supports models beyond Ollama, including those not trained for chat and question answering specifically.

---

## Part 4: Host Your Own LLM Through an API

It’s time to replace the local LLM in your browser with a more powerful and efficient backend hosting your model. In this part, we’ll dive into the `backend` code in this repository.

To get started, follow these steps:

```
cd backend/
python3 -m venv .venv
source .venv/bin/activate  # NOTE for Windows: source .venv/Scripts/activate
pip install -r requirements.txt
fastapi dev main.py
```

1. Familiarize yourself with the code. This is a standard [FastAPI](https://fastapi.tiangolo.com/) app using [Pydantic](https://docs.pydantic.dev/latest/) for data type definitions.
2. Use the Python library [ollama](https://github.com/ollama/ollama-python). Leverage the [Generate](https://github.com/ollama/ollama-python?tab=readme-ov-file#generate) or [Chat](https://github.com/ollama/ollama-python?tab=readme-ov-file#chat) APIs. The entire [Ollama API is documented here](https://github.com/ollama/ollama/blob/main/docs/api.md); feel free to use it as a reference. A good tip is to avoid streaming responses, as this workshop doesn’t cover handling them.
3. Modify the `/chat` endpoint code to receive the user’s message, generate a response using `ollama`, and return it.
4. Update the code in the `frontend` to send messages to the `/chat` endpoint in the `backend` instead of `worker.js`. Check out `src/api-service.ts` for a simple client to accomplish this. Do you get better or worse responses from the model you use in the backend? Why? Is there any difference in speed?
5. **Bonus Task**: Can you modify the API to send the entire chat history so the backend model receives more context from the conversation and provides better responses?

---

## Bonus: Part 4.1: Retrieval Augmented Generation

This task involves the following illustration:

![How to draw an owl](./assets/images/how-to-draw-an-owl.png "How to draw an owl.")
Image credits: https://timoelliott.com/blog/2023/05/why-ai-is-like-drawing-an-owl.html

**TL;DR**: Use `testcontainers` to spin up a `pgvector` container and use it to query a content database to answer questions.

1. Spin up a `pgvector` container using Docker or `testcontainers`.
2. Read [this guide](https://www.kaggle.com/code/arashnic/rag-with-sentence-and-hugging-face-transformers) to learn how to create text `embeddings`, what they are, and how they work.
3. Create a table in your `pgvector` database and insert some text along with its corresponding embeddings.
4. Write SQL to find the semantically closest texts and include them in the prompt you send to `ollama`.
5. If you finish this, you’re fast enough and likely skilled enough to assist others in the workshop. Stand up and offer your help as a mentor.
