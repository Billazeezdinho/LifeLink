const welcomeMail = (fullName, link) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Welcome to LifeLink</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: #f0f4f8;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 0 15px rgba(0,0,0,0.1);
        }
        .header {
          background: linear-gradient(135deg, #0077b6, #e63946);
          color: #ffffff;
          text-align: center;
          padding: 40px 20px;
        }
        .header h1 {
          margin: 0;
          font-size: 30px;
          font-weight: 600;
        }
        .content {
          padding: 30px 25px;
          text-align: center;
        }
        .content h2 {
          color: #1e3a8a;
          margin-bottom: 12px;
          font-size: 22px;
        }
        .content p {
          color: #333;
          font-size: 16px;
          line-height: 1.7;
        }
        .button-wrapper {
          margin-top: 25px;
          text-align: center;
        }
        .cta-button {
          display: inline-block;
          padding: 14px 30px;
          background: linear-gradient(to right, #0077b6, #e63946);
          color: #fff;
          text-decoration: none;
          font-weight: 600;
          border-radius: 6px;
          transition: background 0.3s ease;
          font-size: 16px;
        }
        .cta-button:hover {
          background: linear-gradient(to right, #005f87, #c5303f);
        }
        .footer {
          text-align: center;
          font-size: 14px;
          color: #888;
          padding: 20px;
          background-color: #f7f9fb;
        }
        @media (max-width: 600px) {
          .cta-button {
            display: block;
            width: 90%;
            margin: 0 auto;
            font-size: 18px;
            padding: 16px;
          }
          .content h2 {
            font-size: 20px;
          }
          .content p {
            font-size: 15px;
          }
          .header h1 {
            font-size: 26px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to LifeLink🌹</h1>
        </div>
        <div class="content">
          <h2>Hello, ${fullName} 👋</h2>
          <p>
            Welcome to <strong>LifeLink</strong>! We're thrilled to have you join our life-saving community of donors.
          </p>
          <p>
            To complete your registration and start making a difference, please verify your email address by clicking the button below.
          </p>
          <div class="button-wrapper">
            <a href="${link}" class="cta-button" target="_blank" rel="noopener noreferrer">Verify Your Account</a>
          </div>
          <p style="margin-top: 20px; font-size: 14px; color: #555;">
            If you did not sign up for LifeLink, please ignore this email.
          </p>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} 🌹LifeLink. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;
};

module.exports = welcomeMail;
