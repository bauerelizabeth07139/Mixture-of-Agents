import { Provider, Model, ModelCapabilityProfile, ApiKeyEntry } from '../types';
import { LLMClient } from './llm-client';

// ============================================================
// Capability Test Engine - Chinese UI, parallel execution
// ============================================================

export interface TestCase {
  id: string;
  name: string;
  category: 'code' | 'reasoning' | 'chat' | 'instruction' | 'speed' | 'multimodal';
  description: string;
  prompt: string;
  maxTokens: number;
  requiresMultimodal?: boolean;
  evaluate: (response: string, latencyMs: number) => { score: number; details: string };
}

export interface TestResult {
  testId: string;
  testName: string;
  category: string;
  score: number;
  details: string;
  latencyMs: number;
  tokensUsed: number;
  skipped?: boolean;
  skipReason?: string;
}

export interface ModelTestReport {
  modelId: string;
  modelName: string;
  providerName: string;
  timestamp: string;
  results: TestResult[];
  overallScore: number;
  capabilities: ModelCapabilityProfile;
  isMultimodal: boolean;
  testSuite: 'quick' | 'standard';
}

// ─── Test Cases ───────────────────────────────────────────

const TEST_CASES: TestCase[] = [
  // ═══ Code Tests ═══
  {
    id: 'code-1',
    name: 'Python函数编写',
    category: 'code',
    description: '编写正确的Python函数，实现精确逻辑',
    prompt: 'Write a Python function called "fizzbuzz" that takes an integer n and returns a list of strings from 1 to n where multiples of 3 become "Fizz", multiples of 5 become "Buzz", multiples of both become "FizzBuzz", others become the number as string. Return ONLY the function code.',
    maxTokens: 1200,
    evaluate: (r) => {
      let score = 0;
      if (/def\s+fizzbuzz/i.test(r)) score += 1;
      if (/for\s+\w+\s+in\s+range/i.test(r)) score += 1;
      const bothPos = r.indexOf('FizzBuzz');
      const fizzPos = r.indexOf('Fizz');
      if (bothPos >= 0 && fizzPos >= 0 && bothPos <= fizzPos) score += 2;
      if (/15|\%\s*15/.test(r)) score += 2;
      if (/return|append|yield/i.test(r)) score += 1;
      if (/str\(|f['"]|append|\[.*\]/i.test(r)) score += 1;
      if (score >= 5 && !/error|undefined/.test(r)) score += 2;
      score = Math.min(10, score);
      return { score, details: score >= 7 ? 'FizzBuzz实现正确' : score >= 4 ? '部分正确' : '实现错误' };
    },
  },
  {
    id: 'code-2',
    name: 'Bug检测',
    category: 'code',
    description: '在代码中找出精确的Bug',
    prompt: 'This Python function returns the second largest number. It has a bug. Find it:\n\ndef second_largest(nums):\n    unique = list(set(nums))\n    unique.sort()\n    return unique[-2]\n\nWhen does it fail? Give a one-sentence fix.',
    maxTokens: 800,
    evaluate: (r) => {
      let score = 0;
      if (/less than 2|fewer than 2|only one|single element|IndexError/i.test(r)) score += 4;
      if (/check.*len|len.*check|if.*len.*<.*2/i.test(r)) score += 3;
      if (/set|duplicate|unique/i.test(r)) score += 1;
      if (/if.*len.*unique.*<.*2|return.*None|raise.*ValueError/i.test(r)) score += 2;
      score = Math.min(10, score);
      return { score, details: score >= 6 ? '找到了边界条件Bug' : '未找到真正Bug' };
    },
  },
  {
    id: 'code-3',
    name: '数据结构实现',
    category: 'code',
    description: '实现Python最小堆类，包含insert和extract_min方法',
    prompt: 'Implement a Python class for a min-heap with insert() and extract_min() methods. Include a test with 5 elements that inserts [3, 1, 5, 2, 4] and extracts all elements in order. Return ONLY the code.',
    maxTokens: 1500,
    evaluate: (r) => {
      let score = 0;
      if (/class\s+\w+.*[Hh]eap/i.test(r)) score += 2;
      if (/def\s+insert/i.test(r)) score += 1;
      if (/def\s+extract_min/i.test(r)) score += 1;
      if (/def\s+_sift_up|def\s+_bubble_up|def\s+_heapify_up/i.test(r)) score += 1;
      if (/def\s+_sift_down|def\s+_bubble_down|def\s+_heapify_down/i.test(r)) score += 1;
      if (/\[3.*1.*5.*2.*4\]/i.test(r)) score += 1;
      if (/extract|pop/i.test(r)) score += 1;
      if (/[12345].*[12345].*[12345].*[12345].*[12345]/i.test(r)) score += 1;
      if (score >= 5 && /assert|print|==/i.test(r)) score += 1;
      score = Math.min(10, score);
      return { score, details: score >= 7 ? '最小堆实现正确' : score >= 4 ? '部分正确' : '实现错误' };
    },
  },

  // ═══ Reasoning Tests ═══
  {
    id: 'reason-1',
    name: '数学计算',
    category: 'reasoning',
    description: '多步算术运算，要求精确答案',
    prompt: 'A rectangle has length 17.5 cm and width 8.4 cm. Calculate: 1) Area in sq cm, 2) Perimeter in cm, 3) Diagonal in cm (2 decimal places). Give answers as: Area=X, Perimeter=Y, Diagonal=Z',
    maxTokens: 1000,
    evaluate: (r) => {
      let score = 0;
      if (/147/.test(r)) score += 3;
      if (/51\.?8/.test(r)) score += 3;
      if (/19\.?4[0-2]/.test(r)) score += 4;
      score = Math.min(10, score);
      return { score, details: score >= 8 ? '全部正确' : score >= 5 ? '部分正确' : '计算错误' };
    },
  },
  {
    id: 'reason-2',
    name: '逻辑推理',
    category: 'reasoning',
    description: '解决逻辑推理问题',
    prompt: 'Three boxes labeled "Apples", "Oranges", "Mixed" ALL have wrong labels. You pick one fruit from the "Mixed" box and it is an apple. What fruit is in each box? Give answers as: Apples box=X, Oranges box=Y, Mixed box=Z',
    maxTokens: 1000,
    evaluate: (r) => {
      let score = 0;
      if (/mixed.*apple|mixed.*contain.*apple/i.test(r)) score += 3;
      if (/apples.*orange|apple.*label.*orange/i.test(r)) score += 3;
      if (/oranges.*mixed|orange.*label.*mixed/i.test(r)) score += 3;
      if (score >= 6 && /wrong|since|because|therefore/i.test(r)) score += 1;
      score = Math.min(10, score);
      return { score, details: score >= 8 ? '推理正确' : score >= 4 ? '部分正确' : '推理错误' };
    },
  },
  {
    id: 'reason-3',
    name: '多步推理',
    category: 'reasoning',
    description: '多步骤数学推理问题，需要分步计算',
    prompt: 'A train leaves station A at 9:00 traveling 60km/h. Another train leaves station B (300km away) at 10:00 traveling 90km/h toward A. At what time do they meet? Show calculation.',
    maxTokens: 1200,
    evaluate: (r) => {
      let score = 0;
      // By 10:00, train A has traveled 60km, remaining 240km
      if (/240|240\s*km/i.test(r)) score += 2;
      // Combined speed = 60+90 = 150km/h
      if (/150|150\s*km/i.test(r)) score += 2;
      // Time = 240/150 = 1.6h = 1h36m after 10:00 = 11:36
      if (/11[:\s]*36|11\.6|1:36|1h\s*36/i.test(r)) score += 4;
      if (/distance|speed|time|relative|approach/i.test(r)) score += 1;
      if (score >= 6 && /because|since|therefore|so/i.test(r)) score += 1;
      score = Math.min(10, score);
      return { score, details: score >= 8 ? '推理计算正确' : score >= 4 ? '部分正确' : '推理错误' };
    },
  },

  // ═══ Chat / Instruction Tests ═══
  {
    id: 'chat-1',
    name: '格式遵循',
    category: 'instruction',
    description: '遵循特定输出格式',
    prompt: 'Respond with EXACTLY this format, no extra text:\nName: [your model name]\nDate: [today YYYY-MM-DD]\nCapability: [one word]\nCount: [sum of 7+8+9+10+11+12]\nNothing else.',
    maxTokens: 600,
    evaluate: (r) => {
      let score = 0;
      if (/^Name:\s*\S/m.test(r)) score += 2;
      if (/Date:\s*\d{4}-\d{2}-\d{2}/.test(r)) score += 2;
      if (/Capability:\s*\w+$/m.test(r)) score += 2;
      if (/Count:\s*57/.test(r)) score += 3;
      const lines = r.trim().split('\n').filter(l => l.trim().length > 0);
      if (lines.length <= 5) score += 1;
      score = Math.min(10, score);
      return { score, details: score >= 8 ? '格式完全正确' : score >= 4 ? '部分遵循格式' : '未遵循格式' };
    },
  },
  {
    id: 'chat-1b',
    name: '多轮上下文',
    category: 'chat',
    description: '测试多轮对话中的上下文保持能力',
    prompt: 'First, tell me the capital of France. Then, in the SAME response, tell me: what was the first answer you just gave? Answer format:\nAnswer 1: [capital]\nAnswer 2: [your first answer repeated]',
    maxTokens: 600,
    evaluate: (r) => {
      let score = 0;
      if (/Answer\s*1:\s*Paris/i.test(r)) score += 3;
      if (/Answer\s*2:.*Paris/i.test(r)) score += 4;
      if (/Paris/i.test(r)) score += 1;
      const lines = r.trim().split('\n').filter(l => l.trim().length > 0);
      if (lines.length <= 5) score += 1;
      if (/capital|France/i.test(r)) score += 1;
      score = Math.min(10, score);
      return { score, details: score >= 8 ? '上下文保持正确' : score >= 4 ? '部分保持上下文' : '上下文丢失' };
    },
  },
  {
    id: 'instruction-1',
    name: '复杂指令遵循',
    category: 'instruction',
    description: '遵循复杂且精确的指令要求',
    prompt: 'List exactly 5 prime numbers between 50 and 100, in descending order, separated by commas. No explanation.',
    maxTokens: 400,
    evaluate: (r) => {
      let score = 0;
      // Parse numbers from response
      const nums = r.match(/\d+/g)?.map(Number) ?? [];
      const primes50to100 = [53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
      const validPrimes = nums.filter(n => primes50to100.includes(n));

      if (validPrimes.length === 5) score += 3;
      else if (validPrimes.length >= 3) score += 1;

      // Check descending order
      const isDescending = validPrimes.every((v, i) => i === 0 || v < validPrimes[i - 1]);
      if (isDescending && validPrimes.length === 5) score += 3;

      // Check comma-separated
      if (/,/.test(r)) score += 1;

      // Check no explanation (short response)
      if (r.length < 100) score += 2;

      // Check only 5 numbers listed
      if (nums.length === 5) score += 1;

      score = Math.min(10, score);
      return { score, details: score >= 8 ? '指令完全遵循' : score >= 4 ? '部分遵循指令' : '未遵循指令' };
    },
  },

  // ═══ Speed Test ═══
  {
    id: 'speed-1',
    name: '响应速度测试',
    category: 'speed',
    description: '简单回显测试，测量响应延迟',
    prompt: 'Respond with ONLY the word "echo" and nothing else.',
    maxTokens: 50,
    evaluate: (_r, latencyMs) => {
      let score = 0;
      if (latencyMs < 500) score = 10;
      else if (latencyMs < 1000) score = 9;
      else if (latencyMs < 1500) score = 8;
      else if (latencyMs < 2000) score = 7;
      else if (latencyMs < 3000) score = 6;
      else if (latencyMs < 5000) score = 5;
      else if (latencyMs < 8000) score = 4;
      else if (latencyMs < 12000) score = 3;
      else if (latencyMs < 20000) score = 2;
      else score = 1;
      return { score, details: `延迟: ${latencyMs}ms` };
    },
  },

  // ═══ Multimodal Test ═══
  {
    id: 'multimodal-1',
    name: '视觉能力测试',
    category: 'multimodal',
    description: '发送图片URL，要求模型描述图片内容（仅VLM模型）',
    prompt: '', // Handled specially in execution
    maxTokens: 800,
    requiresMultimodal: true,
    evaluate: (r) => {
      let score = 0;
      if (r.length > 30) score += 2;
      if (r.length > 100) score += 1;
      if (/\b(cat|dog|person|tree|car|building|flower|bird|animal|mountain|sky|water)\b/i.test(r)) score += 3;
      if (/\b(red|blue|green|white|black|yellow|brown|gray|grey|orange|purple)\b/i.test(r)) score += 2;
      if (/\b\d+\b/.test(r)) score += 1;
      if (/image|picture|photo|shows|depicts|visible|appears/i.test(r)) score += 1;
      score = Math.min(10, score);
      return { score, details: score >= 7 ? '视觉描述良好' : score >= 4 ? '视觉描述一般' : '视觉能力不足' };
    },
  },

  // ═══ Quick-only test aliases (same content, different IDs) ═══
  {
    id: 'code-quick',
    name: '快速代码测试',
    category: 'code',
    description: '编写简单的Python FizzBuzz函数',
    prompt: 'Write a Python function called "fizzbuzz" that takes an integer n and returns a list of strings from 1 to n where multiples of 3 become "Fizz", multiples of 5 become "Buzz", multiples of both become "FizzBuzz", others become the number as string. Return ONLY the function code.',
    maxTokens: 1200,
    evaluate: (r) => {
      let score = 0;
      if (/def\s+fizzbuzz/i.test(r)) score += 1;
      if (/for\s+\w+\s+in\s+range/i.test(r)) score += 1;
      const bothPos = r.indexOf('FizzBuzz');
      const fizzPos = r.indexOf('Fizz');
      if (bothPos >= 0 && fizzPos >= 0 && bothPos <= fizzPos) score += 2;
      if (/15|\%\s*15/.test(r)) score += 2;
      if (/return|append|yield/i.test(r)) score += 1;
      if (/str\(|f['"]|append|\[.*\]/i.test(r)) score += 1;
      if (score >= 5 && !/error|undefined/.test(r)) score += 2;
      score = Math.min(10, score);
      return { score, details: score >= 7 ? 'FizzBuzz实现正确' : score >= 4 ? '部分正确' : '实现错误' };
    },
  },
  {
    id: 'reason-quick',
    name: '快速数学计算',
    category: 'reasoning',
    description: '单步数学计算',
    prompt: 'What is 347 + 258? Give only the number.',
    maxTokens: 200,
    evaluate: (r) => {
      let score = 0;
      if (/605/.test(r)) score = 10;
      else if (/\d{3}/.test(r)) score = 3;
      return { score, details: score >= 8 ? '计算正确' : '计算错误' };
    },
  },
  {
    id: 'chat-quick',
    name: '快速格式测试',
    category: 'instruction',
    description: '遵循简单输出格式',
    prompt: 'Respond with EXACTLY this format, no extra text:\nName: [your model name]\nDate: [today YYYY-MM-DD]\nCapability: [one word]\nCount: [sum of 7+8+9+10+11+12]\nNothing else.',
    maxTokens: 600,
    evaluate: (r) => {
      let score = 0;
      if (/^Name:\s*\S/m.test(r)) score += 2;
      if (/Date:\s*\d{4}-\d{2}-\d{2}/.test(r)) score += 2;
      if (/Capability:\s*\w+$/m.test(r)) score += 2;
      if (/Count:\s*57/.test(r)) score += 3;
      const lines = r.trim().split('\n').filter(l => l.trim().length > 0);
      if (lines.length <= 5) score += 1;
      score = Math.min(10, score);
      return { score, details: score >= 8 ? '格式完全正确' : score >= 4 ? '部分遵循格式' : '未遵循格式' };
    },
  },
  {
    id: 'speed-quick',
    name: '快速回显测试',
    category: 'speed',
    description: '简单回显测试',
    prompt: 'Respond with ONLY the word "echo" and nothing else.',
    maxTokens: 50,
    evaluate: (_r, latencyMs) => {
      let score = 0;
      if (latencyMs < 500) score = 10;
      else if (latencyMs < 1000) score = 9;
      else if (latencyMs < 1500) score = 8;
      else if (latencyMs < 2000) score = 7;
      else if (latencyMs < 3000) score = 6;
      else if (latencyMs < 5000) score = 5;
      else if (latencyMs < 8000) score = 4;
      else if (latencyMs < 12000) score = 3;
      else if (latencyMs < 20000) score = 2;
      else score = 1;
      return { score, details: `延迟: ${latencyMs}ms` };
    },
  },
];

// ─── Quick test IDs ──────────────────────────────────────

const QUICK_TEST_IDS = ['code-quick', 'reason-quick', 'chat-quick', 'speed-quick'];
const STANDARD_TEST_IDS = [
  'code-1', 'code-2', 'code-3',
  'reason-1', 'reason-2', 'reason-3',
  'chat-1', 'chat-1b',
  'speed-1',
  'multimodal-1',
  'instruction-1',
];

// ─── Engine ───────────────────────────────────────────────

export class CapabilityTestEngine {

  /**
   * Execute a single test case against a model.
   * For multimodal tests, uses a built-in image URL.
   */
  private static async runSingleTest(
    provider: Provider,
    apiKey: ApiKeyEntry,
    model: Model,
    test: TestCase,
  ): Promise<TestResult> {
    // Skip multimodal tests for non-multimodal models
    if (test.requiresMultimodal && !model.capabilities.multimodal) {
      return {
        testId: test.id,
        testName: test.name,
        category: test.category,
        score: 0,
        details: '跳过：模型不支持多模态',
        latencyMs: 0,
        tokensUsed: 0,
        skipped: true,
        skipReason: '模型不支持多模态输入',
      };
    }

    try {
      let messages: any[];

      if (test.id === 'multimodal-1') {
        // Multimodal test with image
        const imageUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/1200px-Cat03.jpg';
        messages = [
          { role: 'system', content: 'You are a helpful assistant. Follow instructions precisely.' },
          {
            role: 'user',
            content: [
              { type: 'text', text: 'Describe this image. State: 1) main object, 2) dominant color, 3) approximate count of distinct objects.' },
              { type: 'image_url', image_url: { url: imageUrl } },
            ],
          },
        ];
      } else if (test.id === 'chat-1b') {
        // Multi-turn context test: send two messages
        messages = [
          { role: 'system', content: 'You are a helpful assistant. Follow instructions precisely.' },
          { role: 'user', content: 'What is the capital of France?' },
          { role: 'assistant', content: 'The capital of France is Paris.' },
          { role: 'user', content: test.prompt },
        ];
      } else {
        messages = [
          { role: 'system', content: 'You are a helpful assistant. Follow instructions precisely.' },
          { role: 'user', content: test.prompt },
        ];
      }

      const start = Date.now();
      const resp = await LLMClient.chatCompletion(provider, apiKey, {
        messages,
        model: model.modelId,
        maxTokens: test.maxTokens,
        temperature: 0.1,
      });
      const latencyMs = Date.now() - start;
      const evalResult = test.evaluate(resp.content, latencyMs);

      return {
        testId: test.id,
        testName: test.name,
        category: test.category,
        score: evalResult.score,
        details: evalResult.details,
        latencyMs,
        tokensUsed: resp.usage.totalTokens,
      };
    } catch (error: any) {
      return {
        testId: test.id,
        testName: test.name,
        category: test.category,
        score: 0,
        details: '错误: ' + error.message.slice(0, 150),
        latencyMs: 0,
        tokensUsed: 0,
      };
    }
  }

  /**
   * 快速测试 - 4个测试并行执行，约2分钟目标
   */
  static async runQuickTest(provider: Provider, apiKey: ApiKeyEntry, model: Model): Promise<ModelTestReport> {
    const tests = TEST_CASES.filter(t => QUICK_TEST_IDS.includes(t.id));

    // Run all 4 tests in parallel
    const settled = await Promise.allSettled(
      tests.map(test => this.runSingleTest(provider, apiKey, model, test)),
    );

    const results: TestResult[] = settled.map((s, i) => {
      if (s.status === 'fulfilled') return s.value;
      return {
        testId: tests[i].id,
        testName: tests[i].name,
        category: tests[i].category,
        score: 0,
        details: '错误: Promise rejected',
        latencyMs: 0,
        tokensUsed: 0,
      };
    });

    return this.buildReport(provider, model, results, 'quick');
  }

  /**
   * 标准测试 - 11个测试并行执行，约10分钟目标
   */
  static async runFullTest(provider: Provider, apiKey: ApiKeyEntry, model: Model): Promise<ModelTestReport> {
    const tests = TEST_CASES.filter(t => STANDARD_TEST_IDS.includes(t.id));

    // Run all 11 tests in parallel
    const settled = await Promise.allSettled(
      tests.map(test => this.runSingleTest(provider, apiKey, model, test)),
    );

    const results: TestResult[] = settled.map((s, i) => {
      if (s.status === 'fulfilled') return s.value;
      return {
        testId: tests[i].id,
        testName: tests[i].name,
        category: tests[i].category,
        score: 0,
        details: '错误: Promise rejected',
        latencyMs: 0,
        tokensUsed: 0,
      };
    });

    return this.buildReport(provider, model, results, 'standard');
  }

  /**
   * Build a ModelTestReport from test results
   */
  private static buildReport(
    provider: Provider,
    model: Model,
    results: TestResult[],
    testSuite: 'quick' | 'standard',
  ): ModelTestReport {
    const activeResults = results.filter(r => !r.skipped);
    const avg = (arr: TestResult[]) =>
      arr.length ? Math.round(arr.reduce((s, r) => s + r.score, 0) / arr.length * 10) / 10 : 0;

    const activeLatencies = activeResults.filter(r => r.latencyMs > 0);
    const avgLatency = activeLatencies.length
      ? activeLatencies.reduce((s, r) => s + r.latencyMs, 0) / activeLatencies.length
      : 9999;

    const codeResults = activeResults.filter(r => r.category === 'code');
    const reasonResults = activeResults.filter(r => r.category === 'reasoning');
    const chatResults = activeResults.filter(r => r.category === 'chat' || r.category === 'instruction');
    const speedResults = activeResults.filter(r => r.category === 'speed');
    const visionResults = activeResults.filter(r => r.category === 'multimodal');

    const isMultimodal = model.capabilities.multimodal;
    const overallScore = activeResults.length
      ? Math.round(activeResults.reduce((s, r) => s + r.score, 0) / activeResults.length * 10) / 10
      : 0;

    const capabilities: ModelCapabilityProfile = {
      code: avg(codeResults),
      agent: avg(reasonResults),
      chat: avg(chatResults),
      context: model.capabilities.context,
      speed: speedResults.length
        ? avg(speedResults)
        : (avgLatency < 800 ? 10 : avgLatency < 1500 ? 8 : avgLatency < 3000 ? 6 : avgLatency < 6000 ? 4 : 2),
      multimodal: isMultimodal,
      visionScore: visionResults.length ? visionResults[0].score : 0,
      audioScore: 0, // Reserved for future audio test
      pricing: model.capabilities.pricing,
    };

    return {
      modelId: model.id,
      modelName: model.modelId,
      providerName: provider.name,
      timestamp: new Date().toISOString(),
      results,
      overallScore,
      capabilities,
      isMultimodal,
      testSuite,
    };
  }

  /**
   * Standalone multimodal test (kept for direct route usage)
   */
  static async testMultimodal(
    provider: Provider,
    apiKey: ApiKeyEntry,
    model: Model,
    imageUrl: string,
  ): Promise<{ score: number; details: string; latencyMs: number }> {
    const start = Date.now();
    try {
      const resp = await LLMClient.chatCompletion(provider, apiKey, {
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Describe this image. State: 1) main object, 2) dominant color, 3) approximate count of distinct objects.',
              },
              { type: 'image_url', image_url: { url: imageUrl } },
            ] as any,
          },
        ],
        model: model.modelId,
        maxTokens: 800,
        temperature: 0.1,
      });
      const latencyMs = Date.now() - start;
      const r = resp.content.toLowerCase();
      let score = 0;
      if (r.length > 30) score += 2;
      if (r.length > 100) score += 1;
      if (/\b(cat|dog|person|tree|car|building|flower|bird)\b/i.test(r)) score += 3;
      if (/\b(red|blue|green|white|black|yellow|brown|gray|grey)\b/i.test(r)) score += 2;
      if (/\b\d+\b/.test(r)) score += 1;
      if (latencyMs < 5000) score += 1;
      score = Math.min(10, score);
      return { score, details: resp.content.slice(0, 200), latencyMs };
    } catch (error: any) {
      return { score: 0, details: '错误: ' + error.message.slice(0, 100), latencyMs: Date.now() - start };
    }
  }

  /** Get all test cases */
  static getTestCases(): TestCase[] {
    return TEST_CASES;
  }

  /** Get quick test IDs */
  static getQuickTestIds(): string[] {
    return QUICK_TEST_IDS;
  }

  /** Get standard test IDs */
  static getStandardTestIds(): string[] {
    return STANDARD_TEST_IDS;
  }
}