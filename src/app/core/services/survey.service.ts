import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { NewSurvey, Survey } from '../models/survey';

@Injectable({ providedIn: 'root' })
export class SurveyService {
  private supabase = inject(SupabaseService);

  /** Sorted by end date because the home list has to show the most urgent surveys first. */
  async getAll(): Promise<Survey[]> {
    const { data, error } = await this.supabase.client
      .from('surveys')
      .select('*')
      .order('end_date', { ascending: true });

    if (error) {
      throw error;
    }
    return data as Survey[];
  }

  async getById(id: string): Promise<Survey> {
    const { data, error } = await this.supabase.client
      .from('surveys')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }
    return data as Survey;
  }

  /** Returns the stored survey because the caller needs the generated id to open its detail view. */
  async create(survey: NewSurvey): Promise<Survey> {
    const { data, error } = await this.supabase.client
      .from('surveys')
      .insert(survey)
      .select()
      .single();

    if (error) {
      throw error;
    }
    return data as Survey;
  }
}
