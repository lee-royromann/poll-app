import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { SurveyCreate } from './features/survey-create/survey-create';
import { SurveyDetail } from './features/survey-detail/survey-detail';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'create', component: SurveyCreate },
  { path: 'survey/:id', component: SurveyDetail },
];
