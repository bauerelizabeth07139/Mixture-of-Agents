import { Provider, Model, ModelCapabilityProfile, ApiKeyEntry } from '../types';
import { LLMClient } from './llm-client';
import { randomUUID } from 'crypto';

// ============================================================
// Capability Test Suite v2
// ============================================================

type Category = 'code' | 'reasoning' | 'chat' | 'instruction' | 'multimodal';

export interface TestCase {
  id: string;
  name: string;
  category: Category;
  description: string;
  prompt: string;
  maxTokens: number;
  evaluate: (response: string) => { score: number; details: string };
  expected?: string;
}

export interface TestResult {
  testId: string;
  testName: string;
  category: string;
  score: number;
  maxScore: number;
  details: string;
  latencyMs: number;
  tokensUsed: number;
  expected?: string;
  actualSnippet?: string;
}

export interface ModelTestReport {
  modelId: string;
  modelName: string;
  providerName: string;
  timestamp: string;
  results: TestResult[];
  overallScore: number;
  capabilities: ModelCapabilityProfile;
  metrics?: { passRate: number; codeAvg: number; reasonAvg: number; chatAvg: number; avgLatencyMs: number };
}

function stripCodeFences(s: string): string {
  return s.replace(/```[\s\S]*?```/g, (block) => block.replace(/```\w*\n?/g, '').replace(/```$/,'')).trim();
}

function extractCode(s: string): string {
  const fenceMatch = s.match(/```[a-zA-Z]*\n([\s\S]*?)```/);
  return stripCodeFences(fenceMatch ? fenceMatch[1] : s);
}

