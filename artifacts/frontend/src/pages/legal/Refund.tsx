import { useWhatsApp } from "@/hooks/use-whatsapp";

export default function Refund() {
  const { whatsappNumber } = useWhatsApp();

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="font-serif font-bold text-4xl text-primary mb-8">Refund Policy</h1>
        <div className="prose prose-stone dark:prose-invert">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <p>
            We strive to provide the best learning experience at Hareem Academy. Please review our refund policy before enrolling.
          </p>

          <h3>1. Trial Classes</h3>
          <p>
            We highly recommend asking all your questions and clarifying doubts with our team via WhatsApp before making a payment. In some cases, we may offer a trial class to ensure the course meets your expectations.
          </p>

          <h3>2. Monthly Fees</h3>
          <p>
            Once a month has commenced and payment has been made, the fee for that month is generally non-refundable. If you wish to discontinue, please inform us before the start of the next billing cycle.
          </p>

          <h3>3. Exceptional Circumstances</h3>
          <p>
            If you are unable to continue classes due to severe medical or personal emergencies immediately after payment, please contact us. Refunds in such cases will be considered on a case-by-case basis at the discretion of the administration.
          </p>

          <h3>4. Course Cancellation</h3>
          <p>
            In the rare event that Hareem Academy has to cancel a batch or course entirely, a full refund for the remaining incomplete classes will be issued.
          </p>

          <h3>5. How to Request</h3>
          <p>
            To discuss payments or request a refund, please contact us directly via WhatsApp at {whatsappNumber}.
          </p>
        </div>
      </div>
    </div>
  );
}
