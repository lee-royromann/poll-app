export interface Option {
  id: string;
  label: string;
}

export interface Question {
  id: string;
  text: string;
  allowMultiple: boolean;
  options: Option[];
}

export interface SurveyContent {
  questions: Question[];
}

export interface Survey {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  end_date: string | null;
  status: string;
  content: SurveyContent;
  created_at: string;
}

// Fields the app provides when creating a survey. The database fills the rest.
export interface NewSurvey {
  title: string;
  description: string | null;
  category: string | null;
  end_date: string | null;
  content: SurveyContent;
}
