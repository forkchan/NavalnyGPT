import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Message, Sender, Translation, Attachment, AppSettings } from '../types';
import { IconSend, IconDuck, IconPaperclip, IconXCircle, IconFile, IconDownload, IconCopy } from './Icons';
import { sendMessageToGemini } from '../services/geminiService';

interface ChatInterfaceProps {
  t: Translation;
  systemInstruction: string;
  isChairMode?: boolean;
  memesEnabled: boolean;
  messages: Message[];
  onUpdateMessages: (messages: Message[]) => void;
  settings?: AppSettings; // Pass settings to access baseUrl
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  t, 
  systemInstruction, 
  isChairMode = false, 
  memesEnabled,
  messages,
  onUpdateMessages,
  settings
}) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<Attachment | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Handle Paste Event (Ctrl+V)
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      // Support generic files if browser allows, otherwise mostly images on paste
      if (items[i].kind === 'file') {
        const blob = items[i].getAsFile();
        if (blob) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const base64String = event.target?.result as string;
            const base64Data = base64String.split(',')[1];
            setSelectedFile({
              type: blob.type.startsWith('image/') ? 'image' : 'file',
              data: base64Data,
              mimeType: blob.type,
              fileName: blob.name || "pasted-file"
            });
          };
          reader.readAsDataURL(blob);
          e.preventDefault();
        }
      }
    }
  };

  // Convert file to Base64 via Input
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(',')[1];
        
        setSelectedFile({
            type: file.type.startsWith('image/') ? 'image' : 'file',
            data: base64Data,
            mimeType: file.type,
            fileName: file.name
        });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const removeAttachment = () => {
    setSelectedFile(null);
  };

  const handleSend = async () => {
    if ((!input.trim() && !selectedFile) || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: input,
      sender: Sender.User,
      timestamp: Date.now(),
      attachment: selectedFile || undefined
    };

    const updatedMessages = [...messages, userMsg];
    onUpdateMessages(updatedMessages);
    setInput('');
    const fileToSend = selectedFile;
    setSelectedFile(null); // Clear attachment immediately
    setIsLoading(true);

    // Send to Gemini with BaseURL if provided in settings
    const response = await sendMessageToGemini(
        updatedMessages.slice(0, -1), 
        input, 
        systemInstruction,
        fileToSend || undefined,
        settings?.baseUrl
    );

    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      text: response.text,
      sender: Sender.AI,
      timestamp: Date.now(),
      searchSources: response.searchSources,
      detectedMode: response.detectedMode
    };

    onUpdateMessages([...updatedMessages, aiMsg]);
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const downloadCode = (code: string, lang: string) => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    
    // Comprehensive mapping of languages to extensions
    const extMap: Record<string, string> = {
        javascript: 'js', js: 'js', jsx: 'jsx',
        typescript: 'ts', ts: 'ts', tsx: 'tsx',
        python: 'py', py: 'py',
        html: 'html', css: 'css',
        scss: 'scss', sass: 'sass',
        json: 'json',
        markdown: 'md', md: 'md',
        java: 'java',
        c: 'c', cpp: 'cpp', csharp: 'cs', cs: 'cs',
        go: 'go',
        rust: 'rs', rs: 'rs',
        php: 'php',
        ruby: 'rb', rb: 'rb',
        sql: 'sql',
        yaml: 'yaml', yml: 'yml',
        xml: 'xml',
        sh: 'sh', bash: 'sh', zsh: 'sh',
        powershell: 'ps1', ps1: 'ps1',
        dockerfile: 'Dockerfile',
        text: 'txt', txt: 'txt',
        csv: 'csv',
        r: 'r',
        swift: 'swift',
        kotlin: 'kt', kt: 'kt',
        scala: 'scala',
        lua: 'lua',
        perl: 'pl', pl: 'pl',
        dart: 'dart',
        ini: 'ini', toml: 'toml'
    };
    
    const normalizedLang = lang.toLowerCase();
    // If exact match in map, use it. Otherwise default to txt. 
    // If lang is 'dockerfile', user just gets 'generated_file.Dockerfile' which is fine.
    const ext = extMap[normalizedLang] || normalizedLang;
    
    // Handle special case for Dockerfile
    if (normalizedLang === 'dockerfile') {
         a.download = 'Dockerfile';
    } else {
         a.download = `generated_file.${ext}`;
    }

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = (text: string) => {
      navigator.clipboard.writeText(text);
  };

  const renderDetectedModeBadge = (mode: string) => {
      let colorClass = 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
      let icon = '🤖';
      let label = mode;

      switch (mode.toUpperCase()) {
          case 'MEME':
              colorClass = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-700';
              icon = '🦆';
              label = 'Meme Mode';
              break;
          case 'AGGRESSIVE':
              colorClass = 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border border-red-200 dark:border-red-700';
              icon = '🔥';
              label = 'Toxic Mode';
              break;
          case 'CHAIR':
              colorClass = 'bg-gray-800 text-gray-100 dark:bg-black dark:text-gray-200 border border-gray-600';
              icon = '🪑';
              label = 'The Chair';
              break;
          case 'REGULAR':
              colorClass = 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-700';
              icon = '🧠';
              label = 'Regular';
              break;
      }

      return (
          <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide mb-2 select-none ${colorClass}`}>
              <span>{icon}</span>
              <span>{label}</span>
          </div>
      );
  };

  // Helper to render message text, parsing <thinking> blocks if in Chair mode
  const renderMessageText = (text: string, sender: Sender, mode?: string) => {
    const components = {
        code({node, inline, className, children, ...props}: any) {
          const match = /language-(\w+)/.exec(className || '');
          const codeContent = String(children).replace(/\n$/, '');
          
          if (!inline && match) {
            return (
              <div className="relative group my-4 rounded-lg overflow-hidden border border-gray-700 shadow-md">
                 <div className="flex justify-between items-center bg-gray-800 text-gray-300 px-3 py-2 text-xs border-b border-gray-700">
                    <div className="flex items-center gap-2">
                        <IconFile className="w-4 h-4 text-brand-400" />
                        <span className="font-mono font-bold text-brand-400 uppercase">{match[1]}</span>
                    </div>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => copyToClipboard(codeContent)} 
                            className="hover:text-white flex items-center gap-1 px-2 py-1 hover:bg-gray-700 rounded transition-colors"
                            title="Copy content"
                        >
                            <IconCopy className="w-3.5 h-3.5" /> Copy
                        </button>
                        <button 
                            onClick={() => downloadCode(codeContent, match[1])} 
                            className="hover:text-white flex items-center gap-1 text-brand-400 px-2 py-1 hover:bg-gray-700 rounded transition-colors font-medium"
                            title="Download as file"
                        >
                            <IconDownload className="w-3.5 h-3.5" /> Download
                        </button>
                    </div>
                 </div>
                 <pre className="!mt-0 !mb-0 !bg-[#1e1e1e] p-4 overflow-x-auto text-sm leading-relaxed scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
                   <code className={className} {...props}>
                     {children}
                   </code>
                 </pre>
              </div>
            );
          }
          return <code className={`${className} bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-sm font-mono text-red-600 dark:text-red-400`} {...props}>{children}</code>;
        }
    };

    const hasThinking = sender === Sender.AI && text.includes('<thinking>');

    if (hasThinking) {
      const thinkingMatch = text.match(/<thinking>([\s\S]*?)<\/thinking>/);
      if (thinkingMatch) {
        const reasoning = thinkingMatch[1].trim();
        const finalAnswer = text.replace(thinkingMatch[0], '').trim();
        
        return (
          <>
            <details className="mb-4 group">
                <summary className="cursor-pointer list-none flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-brand-300 opacity-70 hover:opacity-100 transition-opacity">
                    <span className="group-open:rotate-90 transition-transform">▶</span>
                    {t.reasoning}
                </summary>
                <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border-l-2 border-brand-500 text-sm italic text-gray-600 dark:text-gray-400 markdown-content">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
                        {reasoning}
                    </ReactMarkdown>
                </div>
            </details>
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
                {finalAnswer}
            </ReactMarkdown>
          </>
        );
      }
    }
    return <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>{text}</ReactMarkdown>;
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto relative">
      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === Sender.User ? 'justify-end' : 'justify-start'} animate-fade-in`}
          >
            <div
              className={`max-w-[95%] md:max-w-[85%] p-3 rounded-2xl shadow-sm relative ${
                msg.sender === Sender.User
                  ? 'bg-brand-600 text-white rounded-br-none'
                  : isChairMode 
                    ? 'bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-100 border-l-4 border-brand-red rounded-bl-none shadow-inner' 
                    : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-gray-700 rounded-bl-none'
              }`}
            >
              {/* Chair Header */}
              {msg.sender === Sender.AI && isChairMode && (
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-300 dark:border-gray-700">
                    <span className="text-xl">🪑</span>
                    <span className="text-xs text-brand-red font-bold uppercase tracking-widest">Interrogation Protocol v2.0</span>
                </div>
              )}

              {/* Detected Mode Badge (Auto Mode) */}
              {msg.sender === Sender.AI && msg.detectedMode && !isChairMode && (
                  renderDetectedModeBadge(msg.detectedMode)
              )}

              {msg.attachment && (
                  <div className="mb-3 rounded-lg overflow-hidden border border-white/20">
                      {msg.attachment.type === 'image' ? (
                        <img 
                            src={`data:${msg.attachment.mimeType};base64,${msg.attachment.data}`} 
                            alt="Attachment" 
                            className="max-h-64 w-auto object-cover"
                        />
                      ) : (
                        <div className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                            <IconFile className="w-8 h-8 text-gray-500 dark:text-gray-300" />
                            <div className="flex flex-col overflow-hidden">
                                <span className="text-sm font-medium truncate text-gray-800 dark:text-gray-200">
                                    {msg.attachment.fileName || "Attached File"}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                                    {msg.attachment.mimeType.split('/')[1] || 'FILE'}
                                </span>
                            </div>
                        </div>
                      )}
                  </div>
              )}
              
              <div className="text-[15px] md:text-base font-normal break-words markdown-content relative pb-1">
                {renderMessageText(msg.text, msg.sender, msg.detectedMode)}
                
                {/* WhatsApp Style Timestamp: Float Right, at the end of text if possible, wraps if needed */}
                <span className={`float-right ml-3 text-[10px] opacity-70 select-none mt-[2px] h-4 flex items-end ${
                    msg.sender === Sender.User ? 'text-brand-50' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>

              {/* Google Search Sources Display */}
              {msg.searchSources && msg.searchSources.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs font-bold mb-2 opacity-80 uppercase tracking-wider">
                        Sources (Grounding):
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {msg.searchSources.map((source, idx) => (
                            <a 
                                key={idx}
                                href={source.uri}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`text-xs px-2 py-1 rounded flex items-center gap-1 transition-colors ${
                                    msg.sender === Sender.User 
                                    ? 'bg-white/20 hover:bg-white/30 text-white' 
                                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-brand-600 dark:text-brand-400'
                                }`}
                            >
                                <span className="truncate max-w-[150px]">{source.title}</span>
                                <span>↗</span>
                            </a>
                        ))}
                    </div>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start w-full animate-fade-in">
             <div className="flex flex-col gap-2 max-w-[80%]">
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-gray-100 dark:bg-gray-800 rounded-bl-none border border-gray-200 dark:border-gray-700">
                    {memesEnabled ? (
                        <IconDuck className="w-6 h-6 text-yellow-500 animate-bounce-slow" />
                    ) : (
                        <div className="w-2 h-2 bg-brand-500 rounded-full animate-pulse"></div>
                    )}
                    <span className="text-sm text-gray-600 dark:text-gray-300 font-medium italic">
                        {t.investigating}
                    </span>
                </div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 sticky bottom-0 z-20">
        {selectedFile && (
             <div className="mb-2 flex items-start">
                 <div className="relative group">
                     {selectedFile.type === 'image' ? (
                        <img 
                            src={`data:${selectedFile.mimeType};base64,${selectedFile.data}`}
                            className="h-20 w-20 object-cover rounded-lg border-2 border-brand-500 shadow-md"
                            alt="Preview"
                        />
                     ) : (
                        <div className="h-20 w-24 flex flex-col items-center justify-center bg-white dark:bg-gray-800 rounded-lg border-2 border-brand-500 shadow-md">
                            <IconFile className="w-8 h-8 text-brand-500 mb-1" />
                            <span className="text-[10px] max-w-full truncate px-1 text-gray-600 dark:text-gray-300">
                                {selectedFile.fileName}
                            </span>
                        </div>
                     )}
                     <button 
                        onClick={removeAttachment}
                        className="absolute -top-2 -right-2 bg-white rounded-full text-red-500 shadow-sm hover:text-red-600 border border-gray-200"
                     >
                        <IconXCircle className="w-6 h-6" />
                     </button>
                 </div>
             </div>
        )}

        <div className="relative flex items-end gap-2 p-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg transition-colors">
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden" 
            // Accept all files
            onChange={handleFileSelect}
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 text-gray-500 dark:text-gray-300 hover:text-brand-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Attach File"
          >
             <IconPaperclip className="w-5 h-5" />
          </button>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            placeholder={t.placeholder}
            className="flex-1 bg-transparent border-none focus:ring-0 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none max-h-32 py-2.5 text-base font-medium"
            rows={1}
          />
          
          <button
            onClick={handleSend}
            disabled={(!input.trim() && !selectedFile) || isLoading}
            className={`p-2.5 rounded-lg transition-all duration-200 shadow-sm ${
              (input.trim() || selectedFile) && !isLoading
                ? 'bg-brand-600 hover:bg-brand-700 hover:scale-105 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
            }`}
          >
            <IconSend className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};