import React, { useState, useEffect } from 'react';
import '../css/Dashboard.css';
import { LiveChatMessage } from '../types/chat';
import { dataService, Category, Subcategory, HistoryItem } from '../services/dataService';
import { authService } from '../services/authService';
import { User } from '../types/user';
import AdminPanel from '../components/AdminPanel';
import ConfirmDialog from '../components/ConfirmDialog';

const Dashboard: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [chatHistory, setChatHistory] = useState<HistoryItem[]>([]);
  const [liveChatMessages, setLiveChatMessages] = useState<LiveChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [promptToDelete, setPromptToDelete] = useState<string | null>(null);

  const currentUser = authService.getCurrentUser();

  const loadUserHistory = async () => {
    if (!currentUser || !currentUser.id) {
      return;
    }
    
    try {
      const history = await dataService.getUserHistory(currentUser.id);
      setChatHistory(history);
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (currentUser && currentUser.id) {
      loadUserHistory();
    }
  }, []);

  const loadInitialData = async () => {
    try {
      const [categoriesData, subcategoriesData] = await Promise.all([
        dataService.getCategories(),
        dataService.getAllSubcategories()
      ]);
      setCategories(categoriesData);
      setSubcategories(subcategoriesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const getSubcategoriesForCategory = (categoryId: string): Subcategory[] => {
    return subcategories.filter(sub => sub.categoryId === categoryId);
  };

  const getCategoryName = (categoryId: string): string => {
    return categories.find(cat => cat._id === categoryId)?.name || '';
  };

  const getSubcategoryName = (subcategoryId: string): string => {
    return subcategories.find(sub => sub._id === subcategoryId)?.name || '';
  };

  const handleSendPrompt = async () => {
    if (!prompt.trim() || !selectedSubcategory || isLoading) {
      return;
    }
    
    if (!currentUser || !currentUser.id) {
      console.error('User not logged in');
      const errorMessage: LiveChatMessage = {
        id: (Date.now() + 2).toString(),
        type: 'ai',
        content: 'Please log in to send messages.',
        timestamp: new Date()
      };
      setLiveChatMessages([errorMessage]);
      return;
    }

    const userMessage: LiveChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: prompt,
      timestamp: new Date()
    };

    const loadingMessage: LiveChatMessage = {
      id: (Date.now() + 1).toString(),
      type: 'loading',
      content: 'AI is generating your lesson...',
      timestamp: new Date()
    };

    setLiveChatMessages([userMessage, loadingMessage]);
    setIsLoading(true);
    const currentPrompt = prompt;
    setPrompt('');

    try {
      const response = await dataService.sendPrompt({
        userId: currentUser.id,
        categoryId: selectedCategory!,
        subcategoryId: selectedSubcategory,
        promptText: currentPrompt
      });
      
      const lessonMessage: LiveChatMessage = {
        id: (Date.now() + 2).toString(),
        type: 'ai',
        content: response.data?.aiResponse || (response.data as any)?.response || 'No response received',
        timestamp: new Date()
      };
      setLiveChatMessages([userMessage, lessonMessage]);

      await loadUserHistory();
      
    } catch (error) {
      console.error('Error sending prompt:', error);
      const errorMessage: LiveChatMessage = {
        id: (Date.now() + 2).toString(),
        type: 'ai',
        content: 'Sorry, I encountered an error generating your lesson. Please try again.',
        timestamp: new Date()
      };
      setLiveChatMessages([userMessage, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const startNewLesson = () => {
    setLiveChatMessages([]);
    setPrompt('');
  };

  const deleteHistoryItem = async (promptId: string) => {
    setPromptToDelete(promptId);
    setShowConfirmDialog(true);
  };

  const confirmDelete = async () => {
    if (!promptToDelete) return;
    
    try {
      await dataService.deletePrompt(promptToDelete);
      
      // If currently viewing this lesson, clear the chat
      const currentLessonId = liveChatMessages.find(msg => msg.id.includes('history'))?.id.split('-')[2];
      if (currentLessonId === promptToDelete) {
        setLiveChatMessages([]);
      }
      
      await loadUserHistory(); // Reload history
    } catch (error) {
      console.error('Error deleting prompt:', error);
      alert('Error deleting lesson: ' + error);
    } finally {
      setShowConfirmDialog(false);
      setPromptToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowConfirmDialog(false);
    setPromptToDelete(null);
  };

  const showLessonFromHistory = (historyItem: HistoryItem) => {
    const promptText = historyItem.prompt || 
                      (historyItem as any).promptText || 
                      (historyItem as any).question ||
                      'Question not available';
                      
    const aiContent = historyItem.aiResponse || 
                     (historyItem as any).response || 
                     (historyItem as any).aiContent || 
                     (historyItem as any).content ||
                     'Lesson not available';

    const userMessage: LiveChatMessage = {
      id: `history-user-${historyItem._id}`,
      type: 'user',
      content: promptText,
      timestamp: new Date(historyItem.createdAt)
    };

    const aiMessage: LiveChatMessage = {
      id: `history-ai-${historyItem._id}`,
      type: 'ai',
      content: aiContent,
      timestamp: new Date(historyItem.createdAt)
    };

    setLiveChatMessages([userMessage, aiMessage]);
    
    setSelectedCategory(historyItem.categoryId);
    setSelectedSubcategory(historyItem.subcategoryId);
  };

  const handleLogout = () => {
    authService.logout();
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendPrompt();
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>AI Learning Platform</h1>
        <div className="header-actions">
          {currentUser?.role?.toLowerCase() === 'admin' && (
            <button 
              className="admin-btn"
              onClick={() => setShowAdminPanel(true)}
            >
              Admin Panel
            </button>
          )}
          <button 
            className="logout-btn"
            onClick={handleLogout}
            title="Logout"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <aside className="sidebar">
          <h2>Categories</h2>
          {isLoadingData ? (
            <div className="loading-categories">Loading categories...</div>
          ) : (
            <div className="categories-list">
              {categories.map(category => (
                <div key={category._id} className="category-item">
                  <button
                    className={`category-button ${selectedCategory === category._id ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedCategory(selectedCategory === category._id ? null : category._id);
                      setSelectedSubcategory(null);
                    }}
                  >
                    <span className="category-name">{category.name}</span>
                  </button>
                  
                  {selectedCategory === category._id && (
                    <div className="subcategories">
                      {getSubcategoriesForCategory(category._id).map(subcategory => (
                        <button
                          key={subcategory._id}
                          className={`subcategory-button ${selectedSubcategory === subcategory._id ? 'active' : ''}`}
                          onClick={() => setSelectedSubcategory(subcategory._id)}
                        >
                          {subcategory.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </aside>

        <main className="main-content">
          <div className="chat-area">
            <div className="chat-header">
              <h2>AI Learning Chat</h2>
              {selectedSubcategory && (
                <div className="selected-topic">
                  {getCategoryName(selectedCategory!)} → {getSubcategoryName(selectedSubcategory)}
                </div>
              )}
            </div>

            <div className="chat-messages">
              {liveChatMessages.length === 0 ? (
                <div className="empty-chat">
                  <div className="welcome-message">
                    <h3>🎓 AI Learning Assistant</h3>
                    <p>Select a topic and describe what you'd like to learn!</p>
                    <p>I'll create a personalized lesson just for you.</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="lesson-container">
                    {liveChatMessages.map(message => (
                      <div key={message.id} className={`message ${message.type}`}>
                        {message.type === 'user' && (
                          <div className="message-label">Your Request:</div>
                        )}
                        {message.type === 'ai' && (
                          <div className="message-label">📚 Your Lesson:</div>
                        )}
                        <div className="message-content">
                          {message.type === 'loading' ? (
                            <div className="loading-dots">
                              <span></span>
                              <span></span>
                              <span></span>
                            </div>
                          ) : (
                            <div style={{ whiteSpace: 'pre-wrap' }}>
                              {message.content || 'No content available'}
                            </div>
                          )}
                        </div>
                        <div className="message-time">
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {!isLoading && (
                    <div className="lesson-actions">
                      <button 
                        className="new-lesson-btn"
                        onClick={startNewLesson}
                      >
                        📝 Request New Lesson
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="chat-input-area">
              <div className="input-group">
                <textarea
                  className="chat-input"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={selectedSubcategory ? "Describe what you'd like to learn about this topic..." : "Please select a subcategory first"}
                  disabled={!selectedSubcategory || isLoading}
                  rows={3}
                />
                <button
                  className="send-button"
                  onClick={handleSendPrompt}
                  disabled={!prompt.trim() || !selectedSubcategory || isLoading}
                >
                  {isLoading ? 'Creating Lesson...' : 'Get Lesson'}
                </button>
              </div>
            </div>
          </div>
        </main>

        <aside className="history-sidebar">
          <div className="history-header">
            <h3>Chat History</h3>
            <button
              className="toggle-history"
              onClick={() => setShowHistory(!showHistory)}
            >
              {showHistory ? 'Hide' : 'Show'}
            </button>
          </div>

          {showHistory && (
            <div className="history-list">
              {chatHistory.map(message => (
                <div 
                  key={message._id} 
                  className="history-item clickable"
                  title="Click to view this lesson"
                >
                  <div className="history-content" onClick={() => showLessonFromHistory(message)}>
                    <div className="history-topic">
                      {getCategoryName(message.categoryId)} → {getSubcategoryName(message.subcategoryId)}
                    </div>
                    <div className="history-prompt">{message.prompt}</div>
                    <div className="history-time">
                      {new Date(message.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <button 
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteHistoryItem(message._id);
                    }}
                    title="Delete lesson"
                  >
                    ×
                  </button>
                </div>
              ))}
              {chatHistory.length === 0 && (
                <div className="no-history">No learning history yet</div>
              )}
            </div>
          )}
        </aside>
      </div>
      
      {showAdminPanel && (
        <AdminPanel 
          onClose={() => setShowAdminPanel(false)} 
          onDataUpdate={loadInitialData}
        />
      )}
      
      <ConfirmDialog
        isOpen={showConfirmDialog}
        title="Delete Lesson"
        message="Are you sure you want to delete this lesson? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
};

export default Dashboard;