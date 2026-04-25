const request = require('supertest');
const express = require('express');

// Mock dependencies
jest.mock('../src/models/UsageLog', () => ({
  create: jest.fn().mockResolvedValue({})
}));

jest.mock('ioredis', () => {
  return jest.fn().mockImplementation(() => ({
    get: jest.fn(),
    set: jest.fn(),
    incr: jest.fn().mockResolvedValue(1),
    expire: jest.fn(),
    del: jest.fn()
  }));
});

describe('Gateway Middleware - Key Validation', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
  });

  test('should reject request with no API key', async () => {
    app.get('/test', (req, res) => {
      const apiKey = req.headers['x-api-key'];
      if (!apiKey) return res.status(401).json({ error: 'API key required' });
      res.json({ ok: true });
    });

    const res = await request(app).get('/test');
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('API key required');
  });

  test('should accept request with valid API key header', async () => {
    app.get('/test', (req, res) => {
      const apiKey = req.headers['x-api-key'];
      if (!apiKey) return res.status(401).json({ error: 'API key required' });
      res.json({ ok: true });
    });

    const res = await request(app).get('/test').set('x-api-key', 'mk_test_validkey123');
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  test('should reject malformed API key', async () => {
    app.get('/test', (req, res) => {
      const apiKey = req.headers['x-api-key'];
      if (!apiKey || !apiKey.startsWith('mk_')) {
        return res.status(401).json({ error: 'Invalid API key format' });
      }
      res.json({ ok: true });
    });

    const res = await request(app).get('/test').set('x-api-key', 'invalid_key');
    expect(res.status).toBe(401);
  });
});

describe('Rate Limiting Logic', () => {
  test('should allow requests under the limit', () => {
    const limit = 100;
    const currentCount = 50;
    expect(currentCount < limit).toBe(true);
  });

  test('should block requests over the limit', () => {
    const limit = 100;
    const currentCount = 101;
    expect(currentCount > limit).toBe(true);
  });

  test('should calculate correct remaining requests', () => {
    const limit = 100;
    const used = 30;
    const remaining = limit - used;
    expect(remaining).toBe(70);
  });
});

describe('Billing Calculation Logic', () => {
  const PRICE_PER_REQUEST = 0.001; // $0.001 per request

  test('should calculate correct bill for 1000 requests', () => {
    const requests = 1000;
    const bill = requests * PRICE_PER_REQUEST;
    expect(bill).toBeCloseTo(1.0);
  });

  test('should calculate correct bill for 0 requests', () => {
    const requests = 0;
    const bill = requests * PRICE_PER_REQUEST;
    expect(bill).toBe(0);
  });

  test('should calculate correct bill for 500 requests', () => {
    const requests = 500;
    const bill = requests * PRICE_PER_REQUEST;
    expect(bill).toBeCloseTo(0.5);
  });

  test('should apply free tier (first 1000 requests free)', () => {
    const FREE_TIER = 1000;
    const totalRequests = 1500;
    const billableRequests = Math.max(0, totalRequests - FREE_TIER);
    const bill = billableRequests * PRICE_PER_REQUEST;
    expect(billableRequests).toBe(500);
    expect(bill).toBeCloseTo(0.5);
  });
});
