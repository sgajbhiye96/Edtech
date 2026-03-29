// CTA Section
export function CTASection() {
  return (
    <section className="py-20 bg-blue-700 text-white text-center">
      <h2 className="text-4xl font-bold mb-4">Start Learning Today</h2>
      <p className="text-lg mb-6">
        Join thousands of students growing their careers.
      </p>

      <a
        href="/register"
        className="px-7 py-3 bg-white text-blue-700 font-bold rounded-lg hover:bg-gray-200"
      >
        Create Free Account →
      </a>
    </section>
  );
}