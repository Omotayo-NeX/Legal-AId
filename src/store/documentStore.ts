import { create } from 'zustand';

interface GeneratedDocument {
  content: string;
  templateName: string;
  templateId: string;
  generatedAt: Date;
}

interface DocumentState {
  currentDocument: GeneratedDocument | null;

  // Actions
  setDocument: (document: GeneratedDocument) => void;
  clearDocument: () => void;
}

export const useDocumentStore = create<DocumentState>((set) => ({
  currentDocument: null,

  setDocument: (document) => set({ currentDocument: document }),

  clearDocument: () => set({ currentDocument: null }),
}));