const TEST_CASES: TestCase[] = [
  {
    id: 'code-1', name: 'FizzBuzz function', category: 'code', description: 'Correct function ordering and modulo 15 check',
    prompt: 'Write a function fizzbuzz(n: number): string[] that returns FizzBuzz/Fizz/Buzz/number for 1..n. Return only the code.',
    maxTokens: 500, expected: 'function fizzbuzz',
    evaluate: (raw) => {
      const r = extractCode(raw);
      let score = 0;
      if (r.includes('function fizzbuzz')) score += 2;
      const hasMod15 = r.includes('% 15') || r.includes('%15');
      if (hasMod15) score += 2;
      if ((r.indexOf('15') < r.indexOf('3') && r.indexOf('15') < r.indexOf('5')) || hasMod15) score += 1;
      if (r.includes('return')) score += 2;
      if (r.includes(': string[]') || r.includes(':string[]') || r.includes('Array<string>')) score += 1;
      if (r.includes('% 3') || r.includes('%3')) score += 1;
      if (r.includes('% 5') || r.includes('%5')) score += 1;
      return { score: Math.min(10, score), details: score >= 8 ? 'Solid FizzBuzz' : score >= 5 ? 'Mostly correct' : 'Missing rules/type/ordering' };
    },
  },
  {
    id: 'code-2', name: 'Bug detection', category: 'code', description: 'Find the edge case for list smaller than 2 unique elements',
    prompt: 'Find the bug and give the smallest failing input for:\nfunction secondLargest(arr) {\n  const unique = [...new Set(arr)];\n  unique.sort((a,b)=>b-a);\n  return unique[1];\n}\nReply with: BUG: <explanation> FIXED: <one line fix> EXAMPLE: <failing input>',
    maxTokens: 300, expected: 'unique.length',
    evaluate: (r) => {
      const t = r.toLowerCase();
      let score = 0;
      if (t.includes('length') && (t.includes('< 2') || t.includes('<2') || t.includes('less than 2'))) score += 3;
      if (t.includes('[0]') || t.includes('[1]') || t.includes('empty') || t.includes('only one')) score += 2;
      if (t.includes('fixed:') || t.includes('fix:')) score += 2;
      if (t.includes('example:') || t.includes('failing input')) score += 1;
      if (t.includes('duplicate') || t.includes('set')) score += 1;
      if (t.includes('return null') || t.includes('return undefined') || t.includes('throw')) score += 1;
      return { score: Math.min(10, score), details: score >= 7 ? 'Edge case found and fixed' : score >= 4 ? 'Partial diagnosis' : 'Missed core bug' };
    },
  },
  {
    id: 'code-3', name: 'Mini data transform', category: 'code', description: 'Write a correct filter+map+sort pipeline',
    prompt: 'Given array items: {name:string, price:number, active:boolean}[], write function topActive(items,n) returning top-n by price of active=true. Return only code.',
    maxTokens: 500, expected: 'function topActive',
    evaluate: (raw) => {
      const r = extractCode(raw);
      let score = 0;
      if (r.includes('function topActive')) score += 2;
      if (r.includes('.filter')) score += 2;
      if (r.includes('.sort')) score += 2;
      if (r.includes('.slice')) score += 2;
      if (r.includes('active')) score += 1;
      return { score: Math.min(10, score), details: score >= 8 ? 'Clean pipeline' : 'Incomplete pipeline' };
    },
  },
  {
    id: 'reason-1', name: 'Exact arithmetic', category: 'reasoning', description: 'Exact numeric answers',
    prompt: 'Rectangle has width 12 and length 14.7. Return only JSON {"area":x,"perimeter":y,"diagonal":z} with area exact, perimeter 1 decimal, diagonal 2 decimals.',
    maxTokens: 120, expected: '{"area":176.4,"perimeter":53.4,"diagonal":19.01}',
    evaluate: (r) => {
      let score = 0;
      try {
        const m = r.match(/{[^}]*}/);
        if (!m) return { score: 0, details: 'No JSON found' };
        const j = JSON.parse(m[0]);
        if (j.area === 176.4 || j.area === '176.4') score += 4; else if (Math.abs(Number(j.area) - 176.4) < 0.2) score += 2;
        if (String(j.perimeter) === '53.4') score += 3; else if (Math.abs(Number(j.perimeter) - 53.4) < 0.2) score += 1;
        if (String(j.diagonal) === '19.01' || Number(j.diagonal) === 19.01) score += 3; else if (Math.abs(Number(j.diagonal) - 19.01) < 0.05) score += 1;
      } catch { return { score: 0, details: 'Invalid JSON' }; }
      return { score: Math.min(10, score), details: score >= 8 ? 'Exact numbers' : score >= 5 ? 'Partial numeric precision' : 'Arithmetic errors' };
    },
  },
  {
    id: 'reason-2', name: 'Logic puzzle', category: 'reasoning', description: 'Boxes + sealed statement',
    prompt: 'Three boxes labeled Apple, Orange, Mixed. All labels are wrong. You draw Apple from Mixed. Where is Orange? Reply JSON {"box_apple":"...","box_orange":"...","box_mixed":"..."}.',
    maxTokens: 120, expected: '{"box_apple":"Mixed","box_orange":"Apple","box_mixed":"Orange"}',
    evaluate: (r) => {
      let score = 0;
      try {
        const m = r.match(/{[^}]*}/);
        if (!m) return { score: 0, details: 'No JSON' };
        const j = JSON.parse(m[0]);
        if (j.box_orange === 'Apple') score += 4;
        if (j.box_apple === 'Mixed') score += 3;
        if (j.box_mixed === 'Orange') score += 3;
      } catch { return { score: 0, details: 'Invalid JSON' }; }
      return { score: Math.min(10, score), details: score >= 8 ? 'Correct deduction' : score >= 4 ? 'Partial deduction' : 'Wrong arrangement' };
    },
  },
  {
    id: 'chat-1', name: 'Strict format', category: 'chat', description: 'Follow exact output format',
    prompt: 'Return exactly this template with real values. Do not add extra text.\nCategory: Education\nFormat: List\nCount: 57\nSummary: A precise list of 57 short programming learning topics.',
    maxTokens: 400, expected: 'Count: 57',
    evaluate: (r) => {
      let score = 0;
      if (r.includes('Category: Education')) score += 2;
      if (r.includes('Format: List')) score += 2;
      if (/Count:\s*57/.test(r)) score += 3;
      if (r.includes('Summary:')) score += 1;
      const numCount = (r.match(/^\d+[).]\s|^[-*]\s/gm) || []).length;
      if (numCount >= 50) score += 2; else if (numCount >= 30) score += 1;
      return { score: Math.min(10, score), details: score >= 8 ? 'Template followed' : 'Format deviation' };
    },
  },
  {
    id: 'chat-2', name: 'Exact word count', category: 'chat', description: 'Precise 20-word response',
    prompt: 'Explain recursion in exactly 20 words. No punctuation except one period at the end.',
    maxTokens: 80, expected: '20 words',
    evaluate: (r) => {
      const text = r.replace(/\s+/g, ' ').trim();
      const words = text.split(' ').length;
      let score = 0;
      if (words === 20) score += 6; else if (Math.abs(words - 20) <= 2) score += 3; else if (Math.abs(words - 20) <= 5) score += 1;
      if (text.endsWith('.')) score += 1;
      const containsRecursion = text.toLowerCase().includes('recursion') || text.toLowerCase().includes('recursive');
      if (containsRecursion) score += 2;
      if (text.length > 30) score += 1;
      return { score: Math.min(10, score), details: 'words=' + words + (words === 20 ? ' exact' : ' off-target') };
    },
  },
  {
    id: 'speed-1', name: 'Latency + correctness', category: 'chat', description: 'Speed weighted with correctness',
    prompt: 'Return only the answer: what is 17 * 24 + 3?',
    maxTokens: 20, expected: '411',
    evaluate: () => ({ score: 0, details: 'scored by latency wrapper' }),
  },
];

