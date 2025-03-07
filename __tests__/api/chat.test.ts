import { POST } from '@/app/api/chat+api';
import { openai } from '@ai-sdk/openai';
import { groq } from '@ai-sdk/groq';
import { streamText } from 'ai';

// Mock the dependencies
jest.mock('@ai-sdk/openai', () => ({
  openai: jest.fn(),
}));

jest.mock('@ai-sdk/groq', () => ({
  groq: jest.fn(),
}));

jest.mock('ai', () => ({
  streamText: jest.fn(),
  generateText: jest.fn(),
  wrapLanguageModel: jest.fn(({ model }) => ({
    ...model,
    middleware: { tagName: 'think' }
  })),
  extractReasoningMiddleware: jest.fn(() => ({
    tagName: 'think'
  })),
}));

describe('Chat API', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('handles POST requests correctly with Groq model', async () => {
    const mockMessages = [
      { role: 'user', content: 'Hello' },
      { role: 'assistant', content: 'Hi there!' }
    ];

    const mockRequest = new Request('http://localhost/api/chat', {
      method: 'POST',
      body: JSON.stringify({ messages: mockMessages }),
    });

    const mockStreamResponse = {
      toDataStreamResponse: jest.fn().mockReturnValue(new Response()),
    };

    // Mock the current model
    const mockModel = { name: 'mocked-model' };
    ((groq as unknown) as jest.Mock).mockReturnValue(mockModel);
    (streamText as jest.Mock).mockReturnValue(mockStreamResponse);

    await POST(mockRequest);

    // Verify the model was called with correct parameters
    expect(groq).toHaveBeenCalledWith('deepseek-r1-distill-qwen-32b');

    // Verify streamText was called with correct parameters
    expect(streamText).toHaveBeenCalledWith({
      model: {
        ...mockModel,
        middleware: { tagName: 'think' }
      },
      messages: mockMessages,
    });

    // Verify response was streamed with correct headers
    expect(mockStreamResponse.toDataStreamResponse).toHaveBeenCalledWith({
      headers: {
        'Content-Type': 'application/octet-stream',
      },
      sendReasoning: true,
    });
  });

  it('throws error for invalid request body', async () => {
    const mockRequest = new Request('http://localhost/api/chat', {
      method: 'POST',
      body: 'invalid-json',
    });

    await expect(POST(mockRequest)).rejects.toThrow();
  });

  it('verifies model configuration with middleware', async () => {
    const mockMessages = [
      { role: 'user', content: 'Hello' }
    ];

    const mockRequest = new Request('http://localhost/api/chat', {
      method: 'POST',
      body: JSON.stringify({ messages: mockMessages }),
    });

    const mockStreamResponse = {
      toDataStreamResponse: jest.fn().mockReturnValue(new Response()),
    };

    const mockModel = { name: 'mocked-model' };
    ((groq as unknown) as jest.Mock).mockReturnValue(mockModel);
    (streamText as jest.Mock).mockReturnValue(mockStreamResponse);

    await POST(mockRequest);

    // Verify the model configuration with middleware
    expect(groq).toHaveBeenCalledWith('deepseek-r1-distill-qwen-32b');
    expect(streamText).toHaveBeenCalledWith({
      model: {
        ...mockModel,
        middleware: { tagName: 'think' }
      },
      messages: mockMessages,
    });
  });
}); 