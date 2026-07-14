require('dotenv').config();
const express = require('express');
const path = require('path');
const config = require('./config');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/payphone-config', (req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  const { token, storeId } = config;

  if (!token || !storeId || token.includes('PEGA_AQUI') || storeId.includes('PEGA_AQUI')) {
    return res.status(500).json({
      ok: false,
      message: 'Configura tu TOKEN y STORE ID en el archivo config.js antes de iniciar una compra.',
    });
  }

  const payload = { ok: true, token, storeId };
  console.log('[API] Respondiendo payphone-config:', JSON.stringify({ ok: true, token: token.substring(0, 10) + '...', storeId }));
  res.json(payload);
});

app.get('/response', async (req, res) => {
  console.log('[RESPONSE] Params recibidos:', JSON.stringify(req.query));
  const id = parseInt(req.query.id) || 0;
  const clientTxId = (req.query.clientTransactionId || '').trim();
  const { token, confirmUrl } = config;

  let result = null;
  let error = null;
  let httpCode = 0;

  if (id <= 0 || !clientTxId) {
    console.error('[RESPONSE] Parámetros inválidos - id:', id, 'clientTxId:', clientTxId);
    error = 'No se recibieron correctamente los parámetros id y clientTransactionId desde Payphone.';
  } else if (!token || token.includes('PEGA_AQUI')) {
    console.error('[RESPONSE] Token no configurado');
    error = 'Debes colocar tu token de Payphone en el archivo config.js.';
  } else {
    try {
      const response = await fetch(confirmUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, clientTxId }),
      });

      httpCode = response.status;
      const rawText = await response.text();
      console.log('[RESPONSE] Payphone respondió HTTP', httpCode);
      console.log('[RESPONSE] Body:', rawText.substring(0, 500));

      try {
        result = JSON.parse(rawText);
      } catch {
        error = 'Payphone devolvió una respuesta que no pudo interpretarse como JSON.';
        result = { rawResponse: rawText };
      }

      if (!error && (httpCode >= 400 || result.errorCode)) {
        error = result.message || 'Payphone informó un error al confirmar la transacción.';
      }
    } catch (err) {
      console.error('[RESPONSE] Error comunicándose con Payphone:', err.message);
      error = 'No fue posible comunicarse con Payphone: ' + err.message;
    }
  }

  const status = result?.transactionStatus || '';
  const isApproved = status === 'Approved' || (result?.statusCode === 3);
  const title = isApproved ? '¡Pago aprobado!' : (error ? 'No se pudo confirmar el pago' : 'Pago procesado');
  const subtitle = isApproved
    ? 'La transacción fue confirmada correctamente mediante el API de Payphone.'
    : (error || 'Revisa el detalle devuelto por Payphone.');

  function moneyFromCents(value) {
    return '$' + (Number(value) / 100).toFixed(2);
  }

  res.render('response', {
    id,
    clientTxId,
    result,
    error,
    httpCode,
    isApproved,
    title,
    subtitle,
    moneyFromCents,
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`JoelStore corriendo en http://localhost:${PORT}`);
  });
}

module.exports = app;