function scoreSpeed(ms: number): number {
  if (ms <= 0) return 0;
  if (ms < 500) return 6;
  if (ms < 1000) return 5;
  if (ms < 2000) return 4;
  if (ms < 4000) return 3;
  if (ms < 8000) return 2;
  return 1;
}

function scoreCorrectness(text: string, expected?: string): number {
  if (!expected) return 0;
  const t = text.trim();
  if (expected === '20 words') {
    const words = t.replace(/\s+/g,' ').split(' ').length;
    return words === 20 ? 4 : Math.abs(words - 20) <= 2 ? 2 : 0;
  }
  const ok = expected.split('|').some((frag) => t.includes(frag));
  return ok ? 4 : 0;
}

function resultFromEval(test: TestCase, raw: string, latencyMs: number, usage: {totalTokens:number}): TestResult {
  const expected = test.expected;
  const manual = test.id === 'speed-1'
    ? { score: scoreSpeed(latencyMs) + scoreCorrectness(raw, '411'), details: 'ms=' + latencyMs }
    : test.evaluate(raw);
  const extra = test.id === 'speed-1' ? 0 : scoreCorrectness(raw, expected);
  const finalScore = Math.min(10, manual.score + extra);
  return {
    testId: test.id, testName: test.name, category: test.category,
    score: finalScore, maxScore: 10, details: manual.details, latencyMs,
    tokensUsed: usage.totalTokens, expected, actualSnippet: raw.slice(0, 220),
  };
}

export class CapabilityTestEngine {

  static async runFullTest(provider: Provider, apiKey: ApiKeyEntry, model: Model): Promise<ModelTestReport> {
    const results: TestResult[] = [];
    for (const test of TEST_CASES) {
      try {
        const start = Date.now();
        const resp = await LLMClient.chatCompletion(provider, apiKey, {
          messages: [{ role: 'user', content: test.prompt }],
          model: model.modelId, maxTokens: test.maxTokens, temperature: 0.1,
        });
        results.push(resultFromEval(test, resp.content, Date.now() - start, resp.usage));
      } catch (error: any) {
        results.push({ testId: test.id, testName: test.name, category: test.category, score: 0, maxScore: 10, details: error.message?.slice(0,120) || 'error', latencyMs: 0, tokensUsed: 0, expected: test.expected, actualSnippet: '' });
      }
    }
    return finalizeReport(model, provider, results);
  }

