const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const db = require("./config/db")
const cors = require('cors');
const port = 3000
const userRoutes = require("./routes/userRoute");
const {render} = require("express/lib/application");
const {DATETIME} = require("mysql/lib/protocol/constants/types");
require('dotenv').config()

app.use(cors()); // Enable CORS
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', userRoutes)

// Route pour gérer la soumission du formulaire de contact
app.post('/contact/new', (req, res) => {
    const { nom, idU, email, sujet, message, created_at } = req.body;


    db.query('INSERT INTO contact (nom, idU, email, sujet, message, created_at) VALUES (?, ?, ?, ?, ?, ?)', [nom, idU, email, sujet, message, created_at], (err, result) => {
        if (!nom || !idU || !email || !sujet || !message || !created_at) {
            return res.status(400).send('tout les champs doivent etre remplis');
        }
        // validation de l'email
        if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
            return res.status(400).json({msg:'Email not valid'});
        }
        if (err) {
            return res.status(500).json({msg:'Error inserting into database'});
        }
        return res.status(200).json({msg:'Contact information saved successfully'});
        // render vers le page home

        res.render('/accueil')
    });
});
// methode ajoute contact mais avec jointure entre le contact et l'utilisateur on selecte les informations de l'utilisateur et du contact

// route pour affiche contacts
app.get('/contact', (req, res) => {
    const {prenom, telephone} = req.body; // Récupérer le nom de l'utilisateur depuis le corps de la requête
        db.query('SELECT utilisateurs.prenom, utilisateurs.telephone, contact.* FROM contact JOIN utilisateurs ON contact.idU = utilisateurs.id', [prenom, telephone], (err, result) => {
        if (err) {
            res.send(err)
        } else {
            res.send(result)
            // render vers la page d'accueil
        }
    })
})

// methode pour affiche le contact on affiche le nom de utilisateur a partir de son id avec jointure

app.get('/contact/:id', (req, res) => {
    const { id } = req.params;

    db.query('SELECT utilisateurs.prenom, utilisateurs.telephone, contact.* FROM contact JOIN utilisateurs ON contact.idU = utilisateurs.id WHERE contact.id = ? ', [id, id], (err, result) => {
        if (err) {
            res.send(err)
        } else if (result.length > 0) {
            res.send(result[0]) // Retourne uniquement le premier résultat
        } else {
            res.send('No data found')
        }
    })
})
app.get('/contact/:nom', (req, res) => {
    const { nom } = req.params;
    db.query('SELECT * FROM contact WHERE nom = ?', [nom], (err, result) => {
        if (err) {
            res.send(err)
        } else if (result.length > 0) {
            res.send(result)
        } else {
            res.send('No data found')
        }
    })
})

// route pour modifier contact
app.put('/contact/modifier/:id', (req, res) => {
    const { id } = req.params;
    const { nom, idU, email, sujet, message, created_at } = req.body;
    db.query('UPDATE contact SET nom = ?, idU = ?, email = ?, sujet = ?, message = ?, created_at = ? WHERE id = ?', [nom, idU, email, sujet, message, created_at, id], (err, result) => {
        // valider les champs

        if (!nom || !idU || !email || !sujet || !message || !created_at) {
            return res.status(400).send('tout les champs sont obligatoire');
        }

        // validation de l'email
        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
            return res.status(400).json({msg:'Please enter a valid email address'});
        }
        if (err) {
            return res.status(500).send('Error updating database');
        } else if (result.affectedRows === 0) {
            return res.status(404).send('contact not found');
        }
        return res.status(200).send('contact updated successfully');
    });
})
// methode pour le supprimer contact
app.delete('/contact/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM contact WHERE id = ?', [id], (err, result) => {
        if (err) {
            return res.status(500).send('Error deleting from database');
        } else if (result.affectedRows === 0) {
            return res.status(404).send('contact not found');
        }
        return res.status(200).send('contact deleted successfully');
    });
});

// ajoute un methode d'ajouter un avis de client

