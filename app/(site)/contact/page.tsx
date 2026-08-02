import { ContactForm } from "@/components/ContactForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact the json. team with questions or feedback.",
};

export default function ContactPage() {
  return (
    <article className="mx-auto max-w-[700px] px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight">Contact</h1>
      <p className="mt-3 text-text-muted">
        Questions, feedback, or partnership ideas? Send a message — we read
        every note. Please do not paste sensitive JSON or secrets here.
      </p>
      <ContactForm />
    </article>
  );
}
