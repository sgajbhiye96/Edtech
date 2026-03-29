export default function Hero2() {
  return (
    <section className="bg-gray-100 dark:bg-gray-900 py-20">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">

        <div className="animate-slideLeft opacity-0" style={{ animationDelay: "0.3s" }}>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            Learn Full‑Stack Development from Zero to Hero.
          </h1>

          <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg">
            Gain hands-on experience building real startup-level applications.
            Learn at your own pace, on any device.
          </p>

          <Link
            to="/courses"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
          >
            Start Learning
          </Link>
        </div>

        <img
          src="https://cdn3d.iconscout.com/3d/premium/thumb/programming-3d-illustration-download-in-png-blend-fbx-gltf-file-formats--computer-code-developer-browsers-website-pack-people-illustrations-5727473.png"
          alt="Hero Illustration"
          className="w-full animate-scaleUp opacity-0"
          style={{ animationDelay: "0.5s" }}
        />
      </div>
    </section>
  );
}