app.post('/client-profile/new', (req, res) => {
    const { nom, email, projet, notation, revoir, photo} = req.body;

    db.query('INSERT INTO client (nom, email, projet, notation, revoir, photo) VALUES (?, ?, ?, ?, ?, ?)', [nom, email, projet, notation, revoir, photo], (err, result) => {
        // valider les champs
        if (!nom || !email || !projet || !notation || !revoir || !photo) {
            return res.status(400).json({msg:'tout les champs sont obligatoire'});
            // validation de la email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({msg:'Email invalide'});
            }

        }
        if (photo) {
            // transforme le photo en base64 pour l'inserer dans la base de donnée
            const base64Data = photo.replace(/^data:image\/png;base64,/, "");
            const buffer = Buffer.from(base64Data, 'base64');
            const base64Photo = buffer.toString('base64');
        }
        if (err) {
            return res.status(500).json({msg:'Error inserting into database'});
        }
        return res.status(200).json({msg:'Client information saved successfully'});
        // render vers le page home


    });
});

// router pour affiche le client
app.get('/client-profile', (req, res) => {
    db.query('SELECT * FROM client', (err, result) => {
        if (err) {
            res.send(err)
        } else {
            res.send(result)
        }
    })
})
// route pour affiche le client par id
app.get('/client-profile/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM client WHERE id = ?', [id], (err, result) => {
        if (err) {
            res.send(err)
        } else if (result.length > 0) {
            res.send(result)
        } else {
            res.send('No data found')
        }
    })
})

// methode pour le supprimer client
app.delete('/client-profile/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM client WHERE id = ?', [id], (err, result) => {
        if (err) {
            return res.status(500).send('Error deleting from database');
        } else if (result.affectedRows === 0) {
            return res.status(404).send('client not found');
        }
        return res.status(200).send('client deleted successfully');
    });
});
// methode pour modifier le client
app.put('/client-profile/modifier/:id', (req, res) => {
    const { id } = req.params;
    const { nom, email, projet, notation, revoir, photo } = req.body;
    db.query('UPDATE client SET nom = ?, email = ?, projet = ?, notation = ?, revoir = ?, photo = ? WHERE id = ?', [nom, email, projet, notation, revoir, photo, id], (err, result) => {
        if (!nom || !email || !projet || !notation || !revoir || !photo) {
            return res.status(400).send('tout les champs sont obligatoire');
        }
        // validation de la email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).send('Email invalide');
        }
        // transforme le photo en base64 pour l'inserer dans la base de donnée
        const base64Data = photo.replace(/^data:image\/png;base64,/, "");
        const buffer = Buffer.from(base64Data, 'base64');
        const base64Photo = buffer.toString('base64');
        if (err) {
            return res.status(500).send('Error updating client');
        } else if (result.affectedRows === 0) {
            return res.status(404).send('client not found');
        }
        return res.status(200).send('client updated successfully');
    });
});


// methode pour le mot de passe oublie et envoye un mail au urilisateur avec node mailer
app.post('/forgot-password', (req, res) => {
    const { email } = req.body;
    db.query('SELECT * FROM client WHERE email = ?', [email], (err, result) => {


        if (err) {
            res.send(err)
        } else if (result.length > 0) {
            res.send(result)
        } else {
            res.send('No data found')
        }
    })
})

// route
app.get('/projets', (req, res) => {

    db.query('SELECT * FROM projet', (err, result) => {
        if (err) {
            res.send(err)
        } else {
            res.send(result)
        }
    })
})

// get par id projet lorsque le resultat vide retourne message sinon retourne le resultat
app.get('/projet/:idP', (req, res) => {
    const { idP } = req.params;
    db.query('SELECT * FROM projet WHERE idP = ?', [idP], (err, result) => {
        if (err) {
            res.send(err)
        } else if (result.length > 0) {
            res.send(result)
        } else {
            res.send('No data found')
        }
    })
})

// Route pour supprimer un projet par son id et si le produit n'existe pas on retourne un message d'erreur
app.delete('/projet/:idP', (req, res) => {
    const { idP } = req.params;
    db.query('DELETE FROM projet WHERE idP = ?', [idP], (err, result) => {
        if (err) {
            return res.status(500).send('Error deleting from database');
        } else if (result.affectedRows === 0) {
            return res.status(404).send('Project not found');
        }
        return res.status(200).send('Project deleted successfully');
    });
});
// methode pour rechercher un projet par son id
app.get('/search/:nom', (req, res) => {
    const { idP } = req.params;
    db.query('SELECT * FROM projet WHERE nom = ?', [idP], (err, result) => {
        if (err) {
            res.send(err)
        } else if (result.length > 0) {
            res.send(result)
        } else {
            res.send('No data found')
        }
    })
})


