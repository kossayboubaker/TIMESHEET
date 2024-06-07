import { Component } from '@angular/core';



@Component({
  selector: 'app-projets',
  templateUrl: './projets.component.html',
  styleUrls: ['./projets.component.css']
})
export class ProjetsComponent {
  // Liste des projets a afficher depuis le base de donnees


  projets = [
    {
      title: 'Projet 1',
      description: 'Description du projet 1.',
      technologies: 'Angular, TypeScript, HTML, CSS',
      githubLink: 'https://github.com/votre-projet-1'
    },
    {
      title: 'Projet 2',
      description: 'Description du projet 2.',
      technologies: 'React, JavaScript, CSS',
      githubLink: 'https://github.com/votre-projet-2'
    },
    {
      title: 'Projet 3',
      description: 'Description du projet 3.',
      technologies: 'Vue.js, JavaScript, HTML, CSS',
      githubLink: 'https://github.com/votre-projet-3'
    },
    {
      title: 'Projet 4',
      description: 'Description du projet 4.',
      technologies: 'Vue.js, JavaScript, HTML, CSS',
      githubLink: 'https://github.com/votre-projet-4'
    },
    {
      title: 'Projet 5',
      description: 'Description du projet 5.',
      technologies: 'Vue.js, JavaScript, HTML, CSS',
      githubLink: 'https://github.com/votre-projet-5'
    }
    // Ajoutez d'autres projets si nécessaire
    // Ajoutez d'autres projets si nécessaire
    // Ajoutez d'autres projets si nécessaire
  ];
}
