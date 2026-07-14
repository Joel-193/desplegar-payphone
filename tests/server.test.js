const request = require('supertest');
const app = require('../server');

describe('GET /', () => {
  it('debe retornar 200 y contenido HTML', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/html/);
    expect(res.text).toContain('JoelStore');
  });
});

describe('GET /api/payphone-config', () => {
  it('debe retornar 200 con JSON válido', async () => {
    const res = await request(app).get('/api/payphone-config');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.body.ok).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.storeId).toBeDefined();
  });

  it('debe tener un token no vacío', async () => {
    const res = await request(app).get('/api/payphone-config');
    expect(res.body.token.length).toBeGreaterThan(10);
    expect(res.body.storeId.length).toBeGreaterThan(5);
  });
});

describe('GET /response', () => {
  it('debe retornar 200 sin parámetros y mostrar error', async () => {
    const res = await request(app).get('/response');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/html/);
    expect(res.text).toContain('Resultado del pago');
  });

  it('debe retornar 200 con parámetros inválidos', async () => {
    const res = await request(app).get('/response?id=123&clientTransactionId=test');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/html/);
    expect(res.text).toContain('Respuesta del API');
  });
});
