// utils/emailTemplate.ts

export function generateEmailTemplate(text: string): string {
    return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Email</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <style>
        body {
          margin: 0;
          padding: 0;
          background-color: #f4f4f4;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        .container {
          max-width: 600px;
          margin: 30px auto;
          background: #fff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }
        .header {
          background: #007acc;
          color: white;
          padding: 20px;
          text-align: center;
        }
        .body {
          padding: 30px;
          font-size: 16px;
          line-height: 1.6;
          color: #333;
          white-space: pre-line;
        }
        .footer {
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: #888;
          background: #f1f1f1;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Jakuan Ahmed</h2>
        </div>
        <div class="body">
          ${text}
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} Jakuan Ahmed. All rights reserved.<br/>
          This is an ruebzj message. Please do reply.
        </div>
      </div>
    </body>
  </html>
  `;
}
  