type PromptRequest = {
    prompt: string
}

type PromptResponse = {
    answer: string
}

export async function promptModel(message: string): Promise<string> {
    const apiResponse =  await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: message } satisfies PromptRequest),
    })
    const promptResponse = await apiResponse.json() as PromptResponse;
    return promptResponse.answer;


}