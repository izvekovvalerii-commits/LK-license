import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProjectTask } from '../models/task.model';

@Injectable({
    providedIn: 'root'
})
export class TasksService {
    private apiUrl = 'http://localhost:5068/api/tasks';

    constructor(private http: HttpClient) { }

    getAllTasks(): Observable<ProjectTask[]> {
        return this.http.get<ProjectTask[]>(this.apiUrl);
    }

    getProjectTasks(projectId: number): Observable<ProjectTask[]> {
        return this.http.get<ProjectTask[]>(`${this.apiUrl}/project/${projectId}`);
    }

    createTask(task: ProjectTask): Observable<ProjectTask> {
        return this.http.post<ProjectTask>(this.apiUrl, task);
    }

    updateTask(id: number, task: ProjectTask): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/${id}`, task);
    }

    updateTaskStatus(id: number, status: string): Observable<void> {
        return this.http.patch<void>(`${this.apiUrl}/${id}/status`, JSON.stringify(status), {
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
