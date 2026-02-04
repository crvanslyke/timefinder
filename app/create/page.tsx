"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export default function CreatePoll() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [timeSlots, setTimeSlots] = useState<{ date: string; time: string }[]>([
    { date: "", time: "" },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const userTimezone = dayjs.tz.guess();

  const addTimeSlot = () => {
    setTimeSlots([...timeSlots, { date: "", time: "" }]);
  };

  const removeTimeSlot = (index: number) => {
    if (timeSlots.length > 1) {
      setTimeSlots(timeSlots.filter((_, i) => i !== index));
    }
  };

  const updateTimeSlot = (index: number, field: "date" | "time", value: string) => {
    const updated = [...timeSlots];
    updated[index][field] = value;
    setTimeSlots(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Please enter a poll title");
      return;
    }

    const validSlots = timeSlots.filter(slot => slot.date && slot.time);
    if (validSlots.length === 0) {
      setError("Please add at least one time slot");
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert local times to UTC
      const formattedSlots = validSlots.map((slot, index) => {
        const localDateTime = dayjs.tz(`${slot.date} ${slot.time}`, userTimezone);
        return {
          id: `slot-${index}`,
          dateTime: localDateTime.utc().toISOString(),
        };
      });

      const response = await fetch("/api/poll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || undefined,
          timeSlots: formattedSlots,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create poll");
      }

      const data = await response.json();
      router.push(`/poll/${data.id}`);
    } catch (err) {
      setError("Failed to create poll. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Create a Poll
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Set up time slots for your meeting and share the link with participants
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <div className="mb-6">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Poll Title *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Team Standup Meeting"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description (optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add any additional details..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Time Slots *
            </label>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Your timezone: {userTimezone}
            </p>

            <div className="space-y-3">
              {timeSlots.map((slot, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="date"
                    value={slot.date}
                    onChange={(e) => updateTimeSlot(index, "date", e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                  <input
                    type="time"
                    value={slot.time}
                    onChange={(e) => updateTimeSlot(index, "time", e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                  {timeSlots.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTimeSlot(index)}
                      className="px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addTimeSlot}
              className="mt-3 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium text-sm"
            >
              + Add Time Slot
            </button>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              {isSubmitting ? "Creating..." : "Create Poll"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/")}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
