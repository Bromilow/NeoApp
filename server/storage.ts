import {
  users,
  creatorProfiles,
  media,
  messages,
  type User,
  type UpsertUser,
  type CreatorProfile,
  type InsertCreatorProfile,
  type Media,
  type InsertMedia,
  type Message,
  type InsertMessage,
  type UserWithProfile,
  type CreatorProfileWithMedia,
  type MessageWithUsers,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or, like, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  getUserWithProfile(id: string): Promise<UserWithProfile | undefined>;
  
  // Creator Profile operations
  getCreatorProfile(userId: string): Promise<CreatorProfile | undefined>;
  createCreatorProfile(profile: InsertCreatorProfile): Promise<CreatorProfile>;
  updateCreatorProfile(userId: string, updates: Partial<InsertCreatorProfile>): Promise<CreatorProfile>;
  getAllCreators(filters?: {
    search?: string;
    hairColor?: string;
    location?: string;
    tags?: string[];
  }): Promise<CreatorProfileWithMedia[]>;
  getCreatorById(id: string): Promise<CreatorProfileWithMedia | undefined>;
  incrementProfileViews(creatorId: string): Promise<void>;
  
  // Media operations
  createMedia(mediaData: InsertMedia): Promise<Media>;
  getCreatorMedia(creatorId: string): Promise<Media[]>;
  deleteMedia(id: string, creatorId: string): Promise<void>;
  
  // Message operations
  createMessage(message: InsertMessage): Promise<Message>;
  getUserMessages(userId: string): Promise<MessageWithUsers[]>;
  getConversation(userId1: string, userId2: string): Promise<MessageWithUsers[]>;
  markMessageAsRead(messageId: string, userId: string): Promise<void>;
  getUnreadMessageCount(userId: string): Promise<number>;
}

export class DatabaseStorage implements IStorage {
  // User operations (required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getUserWithProfile(id: string): Promise<UserWithProfile | undefined> {
    const result = await db
      .select()
      .from(users)
      .leftJoin(creatorProfiles, eq(users.id, creatorProfiles.userId))
      .where(eq(users.id, id));

    if (result.length === 0) return undefined;

    const user = result[0].users;
    const profile = result[0].creator_profiles;

