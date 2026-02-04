"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import Link from "next/link";

dayjs.extend(utc);
dayjs.extend(timezone);

interface TimeSlot {
  id: string;
  dateTime: string;
}

interface Participant {
  name: string;
  selectedSlots: string[];
  timestamp: string;
}

interface Poll {
  id: string;
  title: string;
  description?: string;
  duration: 30 | 60;
  timeSlots: TimeSlot[];
  participants: Participant[];
  createdAt: string;
  expiresAt: string;
}

export default function PollPage() {
  const params = useParams();
  const router = useRouter();
  const pollId = params.id as string;

  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [selectedSlots, setSelectedSlots] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [shareSuccess, setShareSuccess] = useState(false);

  const userTimezone = dayjs.tz.guess();

  const fetchPoll = useCallback(async () => {
    try {
      const response = await fetch(`/api/poll/${pollId}`);
      if (!response.ok) {
        throw new Error("Poll not found");
      }
      const data = await response.json();
      setPoll(data);
    } catch (err) {
      setError("Poll not found or has expired");
    } finally {
      setLoading(false);
    }
  }, [pollId]);

  useEffect(() => {
    fetchPoll();
  }, [fetchPoll]);

  // Check if user has already voted and pre-fill their selections
  useEffect(() => {
    if (poll && name.trim()) {
      const existingParticipant = poll.participants.find(
        p => p.name.toLowerCase() === name.trim().toLowerCase()
      );
      if (existingParticipant) {
        setSelectedSlots(new Set(existingParticipant.selectedSlots));
      }
    }
  }, [name, poll]);

  const toggleSlot = (slotId: string) => {
    const newSelected = new Set(selectedSlots);
    if (newSelected.has(slotId)) {
      newSelected.delete(slotId);
    } else {
      newSelected.add(slotId);
    }
    setSelectedSlots(newSelected);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }

    if (selectedSlots.size === 0) {
      setError("Please select at least one time slot");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/poll/${pollId}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          selectedSlots: Array.from(selectedSlots),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit response");
      }

      router.push(`/poll/${pollId}/results`);
    } catch (err) {
      setError("Failed to submit response. Please try again.");
      setIsSubmitting(false);
    }
  };

  const copyLink = async () => {
    const url = window.location.href;
    await navigator.clipboard.writeText(url);
    setShareSuccess(true);
    setTimeout(() => setShareSuccess(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-xl text-gray-600 dark:text-gray-300">Loading...</div>
      </div>
    );
  }

  if (error && !poll) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Error</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">{error}</p>
          <Link
            href="/"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {poll?.title}
          </h1>
          {poll?.description && (
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {poll.description}
            </p>
          )}
          <div className="flex gap-2">
            <button
              onClick={copyLink}
              className="text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors"
            >
              {shareSuccess ? "✓ Copied!" : "📋 Copy Link"}
            </button>
            <Link
              href={`/poll/${pollId}/results`}
              className="text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors"
            >
              📊 View Results
            </Link>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          {poll && poll.participants.length > 0 && (
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-blue-800 dark:text-blue-200">
              <p className="text-sm">
                <strong>Want to change your vote?</strong> Enter your name exactly as you did before to update your availability.
              </p>
            </div>
          )}

          <div className="mb-6">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Your Name *
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your first name or full name"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Your Available Times *
            </label>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Your timezone: {userTimezone}
            </p>

            <div className="space-y-2">
              {poll?.timeSlots.map((slot) => {
                const localTime = dayjs.utc(slot.dateTime).tz(userTimezone);
                const endTime = localTime.add(poll.duration || 60, 'minute');
                const isSelected = selectedSlots.has(slot.id);

                return (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => toggleSlot(slot.id)}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                      isSelected
                        ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20"
                        : "border-gray-300 dark:border-gray-600 hover:border-indigo-400"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {localTime.format("dddd, MMMM D, YYYY")}
                        </div>
                        <div className="text-gray-600 dark:text-gray-300">
                          {localTime.format("h:mm A")} - {endTime.format("h:mm A")}
                        </div>
                      </div>
                      <div
                        className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                          isSelected
                            ? "border-indigo-600 bg-indigo-600"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                      >
                        {isSelected && (
                          <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M5 13l4 4L19 7"></path>
                          </svg>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            {isSubmitting
              ? "Submitting..."
              : poll?.participants.some(p => p.name.toLowerCase() === name.trim().toLowerCase())
                ? "Update Availability"
                : "Submit Availability"}
          </button>

          {poll && poll.participants.some(p => p.name.toLowerCase() === name.trim().toLowerCase()) && (
            <p className="mt-2 text-sm text-blue-600 dark:text-blue-400 text-center">
              ℹ️ You&apos;ve already voted. Your response will be updated.
            </p>
          )}
        </form>

        {poll && poll.participants.length > 0 && (
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              {poll.participants.length} {poll.participants.length === 1 ? "person has" : "people have"} responded
            </h3>
            <div className="flex flex-wrap gap-2">
              {poll.participants.map((participant, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300"
                >
                  {participant.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
