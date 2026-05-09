import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { loadPublicSiteContent } from "@/lib/site-content/load"

export const metadata: Metadata = {
  title: "Cancellation & Refund Policy | OfinIT Solutions",
  description:
    "Cancellation and refund terms for OfinIT Solutions services, retainers, and project engagements.",
}

export default async function CancelRefundPolicyPage() {
  const site = await loadPublicSiteContent()

  return (
    <>
      <Header content={site.header} />
      <main className="min-h-screen pt-16">
        <div className="container mx-auto max-w-3xl px-6 sm:px-8 py-12 sm:py-16">
          <p className="text-sm text-muted-foreground mb-2">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">Cancellation &amp; Refund Policy</span>
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">Cancellation &amp; Refund Policy</h1>
          <p className="text-sm text-muted-foreground mb-10">Last updated: {new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}</p>

          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-muted-foreground">
            <section>
              <h2 className="text-xl font-semibold text-foreground">1. Scope</h2>
              <p>
                This policy applies to fees paid to <strong className="text-foreground">OfinIT Solutions Pvt. Ltd.</strong>{" "}
                (&quot;OfinIT&quot;, &quot;we&quot;, &quot;us&quot;) for professional services, including but not limited
                to software development, design, consulting, support retainers, and related deliverables agreed in a
                written proposal, statement of work (SOW), or master services agreement (MSA).
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">2. Project-based work</h2>
              <p>
                Unless your contract states otherwise, project fees are generally milestone-based or phased. If you
                cancel after work has started:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>You remain responsible for fees for all work completed and accepted up to the cancellation date.</li>
                <li>
                  Any prepaid amount for milestones not yet started may be credited toward other OfinIT services within
                  twelve (12) months, or refunded at our discretion after deducting actual costs and non-recoverable
                  third-party expenses already incurred.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">3. Retainers &amp; subscriptions</h2>
              <p>
                Monthly or recurring retainers may be cancelled with written notice as specified in your agreement
                (typically thirty (30) days). Fees for the current billing period are generally non-refundable once the
                period has begun, except where required by law.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">4. Refunds</h2>
              <p>
                We do not offer blanket refunds for completed deliverables that meet the specifications agreed in
                writing. If you believe a deliverable materially fails the agreed acceptance criteria, you must notify us
                in writing within the review window stated in your contract (or within fourteen (14) days if none is
                stated). We will use commercially reasonable efforts to remedy qualifying issues.
              </p>
              <p>
                Refunds, if any, are limited to the fees directly attributable to the non-conforming portion of work,
                as determined in good faith after review. Deposits labeled non-refundable in your signed agreement are
                not refundable except where mandated by applicable law.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">5. Third-party costs</h2>
              <p>
                Licences, infrastructure, domains, stock assets, paid APIs, and similar pass-through costs are typically
                non-refundable once purchased on your behalf, subject to the vendor&apos;s own policies.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">6. Force majeure &amp; suspension</h2>
              <p>
                We may suspend or delay performance where necessary due to events outside our reasonable control. This
                policy does not limit remedies available to either party under the governing agreement or applicable law.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">7. How to request cancellation or a refund review</h2>
              <p>
                Email <a href="mailto:info@ofinit.com" className="text-primary hover:underline">info@ofinit.com</a> with
                your company name, contract or invoice reference, and a clear description of your request. We aim to
                acknowledge requests within five (5) business days.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">8. Changes</h2>
              <p>
                We may update this policy from time to time. The &quot;Last updated&quot; date at the top will change when
                revisions are published. Continued engagement with us after updates constitutes acceptance of the
                revised policy where permitted by law; your signed agreement still governs for specific commercial
                terms.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer content={site.footer} />
    </>
  )
}
