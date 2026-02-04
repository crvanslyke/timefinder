import { Redis } from "@upstash/redis";

let redisInstance: Redis | null = null;

function getRedis(): Redis {
  if (!redisInstance) {
    if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
      throw new Error(
        "KV_REST_API_URL and KV_REST_API_TOKEN must be defined in environment variables"
      );
    }
    redisInstance = new Redis({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN,
    });
  }
  return redisInstance;
}

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
  duration: 30 | 60; // Duration in minutes (30 or 60)
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
  await getRedis().setex(`poll:${id}`, 14 * 24 * 60 * 60, newPoll);

  return newPoll;
}

export async function getPoll(id: string): Promise<Poll | null> {
  const data = await getRedis().get<Poll>(`poll:${id}`);
  if (!data) return null;
  return data;
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
  const ttl = await getRedis().ttl(`poll:${pollId}`);
  if (ttl > 0) {
    await getRedis().setex(`poll:${pollId}`, ttl, poll);
  } else {
    await getRedis().setex(`poll:${pollId}`, 14 * 24 * 60 * 60, poll);
  }

  return poll;
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
