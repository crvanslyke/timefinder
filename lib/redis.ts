import { Redis } from "@upstash/redis";

if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
  throw new Error(
    "KV_REST_API_URL and KV_REST_API_TOKEN must be defined in environment variables"
  );
}

export const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

// Types
export interface TimeSlot {
  id: string;
  dateTime: string; // ISO 8601 UTC string
}

export interface Participant {
  name: string;
  selectedSlots: string[]; // Array of TimeSlot IDs
  timestamp: string; // When they responded
}

export interface Poll {
  id: string;
  title: string;
  description?: string;
  timeSlots: TimeSlot[];
  participants: Participant[];
  createdAt: string;
  expiresAt: string; // 14 days from creation
}

// Helper functions
export async function createPoll(poll: Omit<Poll, "id" | "createdAt" | "expiresAt" | "participants">): Promise<Poll> {
  const id = generateId();
  const createdAt = new Date().toISOString();
  const expiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(); // 14 days

  const newPoll: Poll = {
    id,
    ...poll,
    participants: [],
    createdAt,
    expiresAt,
  };

  // Store with TTL of 14 days (in seconds)
  await redis.setex(`poll:${id}`, 14 * 24 * 60 * 60, JSON.stringify(newPoll));

  return newPoll;
}

export async function getPoll(id: string): Promise<Poll | null> {
  const data = await redis.get<string>(`poll:${id}`);
  if (!data) return null;
  return JSON.parse(data);
}

export async function addParticipant(pollId: string, participant: Participant): Promise<Poll | null> {
  const poll = await getPoll(pollId);
  if (!poll) return null;

  // Add or update participant
  const existingIndex = poll.participants.findIndex(p => p.name === participant.name);
  if (existingIndex >= 0) {
    poll.participants[existingIndex] = participant;
  } else {
    poll.participants.push(participant);
  }

  // Calculate remaining TTL
  const ttl = await redis.ttl(`poll:${pollId}`);
  if (ttl > 0) {
    await redis.setex(`poll:${pollId}`, ttl, JSON.stringify(poll));
  } else {
    await redis.setex(`poll:${pollId}`, 14 * 24 * 60 * 60, JSON.stringify(poll));
  }

  return poll;
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
