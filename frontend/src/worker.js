import { pipeline, env } from "@huggingface/transformers"; // TODO: Import what you need from this library
//env.allowLocalModels = false;
//env.useBrowserCache = false;

let pipe = null;

self.addEventListener("message", (event) => {
  const userRequest = event.data;

  if (userRequest.action === "download") {
    downloadModel(userRequest.modelName);
  } else if (userRequest.action === "chat") {
    generateResponse(userRequest.content);
  }
});

const downloadModel = async (modelName) => {
  pipe = await pipeline("text2text-generation", modelName);
  self.postMessage({
    status: "ready",
  });
};

const generateResponse = async (messages) => {
  console.log("Generating response for:", messages);
  //const prompt = messagesToPrompt(messages);
  const output = await pipe(messages[messages.length-1].message , { max_new_tokens: 200, temperature: 1.0, repetition_penalty: 2.0, no_repeat_ngram_size: 3 });
  self.console.log("Model output:", output);
  self.postMessage({
    status: "response",
    result: output[0].generated_text,
  });
};

function messagesToPrompt(messages) {
  return messages
    .map(msg => {
      if (msg.role === 'user') return `User: ${msg.message}`;
      if (msg.role === 'assistant') return `Assistant: ${msg.message}`;
      return msg.message;
    })
    .join('\n') + '\nAssistant:';
}
