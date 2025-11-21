export enum Sender {
  User = 'user',
  AI = 'ai'
}

export interface Attachment {
  type: 'image' | 'file';
  data: string; // base64
  mimeType: string;
  fileName?: string;
}

export interface SearchSource {
  title: string;
  uri: string;
}

export interface Message {
  id: string;
  text: string;
  sender: Sender;
  timestamp: number;
  isError?: boolean;
  attachment?: Attachment;
  searchSources?: SearchSource[];
  detectedMode?: string; // 'REGULAR' | 'MEME' | 'AGGRESSIVE' | 'CHAIR'
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  lastModified: number;
  isCustomTitle?: boolean;
}

export enum Language {
  EN = 'en', // English
  RU = 'ru', // Russian
  ES = 'es', // Spanish
  FR = 'fr', // French
  DE = 'de', // German
  ZH = 'zh', // Chinese
  AR = 'ar', // Arabic
  PT = 'pt', // Portuguese
  HI = 'hi', // Hindi
}

export enum AppMode {
  Home = 'home',
  Chat = 'chat',
  TheChair = 'the_chair', // Special analytical mode
  Settings = 'settings'
}

export interface AppSettings {
  language: Language;
  darkMode: boolean;
  memesEnabled: boolean;
  aggressiveMode: boolean;
  autoMode: boolean; // New: AI decides the mode
  baseUrl?: string; // For Proxy/VPN bypass
}

export interface Translation {
  title: string;
  chairMode: string;
  chat: string;
  newChat: string;
  settings: string;
  placeholder: string;
  welcome: string;
  investigating: string;
  clearChat: string;
  memes: string;
  aggressive: string;
  aggressiveDesc: string;
  autoMode: string;
  autoModeDesc: string;
  language: string;
  theme: string;
  aboutChair: string;
  rename: string;
  save: string;
  cancel: string;
  deleteChat: string;
  deleteConfirm: string;
  baseUrl: string;
  baseUrlDesc: string;
  reasoning: string;
  homeTitle: string;
  homeSubtitle: string;
  startChat: string;
  openChair: string;
}