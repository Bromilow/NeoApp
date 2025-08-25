import { useState, useEffect, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { isUnauthorizedError } from '@/lib/authUtils';

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  role?: string;
}

interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  body: string;
  isRead: boolean;
  createdAt: string;
  sender: User;
  recipient: User;
}

interface ChatAreaProps {
  otherUserId: string;
  currentUser: User;
  onBack?: () => void;
}

export default function ChatArea({ otherUserId, currentUser, onBack }: ChatAreaProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messageText, setMessageText] = useState('');

  const { data: conversation = [], isLoading } = useQuery({
    queryKey: ['/api/messages/conversation', otherUserId],
    enabled: !!otherUserId,
    refetchInterval: 5000, // Refresh every 5 seconds for real-time feel
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (body: string) => {
      const response = await apiRequest('POST', '/api/messages', {
        recipientId: otherUserId,
        body,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/messages'] });
      queryClient.invalidateQueries({ queryKey: ['/api/messages/conversation', otherUserId] });
      queryClient.invalidateQueries({ queryKey: ['/api/messages/unread/count'] });
      setMessageText('');
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (messageId: string) => {
      await apiRequest('PUT', `/api/messages/${messageId}/read`);
    },
  });

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  // Mark unread messages as read
  useEffect(() => {
    const unreadMessages = conversation.filter(
      (msg: Message) => msg.recipientId === currentUser.id && !msg.isRead
    );
    
    unreadMessages.forEach((msg: Message) => {
      markAsReadMutation.mutate(msg.id);
    });
  }, [conversation, currentUser.id, markAsReadMutation]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || sendMessageMutation.isPending) return;
    
    sendMessageMutation.mutate(messageText.trim());
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-neon-purple/20 rounded-full flex items-center justify-center animate-pulse">
            <i className="fas fa-comments text-neon-purple text-2xl"></i>
          </div>
          <p className="text-cyber-muted">Loading conversation...</p>
        </div>
      </div>
    );
  }

  const otherUser = conversation[0]?.senderId === currentUser.id 
    ? conversation[0]?.recipient 
    : conversation[0]?.sender;

  if (!otherUser) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-neon-purple/20 rounded-full flex items-center justify-center">
            <i className="fas fa-comment-slash text-neon-purple text-2xl"></i>
          </div>
          <p className="text-cyber-muted">No conversation found</p>
        </div>
      </div>
    );
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const displayName = otherUser.firstName || otherUser.email;

  return (
    <div className="flex-1 flex flex-col">
      {/* Chat Header */}
      <div className="p-6 bg-cyber-surface border-b border-neon-purple/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {onBack && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="text-cyber-muted hover:text-neon-cyan lg:hidden"
                data-testid="button-back-to-conversations"
              >
                <i className="fas fa-arrow-left"></i>
              </Button>
            )}
            <Avatar className="w-12 h-12 border border-neon-purple/30">
              <AvatarImage src={otherUser.profileImageUrl} />
              <AvatarFallback className="bg-gradient-to-r from-neon-purple to-neon-magenta text-white">
                {displayName[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-cyber-text" data-testid="chat-participant-name">
                {displayName}
              </h3>
              <p className="text-cyber-muted text-sm">
                {otherUser.role === 'admin' ? 'NeoModel Admin' : 'Creator'} • Online
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="p-2 text-cyber-muted hover:text-neon-cyan transition-colors"
              data-testid="button-call"
            >
              <i className="fas fa-phone"></i>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-2 text-cyber-muted hover:text-neon-cyan transition-colors"
              data-testid="button-video-call"
            >
              <i className="fas fa-video"></i>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-2 text-cyber-muted hover:text-neon-cyan transition-colors"
              data-testid="button-chat-options"
            >
              <i className="fas fa-ellipsis-v"></i>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 cyber-scrollbar" data-testid="chat-messages">
        {conversation.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 bg-neon-purple/20 rounded-full flex items-center justify-center">
              <i className="fas fa-comment-dots text-neon-purple text-2xl"></i>
            </div>
            <h4 className="text-cyber-text font-medium mb-2">Start a Conversation</h4>
            <p className="text-cyber-muted text-sm">Send your first message to {displayName}</p>
          </div>
        ) : (
          conversation.map((message: Message, index: number) => {
            const isCurrentUser = message.senderId === currentUser.id;
            const showDate = index === 0 || 
              formatDate(conversation[index - 1].createdAt) !== formatDate(message.createdAt);
            
            return (
              <div key={message.id}>
                {showDate && (
                  <div className="text-center py-2">
                    <span className="text-cyber-muted text-xs bg-cyber-surface px-3 py-1 rounded-full">
                      {formatDate(message.createdAt)}
                    </span>
                  </div>
                )}
                
                <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} space-x-3`}>
                  {!isCurrentUser && (
                    <Avatar className="w-8 h-8 border border-neon-purple/30">
                      <AvatarImage src={message.sender.profileImageUrl} />
                      <AvatarFallback className="bg-gradient-to-r from-neon-purple to-neon-magenta text-white text-sm">
                        {message.sender.firstName?.[0] || message.sender.email[0]}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div className={`max-w-md ${isCurrentUser ? 'text-right' : ''}`}>
                    <div className={`p-4 rounded-lg ${
                      isCurrentUser 
                        ? 'bg-gradient-to-r from-neon-purple to-neon-magenta text-white' 
                        : 'bg-cyber-surface border border-neon-purple/20 text-cyber-text'
                    }`}>
                      <p className="whitespace-pre-wrap" data-testid={`message-${message.id}`}>
                        {message.body}
                      </p>
                    </div>
                    <span className="text-cyber-muted text-xs mt-1 block" data-testid={`message-time-${message.id}`}>
                      {formatTime(message.createdAt)}
                      {isCurrentUser && (
                        <i className={`ml-2 fas ${
                          message.isRead ? 'fa-check-double text-neon-cyan' : 'fa-check'
                        } text-xs`}></i>
                      )}
                    </span>
                  </div>
                  
                  {isCurrentUser && (
                    <Avatar className="w-8 h-8 border border-neon-purple/30">
                      <AvatarImage src={currentUser.profileImageUrl} />
                      <AvatarFallback className="bg-gradient-to-r from-neon-purple to-neon-magenta text-white text-sm">
                        {currentUser.firstName?.[0] || currentUser.email[0]}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Message Input */}
      <div className="p-6 bg-cyber-surface border-t border-neon-purple/20">
        <form onSubmit={handleSendMessage} className="flex items-end space-x-4">
          <div className="flex-1">
            <Textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="bg-cyber-dark border-neon-purple/30 text-cyber-text focus:border-neon-cyan resize-none min-h-[48px] max-h-32"
              rows={1}
              data-testid="input-message"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="p-3 text-cyber-muted hover:text-neon-cyan transition-colors"
              data-testid="button-attach-file"
            >
              <i className="fas fa-paperclip"></i>
            </Button>
            <Button
              type="submit"
              disabled={!messageText.trim() || sendMessageMutation.isPending}
              className="px-6 py-3 bg-gradient-to-r from-neon-purple to-neon-magenta hover:from-neon-purple/80 hover:to-neon-magenta/80 text-white rounded-lg transition-all duration-300 shadow-neon-purple disabled:opacity-50"
              data-testid="button-send-message"
            >
              {sendMessageMutation.isPending ? (
                <i className="fas fa-spinner fa-spin"></i>
              ) : (
                <i className="fas fa-paper-plane"></i>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
