import type { Metadata } from "next";
import MobileAppPrototype from "./MobileAppPrototype";

export const metadata: Metadata = {
  title: "Mobilalkalmazás prototípus",
  description: "A Prémium Autósiskola tanulói mobilalkalmazásának első működő prototípusa.",
  manifest: "/mobilapp.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Prémium Autósiskola",
    statusBarStyle: "black-translucent",
  },
};

export default function MobileAppPrototypePage() {
  return <MobileAppPrototype />;
}
