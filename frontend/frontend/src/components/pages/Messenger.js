import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { messagesAPI, usersAPI } from '../../services/api';
import '../../styles/components.css';

const Messenger = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [showNewChat, setShowNewChat] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [chatTab, setChatTab] = useState('direct');
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadConversations();
    loadAllUsers();
    const interval = setInterval(loadConversations, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (currentConversation) {
      loadMessages(currentConversation.id);
      const interval = setInterval(() => loadMessages(currentConversation.id), 3000);
      return () => clearInterval(interval);
    }
  }, [currentConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadConversations = async () => {
    try {
      const data = await messagesAPI.getConversations();
      setConversations(data || []);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAllUsers = async () => {
    try {
      const data = await usersAPI.getAll();
      setAllUsers(data || []);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      const data = await messagesAPI.getMessages(conversationId);
      setMessages(data || []);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const openConversation = (conv) => {
    setCurrentConversation(conv);
    loadMessages(conv.id);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !currentConversation) return;

    try {
      await messagesAPI.sendMessage({
        conversationId: currentConversation.id,
        content: newMessage.trim(),
      });
      setNewMessage('');
      loadMessages(currentConversation.id);
      loadConversations();
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const startDirectChat = async (userId) => {
    try {
      const result = await messagesAPI.createConversation({
        type: 'direct',
        userId,
      });
      setShowNewChat(false);
      loadConversations();
      
      // Find and open the conversation
      const user = allUsers.find(u => u.id === userId);
      setCurrentConversation({
        id: result.conversationId,
        displayName: user?.fullName,
        displayAvatar: user?.avatar,
        type: 'direct',
      });
    } catch (error) {
      console.error('Failed to start chat:', error);
    }
  };

  const createGroup = async () => {
    if (!groupName.trim() || selectedMembers.length === 0) {
      alert('Please enter a group name and select members');
      return;
    }

    try {
      const result = await messagesAPI.createConversation({
        type: 'group',
        name: groupName.trim(),
        members: selectedMembers.map(m => m.id),
      });
      setShowNewChat(false);
      setGroupName('');
      setSelectedMembers([]);
      loadConversations();
    } catch (error) {
      console.error('Failed to create group:', error);
    }
  };

  const toggleMember = (member) => {
    if (selectedMembers.find(m => m.id === member.id)) {
      setSelectedMembers(selectedMembers.filter(m => m.id !== member.id));
    } else {
      setSelectedMembers([...selectedMembers, member]);
    }
  };

  const openSettings = async () => {
    try {
      const data = await messagesAPI.getSettings(currentConversation.id);
      setSettings(data);
      setShowSettings(true);
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const handleSettingsAction = async (action, data = {}) => {
    try {
      await messagesAPI.updateSettings(currentConversation.id, { action, ...data });
      if (action === 'rename') {
        setCurrentConversation({ ...currentConversation, displayName: data.name });
      }
      loadConversations();
      openSettings();
    } catch (error) {
      console.error('Settings action failed:', error);
    }
  };

  const leaveConversation = async () => {
    if (!window.confirm('Are you sure you want to leave this conversation?')) return;
    
    try {
      await messagesAPI.leaveConversation(currentConversation.id);
      setCurrentConversation(null);
      setShowSettings(false);
      loadConversations();
    } catch (error) {
      console.error('Failed to leave conversation:', error);
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="messenger-page">
      <h2 className="page-title">
        <i className="fas fa-comments"></i>
        Messenger
      </h2>

      <div className="messenger-container">
        {/* Sidebar */}
        <div className="messenger-sidebar">
          <button className="new-chat-btn" onClick={() => setShowNewChat(true)}>
            <i className="fas fa-plus"></i>
            New Conversation
          </button>

          <input
            type="text"
            placeholder="Search conversations..."
            className="search-input"
          />

          <div className="conversations-list">
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
              </div>
            ) : conversations.length === 0 ? (
              <p className="no-conversations">No conversations yet</p>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv.id}
                  className={`conversation-item ${currentConversation?.id === conv.id ? 'active' : ''}`}
                  onClick={() => openConversation(conv)}
                >
                  <div className="conv-avatar">
                    <img
                      src={conv.displayAvatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${conv.id}`}
                      alt="Avatar"
                    />
                    {conv.isOnline && <span className="online-dot"></span>}
                  </div>
                  <div className="conv-info">
                    <h4>
                      {conv.displayName || 'Chat'}
                      {conv.type === 'group' && <i className="fas fa-users"></i>}
                    </h4>
                    <p>{conv.lastMessage || 'No messages yet'}</p>
                  </div>
                  {conv.unreadCount > 0 && (
                    <span className="unread-badge">{conv.unreadCount}</span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="chat-area">
          {!currentConversation ? (
            <div className="no-chat-selected">
              <i className="fas fa-comments"></i>
              <p>Select a conversation to start chatting</p>
            </div>
          ) : (
            <>
              <div className="chat-header">
                <button className="back-btn" onClick={() => setCurrentConversation(null)}>
                  <i className="fas fa-arrow-left"></i>
                </button>
                <div className="chat-user">
                  <img
                    src={currentConversation.displayAvatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${currentConversation.id}`}
                    alt="Avatar"
                  />
                  <div>
                    <h4>{currentConversation.displayName}</h4>
                    <p>{currentConversation.isOnline ? 'Online' : 'Offline'}</p>
                  </div>
                </div>
                <button className="settings-btn" onClick={openSettings}>
                  <i className="fas fa-cog"></i>
                </button>
              </div>

              <div className="messages-container">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`message ${msg.senderId === user?.id ? 'sent' : 'received'} ${msg.messageType === 'system' ? 'system' : ''}`}
                  >
                    {msg.messageType !== 'system' && msg.senderId !== user?.id && (
                      <p className="sender-name">{msg.senderName}</p>
                    )}
                    {msg.imageUrl && <img src={msg.imageUrl} alt="Attachment" />}
                    <p>{msg.content}</p>
                    <span className="message-time">{formatTime(msg.createdAt)}</span>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="message-input-area">
                <label className="attach-btn">
                  <i className="fas fa-image"></i>
                  <input type="file" accept="image/*" hidden />
                </label>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button onClick={sendMessage}>
                  <i className="fas fa-paper-plane"></i>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* New Chat Modal */}
      {showNewChat && (
        <div className="modal-overlay" onClick={() => setShowNewChat(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>New Conversation</h3>
              <button onClick={() => setShowNewChat(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="chat-tabs">
              <button
                className={chatTab === 'direct' ? 'active' : ''}
                onClick={() => setChatTab('direct')}
              >
                <i className="fas fa-user"></i>
                Direct Message
              </button>
              <button
                className={chatTab === 'group' ? 'active' : ''}
                onClick={() => setChatTab('group')}
              >
                <i className="fas fa-users"></i>
                Create Group
              </button>
            </div>

            {chatTab === 'direct' ? (
              <div className="users-list">
                {allUsers.map((u) => (
                  <div
                    key={u.id}
                    className="user-item"
                    onClick={() => startDirectChat(u.id)}
                  >
                    <img
                      src={u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.fullName}`}
                      alt="Avatar"
                    />
                    <div>
                      <h4>{u.fullName}</h4>
                      <p>{u.email}</p>
                    </div>
                    <i className="fas fa-chevron-right"></i>
                  </div>
                ))}
              </div>
            ) : (
              <div className="create-group">
                <input
                  type="text"
                  placeholder="Group Name"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="form-input"
                />
                
                {selectedMembers.length > 0 && (
                  <div className="selected-members">
                    {selectedMembers.map((m) => (
                      <span key={m.id} className="member-tag">
                        {m.fullName}
                        <button onClick={() => toggleMember(m)}>
                          <i className="fas fa-times"></i>
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                <div className="users-list">
                  {allUsers.map((u) => (
                    <div
                      key={u.id}
                      className={`user-item ${selectedMembers.find(m => m.id === u.id) ? 'selected' : ''}`}
                      onClick={() => toggleMember(u)}
                    >
                      <img
                        src={u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.fullName}`}
                        alt="Avatar"
                      />
                      <div>
                        <h4>{u.fullName}</h4>
                        <p>{u.email}</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={!!selectedMembers.find(m => m.id === u.id)}
                        readOnly
                      />
                    </div>
                  ))}
                </div>

                <button className="btn btn-primary btn-block" onClick={createGroup}>
                  <i className="fas fa-users"></i>
                  Create Group
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && settings && (
        <div className="modal-overlay" onClick={() => setShowSettings(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Chat Settings</h3>
              <button onClick={() => setShowSettings(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="settings-content">
              <div className="setting-item">
                <label>
                  <i className="fas fa-bell-slash"></i>
                  Mute Notifications
                </label>
                <input
                  type="checkbox"
                  checked={settings.isMuted}
                  onChange={(e) => handleSettingsAction('mute', { muted: e.target.checked })}
                />
              </div>

              {settings.type === 'group' && settings.myRole === 'admin' && (
                <div className="setting-item">
                  <label>Group Name</label>
                  <input
                    type="text"
                    defaultValue={settings.name}
                    onBlur={(e) => {
                      if (e.target.value !== settings.name) {
                        handleSettingsAction('rename', { name: e.target.value });
                      }
                    }}
                    className="form-input"
                  />
                </div>
              )}

              {settings.type === 'group' && (
                <div className="members-section">
                  <h4>Members ({settings.members?.length || 0})</h4>
                  <div className="members-list">
                    {settings.members?.map((m) => (
                      <div key={m.id} className="member-item">
                        <img
                          src={m.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${m.fullName}`}
                          alt="Avatar"
                        />
                        <span>{m.fullName}</span>
                        {m.role === 'admin' && <span className="admin-badge">Admin</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button className="btn btn-danger btn-block" onClick={leaveConversation}>
                <i className="fas fa-sign-out-alt"></i>
                {settings.type === 'group' ? 'Leave Group' : 'Delete Conversation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messenger;
