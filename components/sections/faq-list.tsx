import { faqs } from "@/lib/data/content";

export function FaqList() {
  return (
    <section className="section-shell pb-16 md:pb-24">
      <div className="grid gap-6 md:grid-cols-2">
        {faqs.map((faq) => (
          <div key={faq.question} className="rounded-[28px] border border-white/40 bg-white/70 p-6 shadow-soft dark:border-white/10 dark:bg-white/5">
            <h3 className="font-heading text-2xl">{faq.question}</h3>
            <p className="mt-3 text-sm leading-7 text-stone-600 dark:text-stone-300">{faq.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
