"use client";

import type { Metadata } from "next";

// export const metadata: Metadata = {
//   title: "Brick games",
//   description: "Amazing bricks games",
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          src="https://telegram.org/js/telegram-web-app.js"
          async
        ></script>
      </head>
      <body onContextMenu={() => false}>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
