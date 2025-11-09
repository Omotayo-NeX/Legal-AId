import { supabase } from './supabase';

export interface Reminder {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  type: 'tax' | 'cac' | 'pension' | 'custom';
  due_date: string;
  status: 'pending' | 'completed' | 'overdue';
  recurring: boolean;
  frequency: 'monthly' | 'quarterly' | 'annually' | null;
  created_at: string;
}

export interface CreateReminderInput {
  title: string;
  description?: string;
  type: 'tax' | 'cac' | 'pension' | 'custom';
  due_date: string;
  recurring?: boolean;
  frequency?: 'monthly' | 'quarterly' | 'annually';
}

export interface UpdateReminderInput {
  title?: string;
  description?: string;
  type?: 'tax' | 'cac' | 'pension' | 'custom';
  due_date?: string;
  status?: 'pending' | 'completed' | 'overdue';
  recurring?: boolean;
  frequency?: 'monthly' | 'quarterly' | 'annually' | null;
}

export class RemindersService {
  /**
   * Get all reminders for the current user
   */
  static async getReminders(): Promise<Reminder[]> {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('compliance_reminders')
      .select('*')
      .eq('user_id', user.id)
      .order('due_date', { ascending: true });

    if (error) {
      console.error('Error fetching reminders:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Get upcoming reminders (next 30 days)
   */
  static async getUpcomingReminders(): Promise<Reminder[]> {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('User not authenticated');
    }

    const today = new Date();
    const next30Days = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    const { data, error } = await supabase
      .from('compliance_reminders')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'pending')
      .gte('due_date', today.toISOString())
      .lte('due_date', next30Days.toISOString())
      .order('due_date', { ascending: true })
      .limit(5);

    if (error) {
      console.error('Error fetching upcoming reminders:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Get a single reminder by ID
   */
  static async getReminder(id: string): Promise<Reminder | null> {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('compliance_reminders')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error fetching reminder:', error);
      throw error;
    }

    return data;
  }

  /**
   * Create a new reminder
   */
  static async createReminder(input: CreateReminderInput): Promise<Reminder> {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('User not authenticated');
    }

    const reminderData = {
      user_id: user.id,
      title: input.title,
      description: input.description || null,
      type: input.type,
      due_date: input.due_date,
      status: 'pending' as const,
      recurring: input.recurring || false,
      frequency: input.frequency || null,
    };

    const { data, error } = await supabase
      .from('compliance_reminders')
      .insert(reminderData)
      .select()
      .single();

    if (error) {
      console.error('Error creating reminder:', error);
      throw error;
    }

    return data;
  }

  /**
   * Update a reminder
   */
  static async updateReminder(id: string, input: UpdateReminderInput): Promise<Reminder> {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('compliance_reminders')
      .update(input)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating reminder:', error);
      throw error;
    }

    return data;
  }

  /**
   * Mark a reminder as completed
   */
  static async completeReminder(id: string): Promise<Reminder> {
    return this.updateReminder(id, { status: 'completed' });
  }

  /**
   * Delete a reminder
   */
  static async deleteReminder(id: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('compliance_reminders')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting reminder:', error);
      throw error;
    }
  }

  /**
   * Update overdue reminders status
   */
  static async updateOverdueReminders(): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('User not authenticated');
    }

    const today = new Date().toISOString();

    const { error } = await supabase
      .from('compliance_reminders')
      .update({ status: 'overdue' })
      .eq('user_id', user.id)
      .eq('status', 'pending')
      .lt('due_date', today);

    if (error) {
      console.error('Error updating overdue reminders:', error);
      throw error;
    }
  }
}
