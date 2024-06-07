import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Project, ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.css']
})
export class ProjectFormComponent implements OnInit {
  projects: Project[] = [];
  projectForm: FormGroup;
  editMode = false;
  currentProjectId: number | null = null;

  constructor(private fb: FormBuilder, private projectService: ProjectService) {
    this.projectForm = this.fb.group({
      idP: [null],
      nom: ['', Validators.required],
      description: ['', Validators.required],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
      nbr_heures_travailler: [0, Validators.required],
      status: ['', Validators.required],
      tache: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.projectService.getProjects().subscribe(projects => {
      this.projects = projects;
    });
  }

  onSubmit(): void {
    if (this.projectForm.invalid) return;

    const project: Project = this.projectForm.value;

    if (this.editMode && this.currentProjectId !== null) {
      this.projectService.updateProject(project).subscribe(() => {
        this.loadProjects();
        this.resetForm();
      });
    } else {
      this.projectService.addProject(project).subscribe(() => {
        this.loadProjects();
        this.resetForm();
      });
    }
  }

  onEdit(project: Project): void {
    this.editMode = true;
    this.currentProjectId = project.idP;
    this.projectForm.patchValue(project);
  }

  onDelete(id: number): void {
    this.projectService.deleteProject(id).subscribe(() => {
      this.loadProjects();
    });
  }

  resetForm(): void {
    this.editMode = false;
    this.currentProjectId = null;
    this.projectForm.reset({
      idP: null,
      nom: '',
      description: '',
      dateDebut: '',
      dateFin: '',
      nbr_heures_travailler: 0,
      status: '',
      tache: ''
    });
  }
}