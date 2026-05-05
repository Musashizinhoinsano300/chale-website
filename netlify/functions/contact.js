exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { name, phone, date, message } = JSON.parse(event.body);

    if (!name || !phone || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Nome, telefone e mensagem são obrigatórios.' }),
      };
    }

    // TODO: integrate nodemailer or email service here
    console.log(`[CONTACT] ${name} | ${phone} | ${date || 'N/A'} | ${message}`);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Mensagem recebida com sucesso!' }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erro interno. Tente novamente.' }),
    };
  }
};
