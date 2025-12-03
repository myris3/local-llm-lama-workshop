import { useCallback, useEffect, useRef, useState } from 'react';
import Worker from './worker?worker';

type ChatMessage = {
  message: string;
  role: 'user' | 'assistant' | 'system';
};
const aiWorker = new Worker();

//const MODEL_NAME = 'Xenova/distilgpt2';
//const MODEL_NAME = 'onnx-community/Gpt2-Wikitext-9180-ONNX'
const MODEL_NAME = 'Xenova/LaMini-Flan-T5-783M';

export default function App() {
  const chatMessages = useRef<HTMLDivElement>(null);
  const chatInput = useRef<HTMLInputElement>(null);
  const [modelStatus, setModelStatus] = useState<'initial' | 'loading' | 'ready'>('initial');
  const [chatStatus, setChatStatus] = useState<'loading' | 'ready'>('ready');

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([{role: 'system', message: 'You are a helpful assistant.'}]);

  const appendMessage = useCallback(
    (message: string, role: ChatMessage['role']) => {
      setMessages((messages) => [...messages, { message, role }]);
    }, [setMessages]);


  const downloadModel = useCallback(() => {
    setModelStatus('loading');
    aiWorker.postMessage({
      action: 'download',
      modelName: MODEL_NAME,
    });
  }, [setModelStatus]);

  const sendMessage = useCallback(async () => {
    setChatStatus('loading');
    aiWorker.postMessage({
      action: 'chat',
      content: [...messages, {message, role: 'user'}],
    });
    appendMessage(message, 'user');
    setMessage('');
  }, [message, appendMessage, setMessage]);

  useEffect(() => {
    if (chatMessages.current) {
      chatMessages.current.scrollTop = chatMessages.current.scrollHeight;
    }
    if (chatInput.current) {
      chatInput.current.focus();
    }
  }, [messages]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const aiResponse = event.data;
      if (aiResponse.status === 'ready') {
        setModelStatus('ready');
      } else if (aiResponse.result) {
        appendMessage(aiResponse.result, 'assistant');
        setChatStatus('ready');
      }
    };
    aiWorker.addEventListener('message', handleMessage);
    return () => {
      aiWorker.removeEventListener('message', handleMessage);
    };
  }, [appendMessage]);

  return (
    <div className="flex w-screen h-screen justify-center items-center bg-[#333]">
      <div className="flex w-[1000px] max-w-full h-[80%] flex-col bg-white p-4 border-3 border-gray-600 overflow-y-scroll">
        <div className="flex flex-row justify-center">
          <h2 className="text-2xl">AI Workshop: {MODEL_NAME} model</h2>
        </div>
        {modelStatus === 'initial' && (
          <div className="flex flex-col justify-center items-center grow">
            <button className="text-white bg-[#ff5c00] text-xl px-4 py-2" onClick={downloadModel}>
              Download model
            </button>
          </div>
        )}
        {modelStatus === 'loading' && (
          <div className="flex flex-col justify-center items-center grow">
            <div className="spinner"></div>
          </div>
        )}
        {modelStatus === 'ready' && (
          <>
            {messages.length === 0 && (
              <div className="flex flex-col justify-center items-center text-[#666] font-mono text-center grow">
                Start chatting with {MODEL_NAME}!
              </div>
            )}
            {messages.length > 0 && (
              <div
                ref={chatMessages}
                className="w-full flex flex-col items-center justify-center h-[50vh] overflow-y-auto grow"
              >
                {messages.map((message, index) => (
                  message.role !== 'system' ? <div
                    className={`chat-message ${
                      message.role === 'user'
                        ? 'bg-[#faebd7] self-end'
                        : message.role === 'assistant'
                        ? 'bg-[#f9cd93] self-start'
                        : ''
                    } w-[80%] p-4 mb-4 break-words`}
                    key={index}
                  >
                    {message.message}
                  </div> : null
                ))}
              </div>
            )}
            <div className="flex w-full p-10 flex-row justify-center">
              <input
                className="w-full p-4 text-base border border-[#ff5c00] mr-4"
                type="text"
                ref={chatInput}
                value={message}
                disabled={chatStatus === 'loading'}
                onChange={(event) => {
                  setMessage(event.target.value);
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    
                    sendMessage();
                  }
                }}
                placeholder="Type your message..."
              />
              <div className="flex flex-col items-center justify-center h-full w-16">
                {chatStatus === 'loading' ? (
                  <div className="spinner"></div>
                ) : (
                  <button
                    onClick={sendMessage}
                    className="text-white text-base border border-[#ff5c00] h-full w-full bg-[#ff5c00] cursor-pointer"
                  >
                    Send
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
