
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

interface utilisateurs {
  nom: string;
  prenom: string;
  email: string;
  datenais: string;
  telephone: string;
  dateemboche: string;
  role: string;
  motdepasse: string;
  confirmMotdepasse: string;
}
@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.css']
})
export class InscriptionComponent{
  utilisateur: utilisateurs = {
    nom: '',
    prenom: '',
    email: '',
    datenais: '',
    telephone: '',
    dateemboche: '',
    role: '',
    motdepasse: '',
    confirmMotdepasse: ''
  };

  constructor(private userService: AuthService, private router: Router) {}

  register() {
    if (this.utilisateur.motdepasse !== this.utilisateur.confirmMotdepasse) {
      alert('Passwords do not match');
      return;
    }
    if (!/^[a-zA-Z]+$/.test(this.utilisateur.nom) || !/^[a-zA-Z]+$/.test(this.utilisateur.prenom)) {
      alert('Le champ nom et le champ prénom doivent contenir uniquement des lettres alphabétiques.');
      return;
    }
    if (!/.+@.+/.test(this.utilisateur.email)) {
      alert("L'email doit contenir le caractère '@'.");
      return;
    }

    if( (!/^\d{8}$/.test(this.utilisateur.telephone)) ) {
      alert('Le numéro de téléphone doit contenir exactement 8 chiffres.');
      return;
    }
    if (!/[A-Z]/.test(this.utilisateur.motdepasse) || !/[!@#$%^&*(),.?":{}|<>]/.test(this.utilisateur.motdepasse) || this.utilisateur.motdepasse.length < 8) {
      alert('Le mot de passe doit contenir au moins 8 caractères, une lettre majuscule et un caractère spécial.');
      return;
    }
  

    console.log(this.utilisateur)

    this.userService.register(this.utilisateur).subscribe(
      response => {         
        alert(response.msg);
        this.router.navigate(['/connexion']);
      },
      error => {
          alert(error.error.err)
      }
    );
  }
}
