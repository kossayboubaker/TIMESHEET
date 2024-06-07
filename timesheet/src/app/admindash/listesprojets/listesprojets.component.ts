import { Component, OnInit} from '@angular/core';
import { Project, ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-listesprojets',
  templateUrl: './listesprojets.component.html',
  styleUrls: ['./listesprojets.component.css']
})
export class ListesprojetsComponent implements OnInit {
editProject(_t6: Project) {
throw new Error('Method not implemented.');
}
deleteProject(arg0: number) {
throw new Error('Method not implemented.');
}
  projects: Project[] = [];

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.projectService.getProjects().subscribe(projects => {
      this.projects = projects;
    });
  }
}