    return {
      ...user,
      creatorProfile: profile || undefined,
    };
  }

  // Creator Profile operations
  async getCreatorProfile(userId: string): Promise<CreatorProfile | undefined> {
    const [profile] = await db
      .select()
      .from(creatorProfiles)
      .where(eq(creatorProfiles.userId, userId));
    return profile;
  }

  async createCreatorProfile(profile: InsertCreatorProfile): Promise<CreatorProfile> {
    const [newProfile] = await db
      .insert(creatorProfiles)
      .values(profile)
      .returning();
    return newProfile;
  }

  async updateCreatorProfile(userId: string, updates: Partial<InsertCreatorProfile>): Promise<CreatorProfile> {
    const [updatedProfile] = await db
      .update(creatorProfiles)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(creatorProfiles.userId, userId))
      .returning();
    return updatedProfile;
  }

  async getAllCreators(filters?: {
    search?: string;
    hairColor?: string;
    location?: string;
    tags?: string[];
  }): Promise<CreatorProfileWithMedia[]> {
    let whereConditions = [eq(creatorProfiles.isActive, true)];

    if (filters?.search) {
      whereConditions.push(
        or(
          like(creatorProfiles.displayName, `%${filters.search}%`),
          like(users.firstName, `%${filters.search}%`),
          like(users.lastName, `%${filters.search}%`)
        )!
      );
    }

    if (filters?.hairColor) {
      whereConditions.push(eq(creatorProfiles.hairColor, filters.hairColor));
    }

    if (filters?.location) {
      whereConditions.push(like(creatorProfiles.location, `%${filters.location}%`));
    }

    const results = await db
      .select()
      .from(creatorProfiles)
      .innerJoin(users, eq(creatorProfiles.userId, users.id))
      .leftJoin(media, eq(creatorProfiles.id, media.creatorId))
      .where(and(...whereConditions))
      .orderBy(desc(creatorProfiles.createdAt));

    // Group results by creator
    const creatorsMap = new Map<string, CreatorProfileWithMedia>();
    
    for (const row of results) {
      const profile = row.creator_profiles;
      const user = row.users;
      const mediaItem = row.media;

      if (!creatorsMap.has(profile.id)) {
        creatorsMap.set(profile.id, {
          ...profile,
          user,
          media: mediaItem ? [mediaItem] : [],
        });
      } else if (mediaItem) {
        creatorsMap.get(profile.id)!.media.push(mediaItem);
      }
    }

    return Array.from(creatorsMap.values());
  }

  async getCreatorById(id: string): Promise<CreatorProfileWithMedia | undefined> {
    const results = await db
      .select()
      .from(creatorProfiles)
      .innerJoin(users, eq(creatorProfiles.userId, users.id))
      .leftJoin(media, eq(creatorProfiles.id, media.creatorId))
      .where(eq(creatorProfiles.id, id));

    if (results.length === 0) return undefined;

    const profile = results[0].creator_profiles;
    const user = results[0].users;
    const mediaItems = results.map(row => row.media).filter(Boolean) as Media[];

    return {
      ...profile,
      user,
      media: mediaItems,
    };
  }

  async incrementProfileViews(creatorId: string): Promise<void> {
    await db
      .update(creatorProfiles)
      .set({ 
        profileViews: sql`${creatorProfiles.profileViews} + 1` 
      })
      .where(eq(creatorProfiles.id, creatorId));
  }

  // Media operations
  async createMedia(mediaData: InsertMedia): Promise<Media> {
    const [newMedia] = await db
      .insert(media)
      .values(mediaData)
      .returning();
    return newMedia;
  }

  async getCreatorMedia(creatorId: string): Promise<Media[]> {
    return await db
      .select()
      .from(media)
      .where(eq(media.creatorId, creatorId))
      .orderBy(desc(media.uploadedAt));
  }

  async deleteMedia(id: string, creatorId: string): Promise<void> {
    await db
      .delete(media)
      .where(and(eq(media.id, id), eq(media.creatorId, creatorId)));
  }

  // Message operations
  async createMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db
      .insert(messages)
      .values(message)
      .returning();
    return newMessage;
  }

  async getUserMessages(userId: string): Promise<MessageWithUsers[]> {
    const results = await db
      .select()
      .from(messages)
      .innerJoin(users, eq(messages.senderId, users.id))
      .where(
        or(
          eq(messages.senderId, userId),
          eq(messages.recipientId, userId)
        )
      )
      .orderBy(desc(messages.createdAt));

    return results.map(row => ({
      ...row.messages,
      sender: row.users,
      recipient: row.users, // This will need to be corrected with proper joins
    }));
  }

  async getConversation(userId1: string, userId2: string): Promise<MessageWithUsers[]> {
    const results = await db
      .select({
        message: messages,
        sender: users,
      })
      .from(messages)
      .innerJoin(users, eq(messages.senderId, users.id))
      .where(
        or(
          and(eq(messages.senderId, userId1), eq(messages.recipientId, userId2)),
          and(eq(messages.senderId, userId2), eq(messages.recipientId, userId1))
        )
      )
      .orderBy(messages.createdAt);

    // Get recipient info for each message
    const messagesWithUsers: MessageWithUsers[] = [];
    for (const row of results) {
      const recipientResult = await db
        .select()
        .from(users)
        .where(eq(users.id, row.message.recipientId));
      
      messagesWithUsers.push({
        ...row.message,
        sender: row.sender,
        recipient: recipientResult[0],
      });
    }

    return messagesWithUsers;
  }

  async markMessageAsRead(messageId: string, userId: string): Promise<void> {
    await db
      .update(messages)
      .set({ isRead: true })
      .where(
        and(
          eq(messages.id, messageId),
          eq(messages.recipientId, userId)
        )
      );
  }

  async getUnreadMessageCount(userId: string): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(messages)
      .where(
        and(
          eq(messages.recipientId, userId),
          eq(messages.isRead, false)
        )
      );

    return result[0]?.count || 0;
  }
}

export const storage = new DatabaseStorage();
