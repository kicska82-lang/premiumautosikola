import "@fontsource/manrope/latin.css";
import "./globals.css";
import PrivacyNotice from "./components/PrivacyNotice";

export const metadata = {
  title: {
    default: "Prémium Autósiskola Nyíregyháza",
    template: "%s | Prémium Autósiskola",
  },
  description:
    "Prémium Autósiskola Nyíregyházán. B kategóriás jogosítvány, modern oktatás, kiváló oktatók.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hu">
      <body className="min-h-screen font-sans bg-white text-slate-900 antialiased">
        {children}
        <PrivacyNotice />
      </body>
    </html>
  );
}
