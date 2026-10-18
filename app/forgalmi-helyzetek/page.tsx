import type { Metadata } from "next";
import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import { getPublicContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Forgalmi Labor | Prémium Autósiskola",
  description: "166 interaktív forgalmi helyzet témakörök, animációk és részletes megoldások szerint.",
};

export default async function TrafficSituationsPage() {
  const content = await getPublicContent();

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#0b1426] px-2 pb-8 pt-24 sm:px-4 lg:px-6">
        <div className="mx-auto max-w-[1600px] overflow-hidden rounded-2xl border border-white/10 bg-[#0b1426] shadow-2xl shadow-black/30">
          <iframe
            src="/forgalmi-labor/index.html?v=20261016-50"
            title="Prémium Autósiskola – Forgalmi Labor"
            className="block h-[1350px] w-full border-0 md:h-[960px]"
            allowFullScreen
          />
        </div>
      </main>
      <Footer settings={content.settings} />
    </>
  );
}
