import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { SurveyCreate } from './features/survey-create/survey-create';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'create', component: SurveyCreate },
];
