function Home() {
  return (
    <div className="bg-gray-100 min-h-[90vh] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-3xl text-center">
        <h1 className="text-6xl font-bold mb-4">
          PrepGenius AI
        </h1>

        <p className="text-2xl text-gray-600 mb-6">
          AI-Powered Career Preparation Platform
        </p>

        <p className="text-gray-700">
          Analyze resumes, calculate ATS scores,
          identify skill gaps, and prepare for interviews.
        </p>
      </div>
    </div>
  );
}

export default Home;
