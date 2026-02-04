import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <main className="max-w-2xl w-full text-center">
        <h1 className="text-5xl font-bold mb-4 text-gray-900 dark:text-white">
          TimeFinder
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Find the perfect time for your meetings
        </p>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
            Get Started
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Create a poll with multiple time slots and share it with participants.
            Everyone selects their availability and you&apos;ll see the best times instantly.
          </p>

          <div className="flex gap-4 justify-center">
            <Link
              href="/create"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Create a Poll
            </Link>
            <Link
              href="/my-polls"
              className="inline-block bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              My Polls
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 text-left">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
            <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
              📅 Multiple Time Slots
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Propose multiple meeting times and let participants choose
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
            <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
              🌍 Timezone Support
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Automatic timezone conversion for global teams
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
            <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
              👥 Easy Sharing
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Share a simple link with all participants
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
