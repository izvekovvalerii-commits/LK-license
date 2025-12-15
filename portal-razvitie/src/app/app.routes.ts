import { Routes } from '@angular/router';
import { StoresComponent } from './pages/stores/stores';
import { ProjectsComponent } from './pages/projects/projects';
import { TasksComponent } from './pages/tasks/tasks';
import { HeroComponent } from './components/hero/hero';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HeroComponent },
    { path: 'stores', component: StoresComponent },
    { path: 'projects', component: ProjectsComponent },
    { path: 'tasks', component: TasksComponent },
];
