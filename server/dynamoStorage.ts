import { PutCommand, GetCommand, UpdateCommand, DeleteCommand, QueryCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoClient, TABLES } from './dynamodb';
import { nanoid } from 'nanoid';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  role: 'creator' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface CreatorProfile {
  id: string;
  userId: string;
  bio?: string;
  location?: string;
  hairColor?: string;
  eyeColor?: string;
  height?: string;
  measurements?: string;
  experience?: string;
  portfolio?: string[];
  profileViews: number;
  createdAt: string;
  updatedAt: string;
}

export interface Media {
  id: string;
  creatorId: string;
  type: 'image' | 'video';
  url: string;
  title?: string;
  description?: string;
  tags?: string[];
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export class DynamoStorage {
  // User operations
  async upsertUser(userData: Partial<User>): Promise<User> {
    const now = new Date().toISOString();
    const user: User = {
      id: userData.id || nanoid(),
      email: userData.email || '',
      firstName: userData.firstName,
      lastName: userData.lastName,
      profileImageUrl: userData.profileImageUrl,
      role: userData.role || 'creator',
      createdAt: userData.createdAt || now,
      updatedAt: now,
    };

    await dynamoClient.send(new PutCommand({
      TableName: TABLES.USERS,
      Item: user,
    }));

    return user;
  }

  async getUser(userId: string): Promise<User | null> {
    const result = await dynamoClient.send(new GetCommand({
      TableName: TABLES.USERS,
      Key: { id: userId },
    }));

    return result.Item as User || null;
  }

  async getUserWithProfile(userId: string): Promise<User & { profile?: CreatorProfile } | null> {
    const user = await this.getUser(userId);
    if (!user) return null;

    const profile = await this.getCreatorProfile(userId);
    return { ...user, profile };
  }

  // Creator Profile operations
  async createCreatorProfile(profileData: Partial<CreatorProfile>): Promise<CreatorProfile> {
    const now = new Date().toISOString();
    const profile: CreatorProfile = {
      id: nanoid(),
      userId: profileData.userId || '',
      bio: profileData.bio,
      location: profileData.location,
      hairColor: profileData.hairColor,
      eyeColor: profileData.eyeColor,
      height: profileData.height,
      measurements: profileData.measurements,
      experience: profileData.experience,
      portfolio: profileData.portfolio,
      profileViews: 0,
      createdAt: now,
      updatedAt: now,
    };

    await dynamoClient.send(new PutCommand({
      TableName: TABLES.PROFILES,
      Item: profile,
    }));

    return profile;
  }

  async getCreatorProfile(userId: string): Promise<CreatorProfile | null> {
    const result = await dynamoClient.send(new GetCommand({
      TableName: TABLES.PROFILES,
      Key: { userId },
    }));

    return result.Item as CreatorProfile || null;
  }

  async updateCreatorProfile(userId: string, updates: Partial<CreatorProfile>): Promise<CreatorProfile | null> {
    const updateExpression: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {};

    Object.entries(updates).forEach(([key, value]) => {
      if (key !== 'id' && key !== 'userId' && key !== 'createdAt') {
        updateExpression.push(`#${key} = :${key}`);
        expressionAttributeNames[`#${key}`] = key;
        expressionAttributeValues[`:${key}`] = value;
      }
    });

    updateExpression.push('#updatedAt = :updatedAt');
    expressionAttributeNames['#updatedAt'] = 'updatedAt';
    expressionAttributeValues[':updatedAt'] = new Date().toISOString();

    const result = await dynamoClient.send(new UpdateCommand({
      TableName: TABLES.PROFILES,
      Key: { userId },
      UpdateExpression: `SET ${updateExpression.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW',
    }));

    return result.Attributes as CreatorProfile || null;
  }

  async getAllCreators(filters: { search?: string; hairColor?: string; location?: string } = {}): Promise<CreatorProfile[]> {
    const result = await dynamoClient.send(new ScanCommand({
      TableName: TABLES.PROFILES,
    }));

    let creators = result.Items as CreatorProfile[] || [];

    // Apply filters
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      creators = creators.filter(creator => 
        creator.bio?.toLowerCase().includes(searchLower) ||
        creator.location?.toLowerCase().includes(searchLower)
      );
    }

    if (filters.hairColor) {
      creators = creators.filter(creator => 
        creator.hairColor?.toLowerCase() === filters.hairColor?.toLowerCase()
      );
    }

    if (filters.location) {
      creators = creators.filter(creator => 
        creator.location?.toLowerCase().includes(filters.location?.toLowerCase() || '')
      );
    }

    return creators;
  }

  async incrementProfileViews(profileId: string): Promise<void> {
    await dynamoClient.send(new UpdateCommand({
      TableName: TABLES.PROFILES,
      Key: { userId: profileId },
      UpdateExpression: 'SET profileViews = profileViews + :inc',
      ExpressionAttributeValues: { ':inc': 1 },
    }));
  }

  // Media operations
  async createMedia(mediaData: Partial<Media>): Promise<Media> {
    const now = new Date().toISOString();
    const media: Media = {
      id: nanoid(),
      creatorId: mediaData.creatorId || '',
      type: mediaData.type || 'image',
      url: mediaData.url || '',
      title: mediaData.title,
      description: mediaData.description,
      tags: mediaData.tags,
      createdAt: now,
    };

    await dynamoClient.send(new PutCommand({
      TableName: TABLES.MEDIA,
      Item: media,
    }));

    return media;
  }

  async getCreatorMedia(creatorId: string): Promise<Media[]> {
    const result = await dynamoClient.send(new QueryCommand({
      TableName: TABLES.MEDIA,
      IndexName: 'CreatorIdIndex', // You'll need to create this GSI
      KeyConditionExpression: 'creatorId = :creatorId',
      ExpressionAttributeValues: { ':creatorId': creatorId },
    }));

    return result.Items as Media[] || [];
  }

  async deleteMedia(mediaId: string, creatorId: string): Promise<void> {
    await dynamoClient.send(new DeleteCommand({
      TableName: TABLES.MEDIA,
      Key: { id: mediaId },
      ConditionExpression: 'creatorId = :creatorId',
      ExpressionAttributeValues: { ':creatorId': creatorId },
    }));
  }

  // Message operations
  async createMessage(messageData: Partial<Message>): Promise<Message> {
    const now = new Date().toISOString();
    const message: Message = {
      id: nanoid(),
      senderId: messageData.senderId || '',
      receiverId: messageData.receiverId || '',
      content: messageData.content || '',
      isRead: false,
      createdAt: now,
    };

    await dynamoClient.send(new PutCommand({
      TableName: TABLES.MESSAGES,
      Item: message,
    }));

    return message;
  }

  async getUserMessages(userId: string): Promise<Message[]> {
    const result = await dynamoClient.send(new QueryCommand({
      TableName: TABLES.MESSAGES,
      IndexName: 'UserIdIndex', // You'll need to create this GSI
      KeyConditionExpression: 'senderId = :userId OR receiverId = :userId',
      ExpressionAttributeValues: { ':userId': userId },
    }));

    return result.Items as Message[] || [];
  }

  async getConversation(userId1: string, userId2: string): Promise<Message[]> {
    const result = await dynamoClient.send(new QueryCommand({
      TableName: TABLES.MESSAGES,
      IndexName: 'ConversationIndex', // You'll need to create this GSI
      KeyConditionExpression: '(senderId = :userId1 AND receiverId = :userId2) OR (senderId = :userId2 AND receiverId = :userId1)',
      ExpressionAttributeValues: { ':userId1': userId1, ':userId2': userId2 },
    }));

    return result.Items as Message[] || [];
  }

  async markMessageAsRead(messageId: string, userId: string): Promise<void> {
    await dynamoClient.send(new UpdateCommand({
      TableName: TABLES.MESSAGES,
      Key: { id: messageId },
      UpdateExpression: 'SET isRead = :isRead',
      ExpressionAttributeValues: { ':isRead': true },
      ConditionExpression: 'receiverId = :userId',
      ExpressionAttributeValues: { ':userId': userId },
    }));
  }

  async getUnreadMessageCount(userId: string): Promise<number> {
    const result = await dynamoClient.send(new QueryCommand({
      TableName: TABLES.MESSAGES,
      IndexName: 'ReceiverIdIndex', // You'll need to create this GSI
      KeyConditionExpression: 'receiverId = :userId',
      FilterExpression: 'isRead = :isRead',
      ExpressionAttributeValues: { ':userId': userId, ':isRead': false },
      Select: 'COUNT',
    }));

    return result.Count || 0;
  }
}

export const storage = new DynamoStorage();
