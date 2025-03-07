import { POST } from '@/app/api/chat+api';
import { openai } from '@ai-sdk/openai';
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
  wrapLanguageModel: jest.fn(),
  extractReasoningMiddleware: jest.fn(() => ({
    tagName: 'think'
  })),
}));

describe('Chat API', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('handles POST requests correctly', async () => {
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

    (streamText as jest.Mock).mockReturnValue(mockStreamResponse);
    ((openai as unknown) as jest.Mock).mockReturnValue('mocked-model');

    await POST(mockRequest);

    // Verify openai was called with correct model
    expect(openai).toHaveBeenCalledWith('gpt-4o');

    // Verify streamText was called with correct parameters
    expect(streamText).toHaveBeenCalledWith({
      model: 'mocked-model',
      messages: mockMessages,
    });

    // Verify response was streamed
    expect(mockStreamResponse.toDataStreamResponse).toHaveBeenCalled();
  });

  it('throws error for invalid request body', async () => {
    const mockRequest = new Request('http://localhost/api/chat', {
      method: 'POST',
      body: 'invalid-json',
    });

    await expect(POST(mockRequest)).rejects.toThrow();
  });
}); 