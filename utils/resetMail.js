const forgotPassword = (resetLink, fullName) => {
    const currentYear = new Date().getFullYear();
  
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>LifeLink Password Reset</title>
        <style>
            body {
                margin: 0;
                padding: 0;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #ffffff;
                color: #ffffff;
                height: 100vh; /* Full height of the viewport */
                display: flex;
                justify-content: center;
                align-items: center;
            }
  
            .container {
                max-width: 600px;
                width: 100%;
                background: #0a1f44; /* Dark Blue */
                border-radius: 15px;
                box-shadow: 0 8px 30px rgba(0,0,0,0.1);
                overflow: hidden;
                text-align: center;
                color: #ffffff;
            }
  
            .header {
                background: url('https://i.ibb.co/y4v5jHs/heart-bg.png') no-repeat center;
                background-size: cover;
                padding: 40px 20px;
                font-size: 26px;
                font-weight: bold;
                text-shadow: 1px 1px 5px rgba(0,0,0,0.3);
            }
  
            .content {
                padding: 30px 25px;
                font-size: 16px;
                line-height: 1.8;
                color: #ffffff;
                text-align: left;
            }
  
            .content p {
                margin-bottom: 15px;
            }
  
            .button-container {
                text-align: center;
                margin: 30px 0;
            }
  
            .button {
                display: inline-block;
                background: linear-gradient(135deg, #007bff, #ff4b5c);
                color: #ffffff;
                padding: 14px 30px;
                font-size: 16px;
                text-decoration: none;
                border-radius: 30px;
                font-weight: bold;
                transition: background 0.4s ease;
            }
  
            .button:hover {
                background: linear-gradient(135deg, #0056b3, #ff2e44);
            }
  
            .footer {
                padding: 15px;
                background-color: #091a3a;
                font-size: 14px;
                color: #cccccc;
                text-align: center;
                border-top: 1px solid #333;
            }
  
            /* Mobile responsiveness */
            @media screen and (max-width: 600px) {
                .header {
                    font-size: 22px;
                }
  
                .content {
                    font-size: 14px;
                    padding: 20px 15px;
                }
  
                .button {
                    padding: 12px 25px;
                    font-size: 14px;
                }
  
                .footer {
                    font-size: 12px;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                💙 LifeLink - Password Reset
            </div>
            <div class="content">
                <p>Hi <strong>${fullName}</strong>,</p>
                <p>We received a request to reset your password for your LifeLink account.</p>
                <p>Click the button below to securely reset your password:</p>
                <div class="button-container">
                    <a href="${resetLink}" class="button">Reset Password</a>
                </div>
                <p>If you didn't make this request, just ignore this email.</p>
                <p>This reset link will expire within 20 minutes.</p>
                <p>Thank you for being a part of our blood donor community! ❤️</p>
                <p>Warm regards,<br><strong>Team LifeLink ❤️</strong></p>
            </div>
            <div class="footer">
                &copy; ${currentYear} LifeLink ❤️. All rights reserved.
            </div>
        </div>
    </body>
    </html>
     `;
  };
  
  module.exports = forgotPassword;
  