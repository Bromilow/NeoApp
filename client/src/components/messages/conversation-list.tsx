import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
}

interface Conversation {
  otherUser: User;
  lastMessage: {
    body: string;
    createdAt: string;
    senderId: string;
    isRead: boolean;
  };
  unreadCount: number;
}

interface ConversationListProps {
  conversations: Conversation[];
  currentUserId: string;
  selectedConversationId: string | null;
  onSelectConversation: (userId: string) => void;
}

export default function ConversationList({ 
  conversations, 
  currentUserId, 
  selectedConversationId, 
  onSelectConversation 
}: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = conversations.filter(conversation => {
    const name = conversation.otherUser.firstName || conversation.otherUser.email;
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffMinutes = Math.ceil(diffTime / (1000 * 60));
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffMinutes < 60) return `${diffMinutes}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString();
  };

  return (
    <div className="w-80 bg-cyber-surface border-r border-neon-purple/20 flex flex-col">
      <div className="p-6 border-b border-neon-purple/20">
        <h3 className="text-lg font-orbitron font-bold text-neon-purple mb-4">Messages</h3>
        <div className="relative">
          <Input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-cyber-dark border-neon-purple/30 text-cyber-text focus:border-neon-cyan"
            data-testid="input-search-conversations"
          />
          <i className="fas fa-search absolute left-3 top-3 text-cyber-muted"></i>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto cyber-scrollbar">
        {filteredConversations.length === 0 ? (
          <div className="p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-neon-purple/20 rounded-full flex items-center justify-center">
              <i className="fas fa-inbox text-neon-purple text-xl"></i>
            </div>
            <h4 className="text-cyber-text font-medium mb-2">No Conversations</h4>
            <p className="text-cyber-muted text-sm">
              {searchQuery ? 'No conversations match your search.' : 'Start a conversation to see it here.'}
            </p>
          </div>
        ) : (
          filteredConversations.map((conversation) => {
            const isSelected = selectedConversationId === conversation.otherUser.id;
            const displayName = conversation.otherUser.firstName || conversation.otherUser.email;
            
            return (
              <div
                key={conversation.otherUser.id}
                onClick={() => onSelectConversation(conversation.otherUser.id)}
                className={`p-4 border-b border-neon-purple/10 hover:bg-cyber-dark/20 cursor-pointer transition-colors ${
                  isSelected ? 'bg-cyber-dark/20 border-l-4 border-l-neon-purple' : ''
                }`}
                data-testid={`conversation-${conversation.otherUser.id}`}
              >
                <div className="flex items-start space-x-3">
                  <Avatar className="w-12 h-12 border border-neon-purple/30">
                    <AvatarImage src={conversation.otherUser.profileImageUrl} />
                    <AvatarFallback className="bg-gradient-to-r from-neon-purple to-neon-magenta text-white">
                      {displayName[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-cyber-text font-medium text-sm truncate" data-testid={`conversation-name-${conversation.otherUser.id}`}>
                        {displayName}
                      </h4>
                      <span className="text-cyber-muted text-xs flex-shrink-0 ml-2" data-testid={`conversation-time-${conversation.otherUser.id}`}>
                        {formatTime(conversation.lastMessage.createdAt)}
                      </span>
                    </div>
                    <p className="text-cyber-muted text-sm mt-1 truncate" data-testid={`conversation-preview-${conversation.otherUser.id}`}>
                      {conversation.lastMessage.senderId === currentUserId ? 'You: ' : ''}
                      {conversation.lastMessage.body}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      {conversation.unreadCount > 0 && (
                        <span className="bg-neon-magenta text-white text-xs px-2 py-1 rounded-full" data-testid={`unread-count-${conversation.otherUser.id}`}>
                          {conversation.unreadCount}
                        </span>
                      )}
                      <div className="flex-1"></div>
                      {conversation.lastMessage.senderId === currentUserId && (
                        <i className={`fas text-xs ${
                          conversation.lastMessage.isRead 
                            ? 'fa-check-double text-neon-cyan' 
                            : 'fa-check text-cyber-muted'
                        }`}></i>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
