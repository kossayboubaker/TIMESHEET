const express = require("express");
const router = express.Router();

const {
    UserLogin,
    UserRegister,
    forgotPassword
} = require("../controller/userController");

// Route pour l'inscription
router.post('/register', UserRegister);


// Route pour la connexion
router.post('/login', UserLogin);

router.post('/forgotmdp', forgotPassword);

module.exports = router;