  static async runQuickTest(provider: Provider, apiKey: ApiKeyEntry, model: Model): Promise<ModelTestReport> {
    const quickIds = new Set(['code-1','reason-1','chat-1','speed-1']);
    const cases = TEST_CASES.filter((t) => quickIds.has(t.id));
    const results: TestResult[] = [];
    for (const test of cases) {
      try {
        const start = Date.now();
        const resp = await LLMClient.chatCompletion(provider, apiKey, {
          messages: [{ role: 'user', content: test.prompt }],
          model: model.modelId, maxTokens: test.maxTokens, temperature: 0.1,
        });
        results.push(resultFromEval(test, resp.content, Date.now() - start, resp.usage));
      } catch (error: any) {
        results.push({ testId: test.id, testName: test.name, category: test.category, score: 0, maxScore: 10, details: error.message?.slice(0,120) || 'error', latencyMs: 0, tokensUsed: 0, expected: test.expected, actualSnippet: '' });
      }
    }
    return finalizeReport(model, provider, results);
  }

  static async testMultimodal(provider: Provider, apiKey: ApiKeyEntry, model: Model, imageUrl: string): Promise<{ score: number; details: string; latencyMs: number }> {
    const start = Date.now();
    try {
      const resp = await LLMClient.chatCompletion(provider, apiKey, {
        messages: [{
          role: 'user',
          content: [
            { type: 'text', text: 'Describe the image in 2 sentences. Mention object, color, and background.' },
            { type: 'image_url', image_url: { url: imageUrl } },
          ] as any,
        }],
        model: model.modelId, maxTokens: 220, temperature: 0.2,
      });
      const latencyMs = Date.now() - start;
      const t = resp.content.toLowerCase();
      let score = 0;
      if (t.length > 40) score += 2;
      if (t.length > 120) score += 2;
      if (t.includes('color') || t.includes('colour') || t.includes('red') || t.includes('blue') || t.includes('black') || t.includes('white')) score += 2;
      if (t.includes('background') || t.includes('behind')) score += 2;
      if (t.includes('image') || t.includes('photo') || t.includes('picture') || t.includes('cat') || t.includes('dog')) score += 2;
      return { score: Math.min(10, score), details: resp.content.slice(0, 220), latencyMs };
    } catch (error: any) {
      return { score: 0, details: error.message?.slice(0, 120) || 'error', latencyMs: Date.now() - start };
    }
  }

  static getTestCases(): TestCase[] {
    return TEST_CASES.map((t) => ({ ...t }));
  }
}

function finalizeReport(model: Model, provider: Provider, results: TestResult[]): ModelTestReport {
  const overallScore = results.length ? Math.round((results.reduce((a, b) => a + b.score, 0) / results.length) * 10) / 10 : 0;
  const avg = (cat: string) => {
    const arr = results.filter((r) => r.category === cat);
    return arr.length ? Math.round((arr.reduce((a, b) => a + b.score, 0) / arr.length) * 10) / 10 : 5;
  };
  const latencyArr = results.filter((r) => r.latencyMs > 0);
  const avgLatencyMs = latencyArr.length ? Math.round(latencyArr.reduce((a, b) => a + b.latencyMs, 0) / latencyArr.length) : 5000;
  const codeAvg = avg('code');
  const reasonAvg = avg('reasoning');
  const chatAvg = Math.max(avg('chat'), avg('instruction'));
  const capabilities: ModelCapabilityProfile = {
    code: codeAvg, agent: reasonAvg, chat: chatAvg,
    context: model.capabilities.context, speed: avgLatencyMs < 800 ? 10 : avgLatencyMs < 1500 ? 8 : avgLatencyMs < 3000 ? 6 : avgLatencyMs < 6000 ? 4 : 2,
    multimodal: model.capabilities.multimodal, pricing: model.capabilities.pricing,
  };
  const passRate = results.length ? Math.round((results.filter((r) => r.score >= 6).length / results.length) * 100) : 0;
  return {
    modelId: model.id, modelName: model.modelId, providerName: provider.name,
    timestamp: new Date().toISOString(), results, overallScore, capabilities,
    metrics: { passRate, codeAvg, reasonAvg, chatAvg, avgLatencyMs },
  };
}
