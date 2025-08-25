import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Sidebar from "@/components/layout/sidebar";
import ConversationList from "@/components/messages/conversation-list";
import ChatArea from "@/components/messages/chat-area";
import { useQuery } from "@tanstack/react-query";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Messages() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();
  const isMobile = useIsMobile();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: messages = [], error } = useQuery({
    queryKey: ['/api/messages'],
    enabled: !!user,
    retry: false,
  });

  // Handle unauthorized errors from API
  useEffect(() => {
    if (error && isUnauthorizedError(error)) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [error, toast]);

  if (isLoading || !user) {
    return null;
  }

  // Group messages by conversation (sender/recipient pair)
  const conversations = messages.reduce((acc: any[], message: any) => {
    const otherUserId = message.senderId === user.id ? message.recipientId : message.senderId;
    const otherUser = message.senderId === user.id ? message.recipient : message.sender;
    
    let conversation = acc.find(c => c.otherUser.id === otherUserId);
    if (!conversation) {
      conversation = {
        otherUser,
        lastMessage: message,
        unreadCount: 0,
      };
      acc.push(conversation);
    }
    
    // Update with latest message
    if (new Date(message.createdAt) > new Date(conversation.lastMessage.createdAt)) {
      conversation.lastMessage = message;
    }
    
    // Count unread messages (messages sent TO current user that are unread)
    if (message.recipientId === user.id && !message.isRead) {
      conversation.unreadCount++;
    }
    
    return acc;
  }, []);

  // Sort conversations by last message time
  conversations.sort((a, b) => 
    new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime()
  );

  return (
    <div className="min-h-screen flex bg-cyber-dark">
      <Sidebar userRole={user.role as 'creator' | 'admin'} />
      
      <main className={`flex-1 min-h-screen flex ${isMobile ? 'pb-20' : 'ml-64'}`}>
        {/* Mobile: Show either conversation list or chat */}
        {isMobile ? (
          selectedConversationId ? (
            <ChatArea 
              otherUserId={selectedConversationId}
              currentUser={user}
              onBack={() => setSelectedConversationId(null)}
            />
          ) : (
            <div className="w-full">
              <header className="bg-cyber-surface/90 backdrop-blur-md border-b border-neon-purple/20 px-6 py-4">
                <h2 className="text-xl font-orbitron font-bold text-neon-purple">MESSAGES</h2>
              </header>
              <ConversationList
                conversations={conversations}
                currentUserId={user.id}
                selectedConversationId={selectedConversationId}
                onSelectConversation={setSelectedConversationId}
              />
            </div>
          )
        ) : (
          /* Desktop: Show both panels */
          <>
            <ConversationList
              conversations={conversations}
              currentUserId={user.id}
              selectedConversationId={selectedConversationId}
              onSelectConversation={setSelectedConversationId}
            />
            
            {selectedConversationId ? (
              <ChatArea 
                otherUserId={selectedConversationId}
                currentUser={user}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center bg-cyber-dark/50">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-6 bg-neon-purple/20 rounded-full flex items-center justify-center">
                    <i className="fas fa-comments text-neon-purple text-3xl"></i>
                  </div>
                  <h3 className="text-xl font-orbitron font-bold text-cyber-text mb-2">Select a Conversation</h3>
                  <p className="text-cyber-muted">Choose a conversation from the list to start messaging</p>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
