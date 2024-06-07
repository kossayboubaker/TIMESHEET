const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require("../config/db")


exports.UserRegister =
    async (req, res) => {
        const { nom, prenom, email, datenais, telephone, dateemboche, role, motdepasse, confirmMotdepasse } = req.body;

        // Basic validation
        if (!nom || !prenom || !email || !datenais || !telephone || !dateemboche || !role || !motdepasse || !confirmMotdepasse) {
            return res.status(400).send('All fields are required');
        }

        if (motdepasse !== confirmMotdepasse) {
            return res.status(400).send('Passwords do not match');
        }

        // Check if user already exists
        await db.query('SELECT email FROM utilisateurs WHERE email = ?', [email], (err, result) => {
            if (err) throw err;

            if (result.length > 0) {
                return res.status(400).json({"err":"User already exists"});
            }

            // Hash the password
            bcrypt.hash(motdepasse, 10, (err, hash) => {
                if (err) throw err;

                // Insert new user
                const utilisateur = {
                    nom,
                    prenom,
                    email,
                    datenais,
                    telephone,
                    dateemboche,
                    role,
                    motdepasse: hash
                };

                db.query('INSERT INTO utilisateurs SET ?', utilisateur, (err, result) => {
                    if (err) throw err;
                    res.status(201).json({msg:'User registered'});
                });
            });
        });
    }

exports.UserLogin = (req, res) => {
    const { email, motdepasse } = req.body;

    if (!email || !motdepasse) {
        return res.status(400).send('Email and password are required');
    }

    db.query('SELECT * FROM utilisateurs WHERE email = ?', [email], (err, result) => {
        if (err) throw err;

        if (result.length === 0) {
            return res.status(400).json({"err":'User not found'});
        }

        const utilisateur = result[0];

        bcrypt.compare(motdepasse, utilisateur.motdepasse, (err, isMatch) => {
            if (err) throw err;

            if (isMatch) {
                res.status(200).json({msg:'Login successful'});
            } else {
                res.status(400).json({msg:'Invalid password'});
            }
        });
    });
}

// methode ppour mot de passe oublier et envoie de nouveau mot de passe au mail avec nodemailer

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    const user = await db.query('SELECT * FROM utilisateurs WHERE email = ?', [email]);
    if (!user) {
        return res.status(404).json({ msg: 'User not found' });
    }
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '10m' });
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Reset Password',
        text: `Click on the following link to reset your password: ${process.env.CLIENT_URL}/reset-password/${token}`
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ msg: 'Failed to send email' });
        } else {
            console.log('Email sent: ' + info.response);
            return res.status(200).json({ msg: 'Email sent successfully' });
        }
    });
}