import { supabase } from './supabase';
import {
  ChatSession,
  Message,
  GeneratedDocument,
  ComplianceReminder,
  DocumentTemplate,
} from '../types';

export class DatabaseService {
  // ===== CHAT SESSIONS =====
  static async createChatSession(userId: string, title: string): Promise<ChatSession | null> {
    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .insert({
          user_id: userId,
          title,
          messages: [],
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating chat session:', error);
      return null;
    }
  }

  static async getChatSessions(userId: string): Promise<ChatSession[]> {
    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching chat sessions:', error);
      return [];
    }
  }

  static async updateChatSession(sessionId: string, messages: Message[]): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('chat_sessions')
        .update({ messages, updated_at: new Date().toISOString() })
        .eq('id', sessionId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating chat session:', error);
      return false;
    }
  }

  static async deleteChatSession(sessionId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('chat_sessions')
        .delete()
        .eq('id', sessionId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting chat session:', error);
      return false;
    }
  }

  // ===== DOCUMENTS =====
  static async getDocumentTemplates(): Promise<DocumentTemplate[]> {
    try {
      const { data, error } = await supabase
        .from('document_templates')
        .select('*')
        .order('name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching document templates:', error);
      return [];
    }
  }

  static async createDocument(
    userId: string,
    templateId: string,
    templateName: string,
    fieldData: Record<string, any>,
    pdfUrl: string
  ): Promise<GeneratedDocument | null> {
    try {
      const { data, error } = await supabase
        .from('generated_documents')
        .insert({
          user_id: userId,
          template_id: templateId,
          template_name: templateName,
          field_data: fieldData,
          pdf_url: pdfUrl,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating document:', error);
      return null;
    }
  }

  static async getUserDocuments(userId: string): Promise<GeneratedDocument[]> {
    try {
      const { data, error } = await supabase
        .from('generated_documents')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user documents:', error);
      return [];
    }
  }

  // ===== COMPLIANCE REMINDERS =====
  static async createReminder(
    userId: string,
    reminder: Omit<ComplianceReminder, 'id' | 'user_id' | 'created_at'>
  ): Promise<ComplianceReminder | null> {
    try {
      const { data, error } = await supabase
        .from('compliance_reminders')
        .insert({
          user_id: userId,
          ...reminder,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating reminder:', error);
      return null;
    }
  }

  static async getUserReminders(userId: string): Promise<ComplianceReminder[]> {
    try {
      const { data, error } = await supabase
        .from('compliance_reminders')
        .select('*')
        .eq('user_id', userId)
        .order('due_date', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching reminders:', error);
      return [];
    }
  }

  static async updateReminderStatus(
    reminderId: string,
    status: 'pending' | 'completed' | 'overdue'
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('compliance_reminders')
        .update({ status })
        .eq('id', reminderId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating reminder:', error);
      return false;
    }
  }

  static async deleteReminder(reminderId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('compliance_reminders')
        .delete()
        .eq('id', reminderId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting reminder:', error);
      return false;
    }
  }

  // ===== FILE STORAGE =====
  static async uploadFile(
    userId: string,
    file: Blob,
    fileName: string,
    folder: string = 'documents'
  ): Promise<string | null> {
    try {
      const filePath = `${folder}/${userId}/${Date.now()}_${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('legal-aid-files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('legal-aid-files')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      return null;
    }
  }
}
