"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

interface SavedPoll {
  id: string;
  title: string;
  createdAt: string;
}

export default function MyPolls() {
  const [polls, setPolls] = useState<SavedPoll[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPolls();
  }, []);

  const loadPolls = () => {
    try {
      const saved = localStorage.getItem("myPolls");
      if (saved) {
        const parsedPolls = JSON.parse(saved);
        // Sort by creation date, newest first
        parsedPolls.sort((a: SavedPoll, b: SavedPoll) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setPolls(parsedPolls);
      }
    } catch (error) {
      console.error("Error loading polls:", error);
    } finally {
      setLoading(false);
    }
  };

  const deletePoll = (pollId: string) => {
    if (confirm("Remove this poll from your list? (This won't delete the poll itself)")) {
      const updated = polls.filter(p => p.id !== pollId);
      localStorage.setItem("myPolls", JSON.stringify(updated));
      setPolls(updated);
    }
  };

  const clearAll = () => {
    if (confirm("Clear all polls from your list?")) {
      localStorage.removeItem("myPolls");
      setPolls([]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-xl text-gray-600 dark:text-gray-300">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              My Polls
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Polls you&apos;ve created on this device
            </p>
          </div>
          <Link
            href="/"
            className="text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            ← Back to Home
          </Link>
        </div>

        {polls.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              No polls yet
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Create your first poll to see it here
            </p>
            <Link
              href="/create"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Create a Poll
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-4 flex justify-between items-center">
              <p className="text-gray-600 dark:text-gray-300">
                {polls.length} {polls.length === 1 ? "poll" : "polls"} saved
              </p>
              {polls.length > 0 && (
                <button
                  onClick={clearAll}
                  className="text-red-600 dark:text-red-400 hover:underline text-sm"
                >
                  Clear All
                </button>
              )}
            </div>

            <div className="space-y-4">
              {polls.map((poll) => (
                <div
                  key={poll.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {poll.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        Created {dayjs(poll.createdAt).fromNow()}
                      </p>

                      <div className="flex gap-3 flex-wrap">
                        <Link
                          href={`/poll/${poll.id}`}
                          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                        >
                          👥 Vote
                        </Link>
                        <Link
                          href={`/poll/${poll.id}/results`}
                          className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                        >
                          📊 Results
                        </Link>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(
                              `${window.location.origin}/poll/${poll.id}`
                            );
                            alert("Link copied to clipboard!");
                          }}
                          className="inline-flex items-center gap-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-4 py-2 rounded-lg transition-colors text-sm"
                        >
                          📋 Copy Link
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => deletePoll(poll.id)}
                      className="ml-4 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      title="Remove from list"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <Link
                href="/create"
                className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                + Create Another Poll
              </Link>
            </div>
          </>
        )}

        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Note:</strong> Polls are saved in your browser&apos;s local storage.
            If you clear your browser data or use a different device, you won&apos;t see these polls.
            Bookmark important poll links to access them from anywhere!
          </p>
        </div>
      </div>
    </div>
  );
}
