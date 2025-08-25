import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertCreatorProfileSchema, insertMediaSchema, insertMessageSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUserWithProfile(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Creator Profile routes
  app.post('/api/creator/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const profileData = insertCreatorProfileSchema.parse({
        ...req.body,
        userId,
      });
      
      const profile = await storage.createCreatorProfile(profileData);
      res.json(profile);
    } catch (error) {
      console.error("Error creating creator profile:", error);
      res.status(400).json({ message: "Failed to create profile" });
    }
  });

  app.put('/api/creator/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const updates = req.body;
      
      const profile = await storage.updateCreatorProfile(userId, updates);
      res.json(profile);
    } catch (error) {
      console.error("Error updating creator profile:", error);
      res.status(400).json({ message: "Failed to update profile" });
    }
  });

  app.get('/api/creator/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const profile = await storage.getCreatorProfile(userId);
      res.json(profile);
    } catch (error) {
      console.error("Error fetching creator profile:", error);
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  // Admin routes - Creator management
  app.get('/api/admin/creators', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { search, hairColor, location } = req.query;
      const filters = {
        search: search as string,
        hairColor: hairColor as string,
        location: location as string,
      };

      const creators = await storage.getAllCreators(filters);
      res.json(creators);
    } catch (error) {
      console.error("Error fetching creators:", error);
      res.status(500).json({ message: "Failed to fetch creators" });
    }
  });

  app.get('/api/admin/creators/:id', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const creator = await storage.getCreatorById(req.params.id);
      if (!creator) {
        return res.status(404).json({ message: "Creator not found" });
      }

      res.json(creator);
    } catch (error) {
      console.error("Error fetching creator:", error);
      res.status(500).json({ message: "Failed to fetch creator" });
    }
  });

  app.post('/api/admin/creators/:id/view', isAuthenticated, async (req: any, res) => {
    try {
      await storage.incrementProfileViews(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error incrementing profile views:", error);
      res.status(500).json({ message: "Failed to update views" });
    }
  });

  // Media routes
  app.post('/api/media', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const profile = await storage.getCreatorProfile(userId);
      
      if (!profile) {
        return res.status(404).json({ message: "Creator profile not found" });
      }

      const mediaData = insertMediaSchema.parse({
        ...req.body,
        creatorId: profile.id,
      });
      
      const media = await storage.createMedia(mediaData);
      res.json(media);
    } catch (error) {
      console.error("Error creating media:", error);
      res.status(400).json({ message: "Failed to create media" });
    }
  });

  app.get('/api/media/creator/:creatorId', isAuthenticated, async (req: any, res) => {
    try {
      const media = await storage.getCreatorMedia(req.params.creatorId);
      res.json(media);
    } catch (error) {
      console.error("Error fetching media:", error);
      res.status(500).json({ message: "Failed to fetch media" });
    }
  });

  app.delete('/api/media/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const profile = await storage.getCreatorProfile(userId);
      
      if (!profile) {
        return res.status(404).json({ message: "Creator profile not found" });
      }

      await storage.deleteMedia(req.params.id, profile.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting media:", error);
      res.status(500).json({ message: "Failed to delete media" });
    }
  });

  // Message routes
  app.post('/api/messages', isAuthenticated, async (req: any, res) => {
    try {
      const senderId = req.user.claims.sub;
      const messageData = insertMessageSchema.parse({
        ...req.body,
        senderId,
      });
      
      const message = await storage.createMessage(messageData);
      res.json(message);
    } catch (error) {
      console.error("Error creating message:", error);
      res.status(400).json({ message: "Failed to send message" });
    }
  });

  app.get('/api/messages', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const messages = await storage.getUserMessages(userId);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.get('/api/messages/conversation/:otherUserId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const conversation = await storage.getConversation(userId, req.params.otherUserId);
      res.json(conversation);
    } catch (error) {
      console.error("Error fetching conversation:", error);
      res.status(500).json({ message: "Failed to fetch conversation" });
    }
  });

  app.put('/api/messages/:id/read', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      await storage.markMessageAsRead(req.params.id, userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error marking message as read:", error);
      res.status(500).json({ message: "Failed to mark message as read" });
    }
  });

  app.get('/api/messages/unread/count', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const count = await storage.getUnreadMessageCount(userId);
      res.json({ count });
    } catch (error) {
      console.error("Error fetching unread count:", error);
      res.status(500).json({ message: "Failed to fetch unread count" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
