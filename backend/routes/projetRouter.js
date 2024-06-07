const express = require("express");
const router = express.Router();
const db = require("../config/db");
const multer = require("multer");
const path = require("path");

router.get("/produits", (req, res) => {
    db.query("SELECT * FROM produit", (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});
router.post("/projet", (req, res) => {
    const { nom, description, dateDebut, dateFin, nbr_heures_travailler, status, tache } = req.body;
    db.query(   
        "INSERT INTO projet (nom, description, dateDebut, dateFin, nbr_heures_travailler, status, tache) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [nom, description, dateDebut, dateFin, nbr_heures_travailler, status, tache],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
});
module.exports = router;