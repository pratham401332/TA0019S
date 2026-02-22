export default function Hero() {
  return (
    <div className="relative flex flex-col items-center mt-12 px-6 text-center">

      {/* Floating Background Blobs (Non-clickable) */}
      <div className="absolute top-40 left-20 w-32 h-32 bg-teal-300 rounded-full opacity-30 blur-2xl pointer-events-none"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-300 rounded-full opacity-30 blur-2xl pointer-events-none"></div>

      <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
        Intent-Based Alumni Networking
      </h2>

      <p className="text-gray-600 mb-10 max-w-xl">
        Verified. Willing. Compatible. WarmConnect builds meaningful bridges
        between students and alumni through intelligent matching.
      </p>

      <div className="bg-white/70 backdrop-blur-lg shadow-[0_20px_60px_rgba(0,0,0,0.2)] rounded-3xl w-[380px] p-6 border-4 border-gray-800 hover:scale-105 hover:-translate-y-2 transition-all duration-500">

        <div className="text-center font-bold text-lg mb-5">
          STUDENT HUB
        </div>

        {/* Student Preview Card */}
        <div className="bg-teal-100 rounded-xl p-4 mb-4 shadow">
          <h3 className="font-semibold text-gray-700">
            Student Profile
          </h3>
          <p className="text-sm text-gray-600">
            Skills: React, Node, DSA
          </p>
          <p className="text-sm text-gray-600">
            Goal: Internship
          </p>
        </div>

        {/* Alumni Preview Card */}
        <div className="bg-blue-100 rounded-xl p-4 shadow">
          <h3 className="font-semibold text-gray-700">
            Alumni Match
          </h3>
          <p className="text-sm text-gray-600">
            Industry: Software
          </p>

          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-teal-500 h-3 rounded-full transition-all duration-1000 animate-pulse"
                style={{ width: "82%" }}
              ></div>
            </div>
            <p className="text-teal-600 font-bold mt-2">
              Compatibility: 82%
            </p>
          </div>
        </div>

        <button className="mt-6 w-full bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition">
          Build Your Career Path
        </button>

      </div>
    </div>
  );
}