import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { firstName, lastName, email, propertyTitle, checkin, checkout, adults, minors, minorAges } = data;

    if (!firstName || !email || !propertyTitle) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Configure the SMTP transport
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'saadkmauricio@gmail.com', // Sender Account
        pass: 'xbty szpq cjsv axt' // New App Password
      }
    });

    // Subject Format: [Primeiro Nome] + [Título Resumido Casa] + [X]A [Y]M + [DD/MM/AA] + [DD/MM/AA]
    const fmt = (d: string) => d ? d.split('-').reverse().join('/') : '';
    const subject = `${firstName} + ${propertyTitle} + ${adults}A ${minors}M + ${fmt(checkin)} + ${fmt(checkout)}`;

    // Email Body
    const agesStr = minors > 0 && minorAges && minorAges.length > 0 ? `Idade dos menores: ${minorAges.join(', ')}` : '';
    
    const htmlBody = `
      <h2>Nova Consulta Recebida via Site</h2>
      <p><strong>Cliente:</strong> ${firstName} ${lastName}</p>
      <p><strong>E-mail:</strong> ${email}</p>
      <p><strong>Imóvel:</strong> ${propertyTitle}</p>
      <hr />
      <h3>Detalhes da Reserva:</h3>
      <ul>
        <li><strong>Check-in:</strong> ${fmt(checkin)}</li>
        <li><strong>Check-out:</strong> ${fmt(checkout)}</li>
        <li><strong>Adultos:</strong> ${adults}</li>
        <li><strong>Menores:</strong> ${minors}</li>
        ${agesStr ? `<li><strong>${agesStr}</strong></li>` : ''}
      </ul>
      <p><small>Enviado automaticamente pelo sistema AluguelFamiliar.</small></p>
    `;

    // Send Mail
    await transporter.sendMail({
      from: '"AluguelFamiliar Sistema" <saadkmauricio@gmail.com>',
      to: 'saadkmauricio@gmail.com, contatoguisaad@gmail.com',
      subject: subject,
      html: htmlBody,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Email sending error:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}
