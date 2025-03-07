// Mock fetch globally
global.fetch = jest.fn();

// Mock Request and Response if they're not available in the test environment
if (typeof Request === 'undefined') {
  global.Request = class Request {
    constructor(url, options = {}) {
      this.url = url;
      this.method = options.method || 'GET';
      this.body = options.body;
    }

    async json() {
      return JSON.parse(this.body);
    }
  };
}

if (typeof Response === 'undefined') {
  global.Response = class Response {
    constructor(body, options = {}) {
      this.body = body;
      this.status = options.status || 200;
      this.headers = options.headers || {};
    }
  };
}

// Mock the useThemeColor hook
jest.mock('./hooks/useThemeColor', () => ({
  useThemeColor: () => '#000000',
})); 