app.use('/projet', userRoutes)

// Route pour ajouter un projet
app.post('/projet/new', (req, res) => {
  const { nom, description, idE, idT, idC, dateDebut, dateFin, nbr_heures_travailler, status, tache } = req.body;
  db.query('INSERT INTO projet (nom, description, idE, idT, idC, dateDebut, dateFin, nbr_heures_travailler, status, tache) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
  [nom, description, idE, idT, idC, dateDebut, dateFin, nbr_heures_travailler, status, tache],
  (err, result) => {
      if (!nom || !description || !idE || !idT || !idC || !dateDebut || !dateFin || !nbr_heures_travailler || !status || !tache) {
          return res.status(400).send('Tous les champs doivent être renseignés');
      }
// Vérifier si la date de début est inférieure à la date de fin
      if (new Date(dateDebut) > new Date(dateFin)) {
          return res.status(400).send('La date de début doit être inférieure à la date de fin');
      }

      // Vérifier si la date de début est supérieure ou égale à la date d'aujourd'hui actuelle
      if (new Date(dateDebut) <= new Date()) {
          return res.status(400).send('La date de début doit être supérieure à la date d\'aujourd\'hui');
      }
      if (err) {
          return res.status(500).send('Error inserting into database');
      }
      return res.status(200).send('Project added successfully');
  });
});

// methode pour modifier un projet par son id
app.put('/projet/modifier/:idP', (req, res) => {
    const { idP } = req.params;
    const { nom, description, idE, idT, idC, dateDebut, dateFin, nbr_heures_travailler, status, tache } = req.body;
    db.query('UPDATE projet SET nom = ?, description = ?, idE = ?, idT = ?, idC = ?, dateDebut = ?, dateFin = ?, nbr_heures_travailler = ?, status = ?, tache = ? WHERE idP = ?',
    [nom, description, idE, idT, idC, dateDebut, dateFin, nbr_heures_travailler, status, tache, idP],
    (err, result) => {
        // le validation des champs
        if (!nom || !description || !idE || !idT || !idC || !dateDebut || !dateFin || !nbr_heures_travailler || !status || !tache) {
            return res.status(400).send('Tous les champs doivent être renseignés');
        }
        // Vérifier si la date de début est inférieure à la date de fin
        if (new Date(dateDebut) > new Date(dateFin)) {
            return res.status(400).send('La date de début doit être inférieure à la date de fin');
        }

        // Vérifier si la date de début est supérieure ou égale à la date d'aujourd'hui actuelle
        if (new Date(dateDebut) <= new Date()) {
            return res.status(400).send('La date de début doit être supérieure à la date d\'aujourd\'hui');
        }
        if (err) {
            return res.status(500).send('Error updating database');
        } else if (result.affectedRows === 0) {
            return res.status(404).send('Project not found');
        }
        return res.status(200).send('Project updated successfully');
    });
});

// methode pour affiche tout le tache
app.get('/taches', (req, res) => {
    db.query('SELECT * FROM tache', (err, result) => {
        if (err) {
            res.send(err)
        } else {
            res.send(result)
        }
    })
})

// affiche par id tache lorsque le resultat vide retourne message sinon retourne le resultat
app.get('/tache/:idT', (req, res) => {
    const { idT } = req.params;
    db.query('SELECT * FROM tache WHERE id = ?', [idT], (err, result) => {
        if (err) {
            res.send(err)
        } else if (result.length > 0) {
            res.send(result)
        } else {
            res.send('No data found')
        }
    })
})
// methode pour ajouter une tache
app.post('/tache/new', (req, res) => {
  const { nom, description } = req.body;
  db.query('INSERT INTO tache (nom, description) VALUES (?, ?)',
  [nom, description],
  (err, result) => {
      // veridier tout le champ non vide
      if (!nom || !description) {
          return res.status(400).send('Tous les champs doivent être renseignés');
      }
      if (err) {
          return res.status(500).send('Error inserting into database');
      }
      return res.status(200).send('Tache added successfully');
  });
});

