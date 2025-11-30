# Capra AI Workshop

In this workshop, we will take a closer look at various methods and setups of AI tools available on the market today. Specifically, we will cover:

- AWS's AI studio, Amazon Bedrock, where we will see what is available and what is possible with a few clicks.
- Running multiple LLMs locally on your own machine - no need for any backend service!
- Visiting [HuggingFace](https://huggingface.co/) to see how to share and work with open source AI models.
- Setting up a backend service that uses larger models running locally on your machine
- If time permits: Looking at the technique RAG (Retrieval Augmented Prompting)
- Integrating the backend service with Amazon Bedrock's APIs

To complete this workshop, you will need:

- An AWS account
- Basic programming skills in JavaScript/TypeScript and Python
- A machine with at least 8GB RAM

## Part 1: Introduction to Amazon Bedrock

<details>
<summary>What is Amazon Bedrock?</summary>

Amazon Bedrock is a fully managed service that provides developers and organizations access to a range of large language models (LLMs) and generative AI models via a simple API interface. The service includes models from leading AI companies like Anthropic, AI21 Labs, and Stability AI, as well as Amazon's own models.

Technically, Bedrock functions as an abstraction layer over complex AI infrastructure. It handles scaling up, scaling down, and resource allocation automatically, eliminating the need for manual management of underlying hardware and software.

A key feature of Bedrock is the ability for model customization. This allows users to fine-tune pre-trained models on their own datasets, which can improve the model's performance for specific use cases. The process takes place within the customer's AWS environment, ensuring data security and privacy.

Bedrock integrates seamlessly with other AWS services, enabling the development of end-to-end AI solutions. For example, you can combine Bedrock with Amazon S3 for data storage, Amazon SageMaker for additional machine learning tasks, or AWS Lambda for serverless processing of AI-generated content.

The Bedrock API supports both synchronous and asynchronous requests, providing flexibility for different use cases. For long or resource-intensive tasks, asynchronous calls can be particularly useful.

The service can be used for a variety of tasks in natural language processing and generative AI, including text generation, semantic search, sentiment analysis, and translation. It also supports multimodal models that can generate or analyze both text and images.

</details>

In this section, we will activate and use some of the models available through Amazon Bedrock.

1. Log in to the AWS console with your Capra or personal account. What we’re going to do doesn’t cost much, so feel free to explore.
1. From the list of services, select: Machine Learning -> Amazon Bedrock.
1. You are now in Amazon Bedrock’s Studio. Click around and familiarize yourself with the solution.
1. We will take a closer look at the Chat/Text feature. This is a tool for easily interacting with LLMs in a chat format. Click on Chat/Text in the left-hand menu.
1. To use the service, we need to activate access to a few AI models. Click the "Select model" button and browse through the available models. Click "Request access" to open the model request form. Then, click "Modify model access."
1. Models from Anthropic are currently known as some of the best on the market—better than ChatGPT 4o in several areas. If available, check the boxes for Claude 3.5 Sonnet, Claude 3 Haiku, and Claude 3 Sonnet to gain access. Also, select Titan Image Generator G1 v2 from Amazon and SDXL 1.0 from Stability AI. Feel free to add more as well. It doesn’t cost anything.

<details>
<summary>What are all these models?</summary>

Amazon develops some models itself, but its greatest strength lies in providing models from other vendors under a unified API.

The text-generation models available are among the best in the field, and there’s a wide selection. For image generation, the selection is more limited, and state-of-the-art models are not available. Currently, image generation is restricted to Amazon’s own Titan models and one model from Stability AI (SDXL v1.0).

If you’re interested in learning more about the best image generators out there, check out:

- [DALL-E 3](https://openai.com/index/dall-e-3/) by OpenAI
- [Midjourney 6.1](https://www.midjourney.com/home) by Midjourney
- [Stable Diffusion 3.5 Large](https://stability.ai/) by Stability AI

There are also other categories of models:

**Audio**

- [Synthesia](https://www.synthesia.io/features/languages)
- [Assembly.ai](https://www.assemblyai.com/) <- Excellent for podcasts!
- [Whisper](https://openai.com/index/whisper/) by OpenAI

**Video**

- [Sora](https://openai.com/index/sora/) by OpenAI (Not available to the public)
- [Synthesia Video](https://www.synthesia.io/video-templates) Example: [Video generated through Synthesia Studio](https://share.synthesia.io/627708f6-e273-4bb3-a89a-0eb7e3a8176a)

</details>

7. Click "Next" at the bottom of the page and then "Submit." You should have access to the models within 2–5 minutes.
8. Test the Chat/Text feature with some of the models. See if you can spot differences between them and form an opinion on which ones work best.

<details>
<summary>What should you ask?</summary>

Most language models are good enough to provide recipes or dinner suggestions, even in Norwegian. Instead, ask about more advanced topics to test whether the model understands context and details in the text you provide.

For some great prompt examples, check out [this blog on the topic](https://medium.com/@woyera/top-10-ways-to-measure-how-smart-your-ai-really-is-a-fun-guide-06e232656231).

</details>

9. Test the Image feature with the SDXL model. Try generating some images and evaluate whether the quality meets your expectations.

What do the parameters `p`, `k`, and `temperature` mean? For a good explanation, check out [Amazon's explanation of the parameters](https://docs.aws.amazon.com/bedrock/latest/userguide/inference-parameters.html?icmpid=docs_bedrock_help_panel_playgrounds).

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

## Part 5: Amazon Bedrock API

Your laptop’s hardware is good but not powerful enough to run truly large models like LLaMa 3.1 405B. For that, we need a server farm with GPUs. It’s time to leverage the famous _cloud_ for what it’s worth.

1. In the `backend` repository, the library `boto3` is already included. Despite the name, this is AWS's official SDK for the Python ecosystem. To connect to AWS, you need to create a [Session](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/core/session.html#boto3.session.Session). To start a session, you’ll need `aws_access_key_id`, `aws_secret_access_key`, and `region_name`. To create an access key, follow [this guide](https://docs.aws.amazon.com/IAM/latest/UserGuide/access-key-self-managed.html#Using_CreateAccessKey). Set `region_name` to the region you’re using in the AWS web portal. The default is `us-east-1`.

<details>
<summary>Why the name boto3?</summary>

Boto (pronounced boh-toh) is a type of freshwater dolphin that lives in the Amazon River.

</details>

2. To interact with the models you activated in Part 1 of this workshop, follow [this guide](https://docs.aws.amazon.com/code-library/latest/ug/python_3_bedrock-runtime_code_examples.html). Model names and parameters depend on the models you selected earlier. Update the code in `/bedrock` to use models via Amazon Bedrock.
3. Modify the `frontend` code to use the `/bedrock` endpoint instead of `/chat`. The endpoints use the same data model by default, so the changes should be minimal. Do you get faster responses from Bedrock compared to `ollama`?
4. **Bonus Task**: If you haven’t already, modify the API to include the entire chat history with each request.

---

## Bonus: Part 5.1: Image Generation with Amazon Bedrock

Amazon Bedrock also offers the ability to generate images through its API. Use `boto3` to generate images and send them back to the client. For example, you could implement functionality so that messages starting with `image:` are sent to SDXL in Bedrock instead of a text model.
