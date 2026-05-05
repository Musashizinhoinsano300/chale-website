const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// --- Mock email sender ---
function sendMockEmail(to, subject, body) {
  console.log(`[MOCK EMAIL] To: ${to}`);
  console.log(`[MOCK EMAIL] Subject: ${subject}`);
  console.log(`[MOCK EMAIL] Body:\n${body}`);
  return Promise.resolve({ success: true });
}

// --- API: Contato ---
app.post('/api/contact', async (req, res) => {
  try {
    const { name, phone, date, message } = req.body;

    if (!name || !phone || !message) {
      return res.status(400).json({ error: 'Nome, telefone e mensagem são obrigatórios.' });
    }

    const subject = `Contato via site — ${name}`;
    const body = `
Nome: ${name}
Telefone: ${phone}
Data preferida: ${date || 'Não informada'}
Mensagem: ${message}
    `.trim();

    await sendMockEmail('chale@example.com', subject, body);

    res.json({ success: true, message: 'Mensagem recebida com sucesso!' });
  } catch (err) {
    console.error('Erro ao processar contato:', err);
    res.status(500).json({ error: 'Erro interno. Tente novamente.' });
  }
});

// --- API: Reservas ---
app.post('/api/reservation', async (req, res) => {
  try {
    const { name, phone, date, guests, message } = req.body;

    if (!name || !phone || !date) {
      return res.status(400).json({ error: 'Nome, telefone e data são obrigatórios.' });
    }

    const subject = `Reserva — ${name} (${guests || '?'} pessoas)`;
    const body = `
Nome: ${name}
Telefone: ${phone}
Data: ${date}
Pessoas: ${guests || 'Não informado'}
Observações: ${message || 'Nenhuma'}
    `.trim();

    await sendMockEmail('chale@example.com', subject, body);

    res.json({ success: true, message: 'Reserva recebida com sucesso!' });
  } catch (err) {
    console.error('Erro ao processar reserva:', err);
    res.status(500).json({ error: 'Erro interno. Tente novamente.' });
  }
});

// --- SPA fallback ---
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🔥 Chalé server running at http://localhost:${PORT}`);
});
