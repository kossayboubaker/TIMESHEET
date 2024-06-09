const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const db = require("./config/db")
const cors = require('cors');
const port = 3000
const userRoutes = require("./routes/userRoute");
const {render} = require("express/lib/application");
require('dotenv').config()

app.use(cors()); // Enable CORS
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', userRoutes)

// Route pour gérer la soumission du formulaire de contact
app.post('/contact/new', (req, res) => {
    const { nom, idU, email, sujet, message, created_at } = req.body;

    if (!nom || !idU || !email || !sujet || !message || !created_at) {
        return res.status(400).send('All fields are required');
    }

    db.query('INSERT INTO contact (nom, idU, email, sujet, message, created_at) VALUES (?, ?, ?, ?, ?, ?)', [nom, idU, email, sujet, message, created_at], (err, result) => {
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

app.post('/client-profile', (req, res) => {
    const { nom, email, projet, notation, revoir, photo} = req.body;
    if (!nom || !email || !projet || !notation || !revoir || !photo) {
        return res.status(400).send('All fields are required');
    }
    db.query('INSERT INTO client (nom, email, projet, notation, revoir, photo) VALUES (?, ?, ?, ?, ?, ?)', [nom, email, projet, notation, revoir, photo], (err, result) => {
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
        if (err) {
            return res.status(500).send('Error updating client');
        } else if (result.affectedRows === 0) {
            return res.status(404).send('client not found');
        }
        return res.status(200).send('client updated successfully');
    });
});


app.use('/forgotmdp', userRoutes)


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
  const {	id,	idP, date_d, date_f, heures_travailler,	notes} = req.body;
  db.query('INSERT INTO timesheet (id, idP, date_d, date_f, heures_travailler,notes) VALUES (?, ?, ?, ?, ?, ?)',
  [id,	idP, date_d, date_f, heures_travailler,	notes],
  (err, result) => {
      if (err) {
          return res.status(500).send('Error inserting into database');
      }
      return res.status(200).send('Timesheet added successfully');
  });
});

// methode pour modifier un timesheet par son id
app.put('/timesheet/modifier/:idT', (req, res) => {
    const { idT } = req.params;
    const { id, idP, date_d, date_f, heures_travailler, notes } = req.body;
    db.query('UPDATE timesheet SET id = ?, idP = ?, date_d = ?, date_f = ?, heures_travailler = ?, notes = ? WHERE id = ?',
    [id, idP, date_d, date_f, heures_travailler, notes, idT],
    (err, result) => {
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
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})