// methode pour modifier une tache par son id
app.put('/tache/modifier/:idT', (req, res) => {
    const { idT } = req.params;
    const { nom, description } = req.body;
    db.query('UPDATE tache SET nom = ?, description = ? WHERE id = ?',
    [nom, description, idT],
    (err, result) => {
        // veridier tout le champ non vide
        if (!nom || !description) {
            return res.status(400).send('Tous les champs doivent être renseignés');
        }
        if (err) {
            return res.status(500).send('Error updating database');
        } else if (result.affectedRows === 0) {
            return res.status(404).send('Tache not found');
        }
        return res.status(200).send('Tache updated successfully');
    });
});

// methode pour supprimer une tache par son id
app.delete('/tache/supprimer/:idT', (req, res) => {
    const { idT } = req.params;
    db.query('DELETE FROM tache WHERE id = ?', [idT], (err, result) => {
        if (err) {
            res.send(err)
        } else if (result.affectedRows === 0) {
            res.send('No data found')
        } else {
            res.send('Tache deleted successfully')
        }
    })
})


// methode affiche tout le rapport
app.get('/rapports', (req, res) => {
    db.query('SELECT * FROM rapport', (err, result) => {
        if (err) {
            res.send(err)
        } else {
            res.send(result)
        }
    })
})

// affiche par id rapport lorsque le resultat vide retourne message sinon retourne le resultat
app.get('/rapport/:idR', (req, res) => {
    const { idR } = req.params;
    db.query('SELECT * FROM rapport WHERE id = ?', [idR], (err, result) => {
        if (err) {
            res.send(err)
        } else if (result.length > 0) {
            res.send(result)
        } else {
            res.send('No data found')
        }
    })
})

// methode pour ajouter un rapport
app.post('/rapport/new', (req, res) => {
  const {date_generation, contenu } = req.body;
  db.query('INSERT INTO rapport (date_generation, contenu) VALUES (?, ?)',
  [date_generation, contenu],
  (err, result) => {
      if (!date_generation|| !contenu) {
          return res.status(400).send('Tous les champs doivent être renseignés');
      }
      if (err) {
          return res.status(500).send('Error inserting into database');
      }
      return res.status(200).send('Rapport added successfully');
  });
});
// methode pour modifier un rapport par son id
app.put('/rapport/modifier/:idR', (req, res) => {
    const { idR } = req.params;
    const { date_generation, contenu } = req.body;
    db.query('UPDATE rapport SET date_generation = ?, contenu = ? WHERE id = ?',
    [date_generation, contenu, idR],
    (err, result) => {
        if (!date_generation || !contenu) {
            return res.status(400).send('Tous les champs doivent être renseignés');
        }
        if (err) {
            return res.status(500).send('Error updating database');
        } else if (result.affectedRows === 0) {
            return res.status(404).send('Rapport not found');
        }
        return res.status(200).send('Rapport updated successfully');
    });
});
// methode pour supprimer un rapport par son id
app.delete('/rapport/supprimer/:idR', (req, res) => {
    const { idR } = req.params;
    db.query('DELETE FROM rapport WHERE id = ?', [idR], (err, result) => {
        if (err) {
            res.send(err)
        } else if (result.affectedRows === 0) {
            res.send('No data found')
        } else {
            res.send('Rapport deleted successfully')
        }
    })
})


// methode d'affichage de timesheet
app.get('/timesheets', (req, res) => {
    db.query('SELECT * FROM timesheet', (err, result) => {
        if (err) {
            res.send(err)
        } else {
            res.send(result)
        }
    })
})
// methode pour afficher le timesheet par son id
app.get('/timesheet/:idT', (req, res) => {
    const { idT } = req.params;
    db.query('SELECT * FROM timesheet WHERE id = ?', [idT], (err, result) => {
        if (err) {
            res.send(err)
        } else if (result.length > 0) {
            res.send(result)

        } else {
            res.send('No data found')
        }
    })
})
// methode pour ajouter un timesheet
app.post('/timesheet/new', (req, res) => {
    const { id, idP, date_d, date_f, heures_travailler, notes } = req.body;

    db.query('INSERT INTO timesheet (id, idP, date_d, date_f, heures_travailler, notes) VALUES (?, ?, ?, ?, ?, ?)',
        [id, idP, date_d, date_f, heures_travailler, notes],
        (err, result) => {
            if (!id || !idP || !date_d || !date_f || !heures_travailler || !notes) {
                return res.status(400).send('Tous les champs doivent être renseignés');
            }
            // Vérifier si la date de début est inférieure à la date de fin
            if (new Date(date_d) > new Date(date_f)) {
                return res.status(400).send('La date de début doit être inférieure à la date de fin');
            }

            // Vérifier si la date de début est supérieure ou égale à la date d'aujourd'hui actuelle
            if (new Date(date_d) <= new Date()) {
                return res.status(400).send('La date de début doit être supérieure à la date d\'aujourd\'hui');
            }
            if (err) {
                return res.status(500).send('Erreur lors de l\'insertion dans la base de données');
            }
            return res.status(200).send('Timesheet ajouté avec succès');
        }
    );
});

