"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
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
  timeSlots: TimeSlot[];
  participants: Participant[];
  createdAt: string;
  expiresAt: string;
}

interface SlotResult {
  slot: TimeSlot;
  availableCount: number;
  availableParticipants: string[];
  percentage: number;
}

export default function ResultsPage() {
  const params = useParams();
  const pollId = params.id as string;

  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(true);
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

  const calculateResults = (): SlotResult[] => {
    if (!poll) return [];

    return poll.timeSlots.map((slot) => {
      const availableParticipants = poll.participants
        .filter((p) => p.selectedSlots.includes(slot.id))
        .map((p) => p.name);

      return {
        slot,
        availableCount: availableParticipants.length,
        availableParticipants,
        percentage:
          poll.participants.length > 0
            ? (availableParticipants.length / poll.participants.length) * 100
            : 0,
      };
    }).sort((a, b) => b.availableCount - a.availableCount);
  };

  const copyLink = async () => {
    const url = window.location.origin + `/poll/${pollId}`;
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

  if (error || !poll) {
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

  const results = calculateResults();
  const bestSlots = results.filter(
    (r) => r.availableCount === results[0]?.availableCount && r.availableCount > 0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Results: {poll.title}
          </h1>
          {poll.description && (
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {poll.description}
            </p>
          )}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={copyLink}
              className="text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors"
            >
              {shareSuccess ? "✓ Copied!" : "📋 Share Poll"}
            </button>
            <Link
              href={`/poll/${pollId}`}
              className="text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              ✏️ Add Your Availability
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:p-8 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            📊 Summary
          </h2>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {poll.participants.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {poll.participants.length === 1 ? "Response" : "Responses"}
              </div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {poll.timeSlots.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Time {poll.timeSlots.length === 1 ? "Slot" : "Slots"}
              </div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {bestSlots.length > 0 ? bestSlots[0].availableCount : 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Best Availability
              </div>
            </div>
          </div>

          {poll.participants.length === 0 && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-yellow-800 dark:text-yellow-200">
              No responses yet. Share the poll link to get started!
            </div>
          )}
        </div>

        {poll.participants.length > 0 && (
          <>
            {bestSlots.length > 0 && (
              <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-500 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold text-green-800 dark:text-green-300 mb-3">
                  🎯 Best Time{bestSlots.length > 1 ? "s" : ""}
                </h3>
                <div className="space-y-2">
                  {bestSlots.map((result) => {
                    const localTime = dayjs.utc(result.slot.dateTime).tz(userTimezone);
                    return (
                      <div
                        key={result.slot.id}
                        className="bg-white dark:bg-gray-800 p-4 rounded-lg"
                      >
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {localTime.format("dddd, MMMM D, YYYY")} at {localTime.format("h:mm A")}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {result.availableParticipants.join(", ")}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:p-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                All Time Slots
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Your timezone: {userTimezone}
              </p>

              <div className="space-y-4">
                {results.map((result) => {
                  const localTime = dayjs.utc(result.slot.dateTime).tz(userTimezone);
                  const isBest = bestSlots.some((b) => b.slot.id === result.slot.id);

                  return (
                    <div
                      key={result.slot.id}
                      className={`border-2 rounded-lg p-4 ${
                        isBest
                          ? "border-green-500 bg-green-50 dark:bg-green-900/10"
                          : "border-gray-200 dark:border-gray-700"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {localTime.format("dddd, MMMM D, YYYY")}
                          </div>
                          <div className="text-gray-600 dark:text-gray-300">
                            {localTime.format("h:mm A")}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                            {result.availableCount}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {poll.participants.length === 1 ? "person" : "people"}
                          </div>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="mb-2">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-indigo-600 h-2 rounded-full transition-all"
                            style={{ width: `${result.percentage}%` }}
                          ></div>
                        </div>
                      </div>

                      {result.availableParticipants.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {result.availableParticipants.map((name, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm text-gray-700 dark:text-gray-300"
                            >
                              {name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                Participants ({poll.participants.length})
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {poll.participants.map((participant, idx) => (
                  <div
                    key={idx}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-3"
                  >
                    <div className="font-medium text-gray-900 dark:text-white">
                      {participant.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Available for {participant.selectedSlots.length} /{" "}
                      {poll.timeSlots.length} slots
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
