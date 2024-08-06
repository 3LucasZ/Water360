// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "./global.css";

import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import Layout from "@/components/Layout";
import { Notifications } from "@mantine/notifications";

export const metadata = {
  title: "Water360",
  description: "Reliable 360 Camera Remote Control",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider>
          <Notifications />
          <Layout>{children}</Layout>
        </MantineProvider>
      </body>
    </html>
  );
}