// methode pour modifier un timesheet par son id
app.put('/timesheet/modifier/:idT', (req, res) => {
    const { idT } = req.params;
    const { id, idP, date_d, date_f, heures_travailler, notes } = req.body;
    db.query('UPDATE timesheet SET id = ?, idP = ?, date_d = ?, date_f = ?, heures_travailler = ?, notes = ? WHERE idT = ?',
    [id, idP, date_d, date_f, heures_travailler, notes, idT],
    (err, result) => {
        // Vérifier si tous les champs sont renseignés
        if (!id || !idP || !date_d || !date_f || !heures_travailler || !notes) {
            return res.status(400).send('Tous les champs doivent être renseignés');
        }
        // Vérifier si la date de début est inférieure à la date de fin
        if (new Date(date_d) > new Date(date_f)) {
            return res.status(400).send('La date de début doit être inférieure à la date de fin');
        }

        // Vérifier si la date de début est supérieure ou égale à la date d'aujourd'hui actuelle
        if (new Date(date_d) <= new Date()) {
            return res.status(400).send('La date de début doit être supérieure à la date d\'aujourd\'hui');
        }
        if (err) {

            return res.status(500).send('Error updating database');
        } else if (result.affectedRows === 0) {
            return res.status(404).send('Timesheet not found');
        }
        return res.status(200).send('Timesheet updated successfully');
    });
});
// methode pour supprimer un timesheet par son id
app.delete('/timesheet/supprimer/:idT', (req, res) => {
    const { idT } = req.params;
    db.query('DELETE FROM timesheet WHERE id = ?', [idT], (err, result) => {
        if (err) {
            res.send(err)
        } else if (result.affectedRows === 0) {
            res.send('No data found')
        } else {
            res.send('Timesheet deleted successfully')
        }
    })
})

// methode pour affiche le notification on affiche le nom de utilisateur et le nom de projet a partir de son id avec jointure de 3 tables et affiche tous les notifications d'un utilisateur qui est un role employer

app.get('/notifications', (req, res) => {
    db.query('SELECT utilisateurs.prenom, utilisateurs.nom, utilisateurs.role, notification.*, projet.* FROM notification INNER JOIN utilisateurs ON notification.id = utilisateurs.id INNER JOIN projet ON notification.idP = projet.idP AND utilisateurs.role = "Employer"', (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(result);
        }
    });
});
// methode pour afficher le notification par son id
app.get('/notification/:idN', (req, res) => {
    const { idN } = req.params;
    db.query('SELECT utilisateurs.prenom, utilisateurs.nom, utilisateurs.role, notification.*, projet.* FROM notification INNER JOIN utilisateurs ON notification.id = utilisateurs.id INNER JOIN projet ON notification.idP = projet.idP AND utilisateurs.role = "Employer" WHERE idN = ?', [idN], (err, result) => {
        if (err) {
            res.send(err)
        } else if (result.length > 0) {
            res.send(result)
        } else {
            res.send('No data found')
        }
    })
})
// methode pour ajouter un notification
app.post('/notification/new', (req, res) => {
  const {id, idP, notification_type, notification_message} = req.body;
  db.query('INSERT INTO notification (id, idP, notification_type, notification_message) VALUES (?, ?, ?, ?)',
  [id, idP, notification_type, notification_message],
  (err, result) => {
      if (!id || !idP || !notification_type || !notification_message) {
          return res.status(400).send('Tous les champs doivent être renseignés');
      }
      if (err) {
          return res.status(500).send('Error inserting into database');
      }
      return res.status(200).send('Notification added successfully');
  });
});

