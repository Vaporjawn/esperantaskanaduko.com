export type MessageType =
  | 'PING'
  | 'TRANSLATE_PAGE'
  | 'TRANSLATE_SELECTION'
  | 'TOGGLE_TRANSLATION'
  | 'RESTORE_PAGE'
  | 'UPDATE_SETTINGS'
  | 'GET_STATUS'
  | 'GET_CACHE_STATS'
  | 'CLEAR_CACHE'
  | 'BATCH_TRANSLATE'
  | 'TRANSLATION_PROGRESS'
  | 'SYNC_OFFLINE_CACHE'
  | 'CLEANUP_OFFLINE_CACHE'
  | 'EXPORT_OFFLINE_CACHE'
  | 'IMPORT_OFFLINE_CACHE'
  | 'GET_TRANSLATED_CONTENT';

export interface Message {
  type: MessageType;
  payload?: any;
  tabId?: number;
}

export interface MessageResponse {
  success: boolean;
  data?: any;
  error?: string;
  detectedLanguage?: string;
  memoryStats?: any;
  offlineStats?: any;
  count?: number;
}
