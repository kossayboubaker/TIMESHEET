import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
export interface Project {
  idP: number;
  nom: string;
  description: string;
  dateDebut: string;
  dateFin: string;
  nbr_heures_travailler: number;
  status: string;
  tache: string;
}
@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private apiUrl = 'http://your-api-url.com/projects'; // Remplacez par l'URL de votre API

  constructor(private http: HttpClient) {}

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.apiUrl);
  }

  getProject(id: number): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/${id}`);
  }

  addProject(project: Project): Observable<Project> {
    return this.http.post<Project>(this.apiUrl, project);
  }

  updateProject(project: Project): Observable<Project> {
    return this.http.put<Project>(`${this.apiUrl}/${project.idP}`, project);
  }

  deleteProject(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
