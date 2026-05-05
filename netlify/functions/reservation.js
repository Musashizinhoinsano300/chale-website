exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { name, phone, date, guests, message } = JSON.parse(event.body);

    if (!name || !phone || !date) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Nome, telefone e data são obrigatórios.' }),
      };
    }

    // TODO: integrate nodemailer or email service here
    console.log(`[RESERVATION] ${name} | ${phone} | ${date} | ${guests || '?'} pessoas | ${message || ''}`);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Reserva recebida com sucesso!' }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erro interno. Tente novamente.' }),
    };
  }
};
