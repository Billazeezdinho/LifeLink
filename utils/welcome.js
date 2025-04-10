const welcomeMail = (fullName) => {
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
        .cta-button {
          display: inline-block;
          margin-top: 25px;
          padding: 14px 30px;
          background: linear-gradient(to right, #0077b6, #e63946);
          color: #fff;
          text-decoration: none;
          font-weight: 600;
          border-radius: 6px;
          transition: background 0.3s ease;
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
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to LifeLink</h1>
        </div>
        <div class="content">
          <h2>Hello, ${fullName} 👋</h2>
          <p>
            We’re excited to welcome you to <strong>LifeLink</strong> – where compassion meets action. As a donor, you’re part of something life-changing.
          </p>
          <p>
            Log in anytime to schedule donations, connect with hospitals, and help save lives.
          </p>
          <a href="https://lifelink.org/login" class="cta-button">Get Started</a>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} LifeLink. All rights reserved.
        </div>
      </div>
    </body>
    </html>
    `;
  };
  
  module.exports = welcomeMail;
  