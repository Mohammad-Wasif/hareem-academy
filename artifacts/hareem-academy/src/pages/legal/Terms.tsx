export default function Terms() {
  return (
    <div className="min-h-screen bg-background py-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="font-serif font-bold text-4xl text-primary mb-8">Terms of Service</h1>
        <div className="prose prose-stone dark:prose-invert">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h3>1. Acceptance of Terms</h3>
          <p>
            By enrolling in courses at Hareem Academy or using our website, you agree to comply with these Terms of Service. 
          </p>

          <h3>2. Female-Only Policy</h3>
          <p>
            Hareem Academy is strictly for girls and women. By enrolling, you confirm that the student attending the classes is female. Male relatives or individuals are not permitted to attend or sit in during live classes to respect the privacy of our teachers and other students.
          </p>

          <h3>3. Code of Conduct</h3>
          <p>
            Students are expected to maintain Islamic adab (etiquette) in classes and communications. Respect towards teachers and fellow students is mandatory. Disruptive behavior may result in removal from the course.
          </p>

          <h3>4. Course Fees & Payments</h3>
          <p>
            Fees are to be paid on a monthly basis or as agreed upon during enrollment. Continued access to classes depends on timely payment.
          </p>

          <h3>5. Intellectual Property</h3>
          <p>
            All course materials, PDFs, notes, and recordings provided by Hareem Academy are for personal use only. Sharing, reproducing, or reselling these materials without permission is strictly prohibited.
          </p>

          <h3>6. Modifications</h3>
          <p>
            We reserve the right to modify class schedules or these terms. Students will be notified of any significant changes.
          </p>
        </div>
      </div>
    </div>
  );
}