// methode pour modifier un notification par son id
app.put('/notification/modifier/:idN', (req, res) => {
    const { idN } = req.params;
    const { id, idP, notification_type, notification_message } = req.body;
    db.query('UPDATE notification SET id = ?, idP = ?, notification_type = ?, notification_message = ? WHERE idN = ?',
    [id, idP, notification_type, notification_message, idN],
    (err, result) => {
        if (!id || !idP || !notification_type || !notification_message) {
            return res.status(400).send('Tous les champs doivent être renseignés');
        }
        if (err) {
            return res.status(500).send('Error updating database');
        } else if (result.affectedRows === 0) {
            return res.status(404).send('Notification not found');
        }
        return res.status(200).send('Notification updated successfully');
    });
});


// methode pour supprimer un notification par son id
app.delete('/notification/supprimer/:idN', (req, res) => {
    const { idN } = req.params;
    db.query('DELETE FROM notification WHERE id = ?', [idN], (err, result) => {
        if (err) {
            res.send(err)
        } else if (result.affectedRows === 0) {
            res.send('No data found')
        } else {
            res.send('Notification deleted successfully')
        }
    })
})

// methode pour ajoute un gestionnaire
app.post('/gestionnaire/new', (req, res) => {
  const { idU, grade} = req.body;
  db.query('INSERT INTO gestionnaire (idU, grade) VALUES (?, ?)',
  [idU, grade],
  (err, result) => {
      if (!idU || !grade) {
          return res.status(400).send('Tous les champs doivent être renseignés');
      }
      if (err) {
          return res.status(500).send('Error inserting into database');
      }
      return res.status(200).send('Gestionnaire added successfully');
  });
});

// methode pour modifier un gestionnaire par son id
app.put('/gestionnaire/modifier/:idG', (req, res) => {
    const { idG } = req.params;
    const { idU, grade } = req.body;
    db.query('UPDATE gestionnaire SET idU = ?, grade = ? WHERE id = ?',
    [idU, grade, idG],
    (err, result) => {
        if (!idU || !grade) {
            return res.status(400).send('Tous les champs doivent être renseignés');
        }
        if (err) {
            return res.status(500).send('Error updating database');
        } else if (result.affectedRows === 0) {
            return res.status(404).send('Gestionnaire not found');
        }
        return res.status(200).send('Gestionnaire updated successfully');
    });
});

// methode pour affiche la liste des gestionnaires avec son role et jointure avec les utilisateurs et lorsque le role est gestionnaire
app.get('/gestionnaires', (req, res) => {
    db.query('SELECT utilisateurs.nom, utilisateurs.prenom, utilisateurs.dateemboche, utilisateurs.role, gestionnaire.* FROM gestionnaire INNER JOIN utilisateurs ON gestionnaire.idU = utilisateurs.id WHERE utilisateurs.role = "gestionnaire"', (err, result) => {
        if (err) {
            res.status(500).send('Erreur lors de la récupération des données');
        } else if (result.length > 0) {
            res.json(result);
        } else {
            res.status(404).send('Aucune donnée trouvée');
        }
    });
});

//  methode pour affiche un gestionnaire par son id
app.get('/gestionnaire/:idG', (req, res) => {
    const { idG } = req.params;
    db.query('SELECT utilisateurs.nom, utilisateurs.prenom, utilisateurs.dateemboche, utilisateurs.role, gestionnaire.* FROM gestionnaire INNER JOIN utilisateurs ON gestionnaire.idU = utilisateurs.id WHERE utilisateurs.role = "gestionnaire" AND gestionnaire.id = ?', [idG], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else if (result.length > 0) {
            res.json(result);
        } else {
            res.status(404).send('Aucune donnée trouvée');
        }
    });
});
// methode pour supprimer un gestionnaire par son id
app.delete('/gestionnaire/supprimer/:idG', (req, res) => {
    const { idG } = req.params;
    db.query('DELETE FROM gestionnaire WHERE id = ?', [idG], (err, result) => {
        if (err) {
            res.send(err)
        } else if (result.affectedRows === 0) {
            res.send('No data found')
        } else {
            res.send('Gestionnaire deleted successfully')
        }
    })
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})