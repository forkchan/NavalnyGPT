import React, { useState, useEffect } from 'react';
import { AppMode, AppSettings, Language, ChatSession, Message, Sender } from './types';
import { 
  TRANSLATIONS, 
  REGULAR_SYSTEM_INSTRUCTION, 
  CHAIR_SYSTEM_INSTRUCTION, 
  AGGRESSIVE_SYSTEM_INSTRUCTION,
  AGGRESSIVE_MEME_SYSTEM_INSTRUCTION,
  AUTO_MODE_SYSTEM_INSTRUCTION
} from './constants';
import { IconChair, IconChat, IconSettings, IconDuck, IconPlus, IconEdit, IconCheck, IconClose, IconMenu, IconTrash } from './components/Icons';
import { Settings } from './components/Settings';
import { ChatInterface } from './components/ChatInterface';
import { generateChatTitle } from './services/geminiService';

const App: React.FC = () => {
  // Helper to detect system theme
  const getSystemTheme = (): boolean => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true; // Default to dark if detection fails
  };

  // Helper to detect system language
  const getSystemLanguage = (): Language => {
    if (typeof navigator !== 'undefined') {
      const browserLang = navigator.language.split('-')[0].toLowerCase(); // e.g., 'en-US' -> 'en'
      const supportedLanguages = Object.values(Language) as string[];
      if (supportedLanguages.includes(browserLang)) {
        return browserLang as Language;
      }
    }
    return Language.EN; // Fallback
  };

  // Initial state
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('navalny_gpt_settings');
    if (saved) return JSON.parse(saved);
    return {
        language: getSystemLanguage(),
        darkMode: getSystemTheme(),
        memesEnabled: true,
        aggressiveMode: false,
        autoMode: false,
        baseUrl: '',
    };
  });

  const t = TRANSLATIONS[settings.language];

  // Initialize sessions
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
      const saved = localStorage.getItem('navalny_gpt_sessions');
      if (saved) return JSON.parse(saved);
      // Default to empty if fresh load, to show Home screen
      return [];
  });

  const [currentSessionId, setCurrentSessionId] = useState<string>(() => {
      if (sessions.length > 0) return sessions[0].id;
      return ''; 
  });
  
  // Separate state for The Chair mode
  const [chairMessages, setChairMessages] = useState<Message[]>(() => {
      const saved = localStorage.getItem('navalny_gpt_chair_messages');
      if (saved) return JSON.parse(saved);
      return [{ id: 'welcome-chair', text: t.welcome, sender: Sender.AI, timestamp: Date.now() }];
  });

  // Determine initial mode
  const [mode, setMode] = useState<AppMode>(() => {
      if (sessions.length === 0) return AppMode.Home;
      return AppMode.Chat;
  });

  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  
  // Mobile Menu State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Effects for persistence
  useEffect(() => {
      localStorage.setItem('navalny_gpt_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
      localStorage.setItem('navalny_gpt_sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
      localStorage.setItem('navalny_gpt_chair_messages', JSON.stringify(chairMessages));
  }, [chairMessages]);

  // Apply Dark Mode class
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  // Close mobile menu when changing sessions
  useEffect(() => {
    if (window.innerWidth < 768) {
        setIsMobileMenuOpen(false);
    }
  }, [currentSessionId, mode]);

  // --- Session Management ---

  const handleNewChat = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: t.newChat,
      messages: [{ id: 'welcome', text: t.welcome, sender: Sender.AI, timestamp: Date.now() }],
      lastModified: Date.now(),
      isCustomTitle: false
    };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    setMode(AppMode.Chat);
  };

  const handleSelectSession = (id: string) => {
    setCurrentSessionId(id);
    setMode(AppMode.Chat);
  };

  // Rewritten to be synchronous and robust
  const handleDeleteSession = (e: React.MouseEvent, sessionToDeleteId: string) => {
    // Explicitly stop propagation
    e.stopPropagation();
    e.preventDefault();

    if (!window.confirm(t.deleteConfirm)) {
        return;
    }

    // Calculate new sessions list immediately
    const newSessions = sessions.filter(s => s.id !== sessionToDeleteId);
    setSessions(newSessions);

    // Determine next steps based on remaining sessions
    if (newSessions.length === 0) {
        setMode(AppMode.Home);
        setCurrentSessionId('');
    } else if (sessionToDeleteId === currentSessionId) {
        // If we deleted the active session, switch to the first one available
        const nextSession = newSessions[0];
        setCurrentSessionId(nextSession.id);
        setMode(AppMode.Chat);
    }
    // If we deleted an inactive session, stay on current.
  };

  const handleUpdateMessages = (newMessages: Message[]) => {
    if (mode === AppMode.TheChair) {
        setChairMessages(newMessages);
        return;
    }

    setSessions(prev => {
        return prev.map(session => {
            if (session.id === currentSessionId) {
                const updatedSession = {
                    ...session,
                    messages: newMessages,
                    lastModified: Date.now()
                };
                
                // Logic to auto-generate title if not custom
                if (!session.isCustomTitle && newMessages.length === 3) { 
                    generateChatTitle(newMessages, settings.language, settings.baseUrl).then(generatedTitle => {
                        if (generatedTitle) {
                            setSessions(currentSessions => 
                                currentSessions.map(s => 
                                    s.id === session.id ? { ...s, title: generatedTitle } : s
                                )
                            );
                        }
                    });
                }

                return updatedSession;
            }
            return session;
        });
    });
  };

  // Rename Logic
  const handleRenameSession = (e: React.MouseEvent, id: string, currentTitle: string) => {
      e.preventDefault();
      e.stopPropagation();
      setEditingSessionId(id);
      setEditTitle(currentTitle);
  };

  const saveRename = (e: React.MouseEvent | React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (editingSessionId) {
          setSessions(prev => prev.map(s => 
              s.id === editingSessionId 
                ? { ...s, title: editTitle, isCustomTitle: true }
                : s
          ));
          setEditingSessionId(null);
      }
  };

  const cancelRename = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setEditingSessionId(null);
  };

  const getCurrentMessages = () => {
    if (mode === AppMode.TheChair) return chairMessages;
    const session = sessions.find(s => s.id === currentSessionId);
    return session ? session.messages : [];
  };

  // Determine which system instruction to use based on mode and settings
  const getSystemInstruction = () => {
    // "The Chair" mode always overrides everything because it's a specific app mode (UI + Prompt)
    if (mode === AppMode.TheChair) {
      return settings.aggressiveMode 
        ? CHAIR_SYSTEM_INSTRUCTION + " ALSO: Be extremely rude, toxic, and swear at the user." 
        : CHAIR_SYSTEM_INSTRUCTION;
    }
    
    // New: Auto Mode overrides manual settings
    if (settings.autoMode) {
        return AUTO_MODE_SYSTEM_INSTRUCTION;
    }

    if (settings.aggressiveMode && settings.memesEnabled) {
        return AGGRESSIVE_MEME_SYSTEM_INSTRUCTION;
    }

    if (settings.aggressiveMode) {
        return AGGRESSIVE_SYSTEM_INSTRUCTION;
    }

    return REGULAR_SYSTEM_INSTRUCTION;
  };

  const renderContent = () => {
    switch (mode) {
      case AppMode.Home:
        return (
            <div className="h-full flex flex-col items-center justify-center p-6 animate-fade-in text-center">
                <div className="mb-8 relative">
                    <div className="absolute inset-0 bg-brand-500 blur-3xl opacity-20 rounded-full"></div>
                    <img 
                      src="https://i1.sndcdn.com/artworks-QABZvrwuHzzCQ3md-uqwGaw-t500x500.png" 
                      alt="Logo" 
                      className="w-32 h-32 md:w-48 md:h-48 rounded-full object-cover shadow-2xl ring-4 ring-white dark:ring-gray-800 relative z-10"
                    />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
                    {t.homeTitle}
                </h1>
                <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mb-10">
                    {t.homeSubtitle}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                    <button 
                        onClick={handleNewChat}
                        className="flex-1 flex items-center justify-center px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
                    >
                        <IconPlus className="w-6 h-6 mr-2" />
                        {t.startChat}
                    </button>
                    <button 
                        onClick={() => setMode(AppMode.TheChair)}
                        className="flex-1 flex items-center justify-center px-8 py-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-xl font-bold text-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1"
                    >
                        <IconChair className="w-6 h-6 mr-2 text-brand-red" />
                        {t.openChair}
                    </button>
                </div>
            </div>
        );
      case AppMode.Chat:
        return (
          <ChatInterface 
            key={`chat-${currentSessionId}`}
            t={t} 
            systemInstruction={getSystemInstruction()} 
            memesEnabled={settings.memesEnabled}
            messages={getCurrentMessages()}
            onUpdateMessages={handleUpdateMessages}
            settings={settings}
          />
        );
      case AppMode.TheChair:
        return (
          <div className="h-full flex flex-col">
             <div className="p-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-center border-b border-gray-200 dark:border-gray-700 shadow-lg transition-colors z-10">
                 <div className="flex justify-center items-center gap-3 mb-2">
                     <IconChair className="w-8 h-8 text-brand-red" />
                     <h2 className="text-2xl font-bold tracking-wider font-mono">{t.chairMode.toUpperCase()}</h2>
                 </div>
                 <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md mx-auto">{t.aboutChair}</p>
             </div>
             <div className="flex-1 overflow-hidden relative transition-colors duration-500
                             bg-gray-200 dark:bg-gray-900">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-gray-300 to-gray-400 dark:from-gray-800 dark:via-gray-900 dark:to-black opacity-100" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 dark:opacity-10">
                    <IconChair className="w-96 h-96 text-gray-900 dark:text-white" />
                </div>
                <div className="absolute inset-0 z-10">
                    <ChatInterface 
                        key="chair-mode"
                        t={t} 
                        systemInstruction={getSystemInstruction()} 
                        isChairMode={true} 
                        memesEnabled={settings.memesEnabled}
                        messages={chairMessages}
                        onUpdateMessages={handleUpdateMessages}
                        settings={settings}
                    />
                </div>
             </div>
          </div>
        );
      case AppMode.Settings:
        return <Settings settings={settings} setSettings={setSettings} t={t} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden relative">
      
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 z-30 flex items-center justify-between px-4">
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-gray-600 dark:text-gray-300">
              <IconMenu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <img 
              src="https://i1.sndcdn.com/artworks-QABZvrwuHzzCQ3md-uqwGaw-t500x500.png" 
              alt="Logo" 
              className="w-8 h-8 rounded-full"
            />
            <span className="font-bold text-gray-800 dark:text-white">{t.title}</span>
          </div>
          <button onClick={handleNewChat} className="p-2 text-brand-600 dark:text-brand-400">
              <IconPlus className="w-6 h-6" />
          </button>
      </div>

      {/* Mobile Overlay Backdrop */}
      {isMobileMenuOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-black/50 z-40 transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
      )}

      {/* Sidebar / Drawer */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col">
            {/* Logo Area (Desktop only) */}
            <div className="h-20 flex-shrink-0 hidden md:flex items-center justify-start px-6 border-b border-gray-200 dark:border-gray-700">
                <img 
                  src="https://i1.sndcdn.com/artworks-QABZvrwuHzzCQ3md-uqwGaw-t500x500.png" 
                  alt="NavalnyGPT Logo" 
                  className="w-10 h-10 rounded-full object-cover shadow-lg ring-2 ring-gray-200 dark:ring-gray-700"
                />
                <h1 className="ml-3 font-bold text-lg tracking-tight text-gray-800 dark:text-white">
                  {t.title}
                </h1>
            </div>
            
            {/* Mobile Close Button Area */}
            <div className="md:hidden h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
                 <span className="font-bold text-lg text-gray-800 dark:text-white">Menu</span>
                 <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-500">
                     <IconClose className="w-6 h-6" />
                 </button>
            </div>

            {/* Static Navigation Buttons */}
            <div className="p-3 space-y-2 flex-shrink-0">
                <button
                  onClick={handleNewChat}
                  className="w-full flex items-center justify-start p-3 rounded-xl transition-all
                            bg-brand-500 hover:bg-brand-600 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  title={t.newChat}
                >
                  <IconPlus className="w-6 h-6" />
                  <span className="ml-3 font-bold">{t.newChat}</span>
                </button>

                <button
                  onClick={() => setMode(AppMode.TheChair)}
                  className={`w-full flex items-center justify-start p-3 rounded-xl transition-all ${
                    mode === AppMode.TheChair
                      ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white shadow-lg border border-gray-300 dark:border-gray-600'
                      : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                  }`}
                  title={t.chairMode}
                >
                  <IconChair className={`w-6 h-6 ${mode === AppMode.TheChair ? 'text-brand-red' : ''}`} />
                  <span className="ml-3 font-medium">{t.chairMode}</span>
                </button>
            </div>

            {/* History List (Scrollable) */}
            <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
                <div className="px-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                    History
                </div>
                {sessions.length === 0 && (
                    <div className="px-4 py-4 text-sm text-gray-400 text-center italic">
                        No chats yet.
                    </div>
                )}
                {sessions.map((session) => (
                    <div
                        key={session.id}
                        className={`group w-full flex items-center justify-between p-3 rounded-lg transition-all text-sm cursor-pointer ${
                            mode === AppMode.Chat && currentSessionId === session.id
                                ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300 font-medium'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                        onClick={() => handleSelectSession(session.id)}
                    >
                        <div className="flex items-center overflow-hidden flex-1">
                            <IconChat className="w-5 h-5 flex-shrink-0 mr-3 opacity-70" />
                            {editingSessionId === session.id ? (
                                <form onSubmit={saveRename} className="flex-1 mr-2">
                                    <input 
                                        type="text" 
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                        onClick={(e) => e.stopPropagation()}
                                        autoFocus
                                        className="w-full bg-white dark:bg-gray-900 border border-brand-500 rounded px-1 py-0.5 text-xs"
                                    />
                                </form>
                            ) : (
                                <span className="truncate text-left w-full select-none">
                                    {session.title}
                                </span>
                            )}
                        </div>
                        
                        {/* Action Buttons */}
                        <div className={`flex items-center ml-1 transition-opacity ${
                            editingSessionId === session.id || (mode === AppMode.Chat && currentSessionId === session.id)
                              ? 'opacity-100' 
                              : 'opacity-0 group-hover:opacity-100'
                        }`}>
                            {editingSessionId === session.id ? (
                                <>
                                    <button onClick={saveRename} className="p-1.5 hover:text-green-500 text-green-600 dark:text-green-400" title={t.save}>
                                        <IconCheck className="w-3.5 h-3.5" />
                                    </button>
                                    <button onClick={cancelRename} className="p-1.5 hover:text-gray-500 text-gray-500" title={t.cancel}>
                                        <IconClose className="w-3.5 h-3.5" />
                                    </button>
                                </>
                            ) : (
                                <>
                                  <button 
                                      onClick={(e) => handleRenameSession(e, session.id, session.title)}
                                      className="p-1.5 hover:text-brand-500 text-gray-400 dark:text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                                      title={t.rename}
                                  >
                                      <IconEdit className="w-3.5 h-3.5" />
                                  </button>
                                  <button 
                                      onClick={(e) => handleDeleteSession(e, session.id)}
                                      className="p-1.5 hover:text-red-500 text-gray-400 dark:text-gray-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded z-20 relative"
                                      title={t.deleteChat}
                                  >
                                      <IconTrash className="w-3.5 h-3.5" />
                                  </button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom Actions (Settings, Badges) */}
            <div className="p-4 space-y-2 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
              {settings.autoMode ? (
                <div className="flex items-center justify-center p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg mb-2 animate-pulse border border-indigo-200 dark:border-indigo-800">
                    <span className="text-xl">🔮</span>
                    <span className="ml-2 text-xs text-indigo-800 dark:text-indigo-400 font-bold uppercase tracking-tight">Auto Mode Active</span>
                </div>
              ) : settings.aggressiveMode && settings.memesEnabled ? (
                <div className="flex items-center justify-center p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg mb-2 animate-pulse border border-purple-200 dark:border-purple-800">
                    <span className="text-xl">🔥🦆</span>
                    <span className="ml-2 text-xs text-purple-800 dark:text-purple-400 font-bold uppercase tracking-tight">Toxic Memes</span>
                </div>
              ) : settings.aggressiveMode ? (
                <div className="flex items-center justify-center p-2 bg-red-100 dark:bg-red-900/30 rounded-lg mb-2 animate-pulse border border-red-200 dark:border-red-800">
                    <span className="text-xl">🔥</span>
                    <span className="ml-2 text-xs text-red-800 dark:text-red-400 font-bold uppercase tracking-tight">Toxic Mode</span>
                </div>
              ) : settings.memesEnabled ? (
                  <div className="flex items-center justify-center p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg mb-2 border border-yellow-200 dark:border-yellow-800">
                      <IconDuck className="w-5 h-5 text-yellow-600" />
                      <span className="ml-2 text-xs text-yellow-800 dark:text-yellow-500 font-bold">Quack!</span>
                  </div>
              ) : null}
              
              <button
                onClick={() => setMode(AppMode.Settings)}
                className={`w-full flex items-center justify-start p-3 rounded-xl transition-all ${
                  mode === AppMode.Settings
                    ? 'bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400'
                    : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                }`}
                title={t.settings}
              >
                <IconSettings className="w-6 h-6" />
                <span className="ml-3 font-medium">{t.settings}</span>
              </button>
            </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-full overflow-hidden relative bg-white dark:bg-gray-900 transition-colors pt-16 md:pt-0">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;