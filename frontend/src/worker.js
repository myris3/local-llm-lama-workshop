import { pipeline, env } from "@huggingface/transformers";
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
  const output = await pipe(messages[messages.length-1].message , { max_new_tokens: 200, temperature: 1.0, repetition_penalty: 2.0, no_repeat_ngram_size: 3 });
  self.postMessage({
    status: "response",
    result: output[0].generated_text,
  });
};
