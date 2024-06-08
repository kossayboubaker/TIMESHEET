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
    const { nom, email, sujet, message, created_at } = req.body;

    if (!nom || !email || !sujet || !message || !created_at) {
        return res.status(400).send('All fields are required');
    }

    db.query('INSERT INTO contact (nom, email, sujet, message, created_at) VALUES (?, ?, ?, ?, ?)', [nom, email, sujet, message, created_at], (err, result) => {
        if (err) {
            return res.status(500).json({msg:'Error inserting into database'});
        }
        return res.status(200).json({msg:'Contact information saved successfully'});
        // render vers le page home

        res.render('/accueil')
    });
});
// route pour affiche contacts
app.get('/contact', (req, res) => {
    db.query('SELECT * FROM contact', (err, result) => {
        if (err) {
            res.send(err)
        } else {
            res.send(result)
            // render vers le page home

        }
    })
})
// router pour affiche contact par nom
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
    const { nom, email, sujet, message, created_at } = req.body;
    db.query('UPDATE contact SET nom = ?, email = ?, sujet = ?, message = ?, created_at = ? WHERE id = ?', [nom, email, sujet, message, created_at, id], (err, result) => {
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


app.get('/projet', (req, res) => {

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
  const { nom, description, dateDebut, dateFin, nbr_heures_travailler, status, tache } = req.body;
  db.query('INSERT INTO projet (nom, description, dateDebut, dateFin, nbr_heures_travailler, status, tache) VALUES (?, ?, ?, ?, ?, ?, ?)', 
  [nom, description, dateDebut, dateFin, nbr_heures_travailler, status, tache], 
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
    const { nom, description, dateDebut, dateFin, nbr_heures_travailler, status, tache } = req.body;
    db.query('UPDATE projet SET nom = ?, description = ?, dateDebut = ?, dateFin = ?, nbr_heures_travailler = ?, status = ?, tache = ? WHERE idP = ?',
    [nom, description, dateDebut, dateFin, nbr_heures_travailler, status, tache, idP],
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
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})