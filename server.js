const sql = require('mssql');
const express = require('express');
const getConnection = require('./src/services/db');
const app = express();
const port = 3000;
const cors = require('cors');
const { default: axios } = require('axios');
app.use(cors());

app.use(express.json());
app.get('/users', async (req, res) => {
    const pool = await getConnection();
    const result = await pool.request().query('select * from t_users');
    res.json(result.recordset);
});

app.post('/users', async (req, res) => {
    console.log(req.body);
    const { user_firstname, user_lastname, user_email } = req.body;
    if(!user_firstname || !user_lastname || !user_email) {
        return res.status(400).json({ message: "Données requises"})
    }

    try {
        const pool = await getConnection();
        const result= await pool.request()
            .input('user_lastname', sql.VarChar, user_lastname)
            .input('user_firstname', sql.VarChar, user_firstname)
            .input('user_email', sql.VarChar, user_email)
            .query('insert into t_users (user_lastname, user_firstname, user_email) values (@user_lastname, @user_firstname, @user_email)');
        res.status(201).json({ message: "Utilisateur ajouté avec succès"})
    } catch (error) {
        console.error("Erreur SQL", error);
        res.status(500).json({ message: "Erreur dans l'ajout de l'utilisateur", error})
    }

});

app.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { user_lastname, user_firstname, user_email } = req.body;
    if (!user_lastname || !user_firstname || !user_email) {
        return res.status(400).json({ message: "données requises pour la mise à jour"})
    }
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('user_id', sql.Int, id)
            .input('user_lastname', sql.VarChar, user_lastname)
            .input('user_firstname', sql.VarChar, user_firstname)
            .input('user_email', sql.VarChar, user_email)
            .query('UPDATE t_users SET user_lastname = @user_lastname, user_firstname = @user_firstname, user_email = @user_email WHERE user_id = @user_id');
        if(result.rowsAffected[0] === 0) {
            return res.status(404).json({ message : "Utilisateur non trouvé." });
        }
        res.status(200).json({ message: "Utilisateur mise à jour avec succès."})
    } catch (error) {
        console.error("Erreur SQL", error);
        res.status(500).json({ message: "Erreur lors de la mise à jour de l'utilisateur", error})
    }
});

app.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('user_id', sql.Int, id)
            .query('DELETE FROM t_users WHERE user_id = @user_id');
        
        if(result.rowsAffected[0] > 0) {
            res.json({ message: "Utilisateur supprimé avec succès"})
        } else {
            res.status(404).json({message: "Utilisateur non trouvé" });
        }
        
    } catch(error) {
        console.error("Erreur SQL", error);
        res.status(500).json({ message: "Erreur lors de la suppression de l'utilisateur", error});
    }
});
app.listen(port, () => {
    console.log(`API listenning on http://localhost:${port}`);
});