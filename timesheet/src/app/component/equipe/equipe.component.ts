import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-equipe',
  templateUrl: './equipe.component.html',
  styleUrls: ['./equipe.component.css']
})
export class EquipeComponent implements OnInit {
  teamMembers = [
    { name: 'Yahya', role: 'Programmer', profileImage: 'assets/img/profile1.jpg' },
    { name: 'Abir', role: 'CEO', profileImage: 'assets/img/profile2.jpg' },
    { name: 'Hadil', role: 'Wordpress', profileImage: 'assets/img/profile3.jpg' },
    { name: 'Farah', role: 'Youtuber', profileImage: 'assets/img/profile4.jpg' }
  ];

  constructor() { }

  ngOnInit(): void {
  }
}