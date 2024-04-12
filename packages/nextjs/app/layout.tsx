import "@rainbow-me/rainbowkit/styles.css";
import { Metadata } from "next";
import { ScaffoldEthAppWithProviders } from "~~/components/ScaffoldEthAppWithProviders";
import { ThemeProvider } from "~~/components/ThemeProvider";
import "~~/styles/globals.css";

const baseUrl = "https://www.digitalshirtlounge.com/";
// process.env.NEXT_PUBLIC_VERCEL_URL
//   ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
//   : `http://localhost:${process.env.PORT}`;
const imageUrl = `${baseUrl}/album.gif`;

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "AARCAUDIO",
    template: "%s | AARCAUDIO",
  },
  description: "THE DIGITAL SHIRT LOUNGE",
  openGraph: {
    title: {
      default: "AARCAUDIO",
      template: "%s | AARCAUDIO",
    },
    description: "THE DIGITAL SHIRT LOUNGE",
    images: [
      {
        url: imageUrl,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [imageUrl],
    title: {
      default: "AARCAUDIO",
      template: "%s | AARCAUDIO",
    },
    description: "THE DIGITAL SHIRT LOUNGE",
  },
  icons: {
    icon: [{ url: "/aarcaudio/logo.jpg", sizes: "32x32", type: "image/jpg" }],
  },
};

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <html suppressHydrationWarning>
      <body>
        <ThemeProvider enableSystem>
          <ScaffoldEthAppWithProviders>{children}</ScaffoldEthAppWithProviders>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default ScaffoldEthApp;
