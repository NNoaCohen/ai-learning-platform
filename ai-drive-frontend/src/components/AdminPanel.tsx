import React, { useState, useEffect } from 'react';
import { dataService, Category, Subcategory, HistoryItem } from '../services/dataService';
import { User } from '../types/user';
import '../css/AdminPanel.css';

interface AdminPanelProps {
  onClose: () => void;
  onDataUpdate?: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onClose, onDataUpdate }) => {
  const [activeTab, setActiveTab] = useState<'categories' | 'users'>('categories');
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [userHistories, setUserHistories] = useState<{[userId: string]: HistoryItem[]}>({});
  const [loadingHistoryFor, setLoadingHistoryFor] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newSubcategoryName, setNewSubcategoryName] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [categoriesData, subcategoriesData, usersData] = await Promise.all([
        dataService.getCategories(),
        dataService.getAllSubcategories(),
        dataService.getAllUsers()
      ]);
      setCategories(categoriesData);
      setSubcategories(subcategoriesData);
      setUsers(usersData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    
    setIsLoading(true);
    try {
      const result = await dataService.addCategory({ name: newCategoryName });
      setNewCategoryName('');
      await loadData();
      onDataUpdate?.();
    } catch (error) {
      console.error('Error adding category:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSubcategory = async () => {
    if (!newSubcategoryName.trim() || !selectedCategoryId) return;
    
    setIsLoading(true);
    try {
      await dataService.addSubcategory({
        name: newSubcategoryName,
        categoryId: selectedCategoryId
      });
      setNewSubcategoryName('');
      setSelectedCategoryId('');
      await loadData();
      onDataUpdate?.();
    } catch (error) {
      console.error('Error adding subcategory:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find(cat => cat._id === categoryId)?.name || 'Unknown';
  };

  const loadUserHistory = async (userId: string, userName: string) => {
    if (userHistories[userId]) {
      const newHistories = { ...userHistories };
      delete newHistories[userId];
      setUserHistories(newHistories);
      return;
    }
    
    setLoadingHistoryFor(userId);
    try {
      const history = await dataService.getUserHistory(userId);
      setUserHistories(prev => ({ ...prev, [userId]: history }));
    } catch (error) {
      console.error('Error loading user history:', error);
    } finally {
      setLoadingHistoryFor(null);
    }
  };

  return (
    <div className="admin-panel-overlay">
      <div className="admin-panel">
        <div className="admin-header">
          <h2>🔧 Admin Panel</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="admin-content">
          <div className="admin-tabs">
            <button 
              className={`tab-btn ${activeTab === 'categories' ? 'active' : ''}`}
              onClick={() => setActiveTab('categories')}
            >
              Categories
            </button>
            <button 
              className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              Users
            </button>
          </div>

          {activeTab === 'categories' && (
            <>
              <div className="admin-section">
                <h3>Add Category</h3>
                <div className="input-group">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Category name"
                    disabled={isLoading}
                  />
                  <button 
                    onClick={handleAddCategory}
                    disabled={!newCategoryName.trim() || isLoading}
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="admin-section">
                <h3>Add Subcategory</h3>
                <div className="input-group">
                  <select
                    value={selectedCategoryId}
                    onChange={(e) => setSelectedCategoryId(e.target.value)}
                    disabled={isLoading}
                  >
                    <option value="">Select category</option>
                    {categories.map(category => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={newSubcategoryName}
                    onChange={(e) => setNewSubcategoryName(e.target.value)}
                    placeholder="Subcategory name"
                    disabled={isLoading}
                  />
                  <button 
                    onClick={handleAddSubcategory}
                    disabled={!newSubcategoryName.trim() || !selectedCategoryId || isLoading}
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="admin-section">
                <h3>Existing Categories</h3>
                <div className="categories-list">
                  {categories.map(category => (
                    <div key={category._id} className="category-item">
                      <h4>{category.name}</h4>
                      <div className="subcategories-list">
                        {subcategories
                          .filter(sub => sub.categoryId === category._id)
                          .map(subcategory => (
                            <span key={subcategory._id} className="subcategory-tag">
                              {subcategory.name}
                            </span>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'users' && (
            <div className="admin-section">
              <h3>Users List</h3>
              <div className="users-list">
                {users.map(user => {
                  const userId = user.id || (user as any)._id;
                  const userHistory = userHistories[userId];
                  const isLoadingThisUser = loadingHistoryFor === userId;
                  
                  return (
                    <div key={userId} className="user-container">
                      <div className="user-item">
                        <div className="user-info">
                          <h4>{user.name}</h4>
                          <p>Phone: {user.phone}</p>
                          <p>Role: {user.role}</p>
                        </div>
                        <button 
                          className="history-btn"
                          onClick={() => loadUserHistory(userId, user.name)}
                          disabled={isLoadingThisUser}
                        >
                          {isLoadingThisUser ? 'Loading...' : userHistory ? 'Hide History' : 'View History'}
                        </button>
                      </div>
                      
                      {userHistory && (
                        <div className="user-history-inline">
                          <div className="history-items">
                            {userHistory.map(item => (
                              <div key={item._id} className="history-item-admin">
                                <div className="history-prompt">
                                  <strong>Question:</strong> {item.prompt || (item as any).promptText || 'No question'}
                                </div>
                                <div className="history-response">
                                  <strong>Answer:</strong> {item.aiResponse || (item as any).response || (item as any).aiContent || 'No answer'}
                                </div>
                                <div className="history-meta">
                                  <span>{getCategoryName(item.categoryId)} → {subcategories.find(s => s._id === item.subcategoryId)?.name}</span>
                                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                                </div>
                              </div>
                            ))}
                            {userHistory.length === 0 && (
                              <p>No history for this user</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;