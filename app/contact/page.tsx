import { Instagram, MessageCircle, Phone, Mail } from "lucide-react";
import BackLink from "../../components/BackLink";
import { buildPageMetadata } from "../../lib/seo";

export const metadata = buildPageMetadata({
  title: "Contact Mirai.lk",
  description:
    "Chat with Mirai.lk about electronics orders, service engagements, and support via phone, email, or WhatsApp.",
  path: "/contact",
  keywords: [
    "Mirai.lk contact",
    "Mirai Electronics phone number",
    "Mirai support Sri Lanka",
  ],
});

function sanitizeForTel(value: string) {
  return value.replace(/[^+\d]/g, "");
}

function sanitizeForWa(value: string) {
  return value.replace(/[^+\d]/g, "").replace(/^\+/, "");
}

export default function ContactPage() {
  const EMAIL = "miraibits.electronics@gmail.com";
  const PHONE = process.env.COMPANY_PHONE || "+94726604751";
  const PHONE_DISPLAY = process.env.COMPANY_PHONE_DISPLAY || "072 660 4751";
  const WHATSAPP = process.env.COMPANY_WHATSAPP || "+94726604751";
  const WHATSAPP_DISPLAY =
    process.env.COMPANY_WHATSAPP_DISPLAY || "072 660 4751";
  const INSTAGRAM =
    process.env.COMPANY_INSTAGRAM ||
    "https://www.instagram.com/miraielectronics/";

  const phoneHref = `tel:${sanitizeForTel(PHONE)}`;
  const whatsappHref = `https://wa.me/${sanitizeForWa(WHATSAPP)}`;
  const emailHref = `mailto:${EMAIL}`;

  return (
    <main className="container-px mx-auto max-w-6xl pb-16 pt-10">
      <BackLink
        href="/"
        ariaLabel="Go back to the home page"
        className="mb-8"
      />
      <section className="max-w-2xl space-y-10">
        <header className="space-y-3">
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 md:text-4xl">
            Contact us
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-300">
            We’re here to help with sourcing, custom projects, orders, and technical support. Reach out through the channel that suits you best.
          </p>
        </header>

        <div className="divide-y divide-gray-200 overflow-hidden rounded-2xl border border-gray-200 bg-white/70 shadow-sm dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900/70">
          <a
            href={phoneHref}
            className="flex items-start gap-4 px-6 py-5 transition hover:bg-gray-50 dark:hover:bg-gray-900/40"
          >
            <span className="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-red-500/10 text-red-500 dark:bg-red-500/15 dark:text-red-300">
              <Phone className="h-4 w-4" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400">
                Call
              </p>
              <p className="mt-1 text-lg font-medium text-gray-900 dark:text-gray-100">
                {PHONE_DISPLAY}
              </p>
            </div>
          </a>

          <a
            href={whatsappHref}
            className="flex items-start gap-4 px-6 py-5 transition hover:bg-gray-50 dark:hover:bg-gray-900/40"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300">
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400">
                WhatsApp
              </p>
              <p className="mt-1 text-lg font-medium text-gray-900 dark:text-gray-100">
                {WHATSAPP_DISPLAY}
              </p>
            </div>
          </a>

          <a
            href={emailHref}
            className="flex items-start gap-4 px-6 py-5 transition hover:bg-gray-50 dark:hover:bg-gray-900/40"
          >
            <span className="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300">
              <Mail className="h-4 w-4" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400">
                Email
              </p>
              <p className="mt-1 text-lg font-medium text-gray-900 dark:text-gray-100">
                {EMAIL}
              </p>
            </div>
          </a>
        </div>

        <footer className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-white/70 p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900/70">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e6443b]/10 text-[#e6443b] dark:bg-[#e6443b]/20 dark:text-[#f1918a]">
            <Instagram className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Follow our builds and releases
            </p>
            <a
              href={INSTAGRAM}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#e6443b] transition hover:underline dark:text-[#f1918a]"
            >
              @miraielectronics on Instagram
            </a>
          </div>
        </footer>
      </section>
    </main>
  );
}
