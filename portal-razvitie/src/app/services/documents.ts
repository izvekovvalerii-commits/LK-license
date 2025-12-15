import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProjectDocument } from '../models/document.model';

@Injectable({
    providedIn: 'root'
})
export class DocumentsService {
    private apiUrl = 'http://localhost:5068/api/documents';

    constructor(private http: HttpClient) { }

    upload(projectId: number, file: File, type: string): Observable<ProjectDocument> {
        const formData = new FormData();
        formData.append('projectId', projectId.toString());
        formData.append('file', file);
        formData.append('type', type);

        return this.http.post<ProjectDocument>(`${this.apiUrl}/upload`, formData);
    }

    getByProject(projectId: number): Observable<ProjectDocument[]> {
        return this.http.get<ProjectDocument[]>(`${this.apiUrl}/project/${projectId}`);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    download(id: number): Observable<Blob> {
        return this.http.get(`${this.apiUrl}/download/${id}`, { responseType: 'blob' });
    }
}
