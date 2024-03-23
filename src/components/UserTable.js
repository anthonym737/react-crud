import { 
    Button, 
    Dialog, 
    DialogActions, 
    DialogContent, 
    DialogContentText, 
    DialogTitle, 
    Grid, 
    Paper, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow 
} from '@mui/material'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import UserForm from './UserForm';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function UserTable() {
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const loadUsers = () => {
        axios.get('http://localhost:3000/users')
            .then(response => {
                console.log(response.data);
                setUsers(response.data);
            })
            .catch(error => console.error("Erreur lors de la récupération des utilisateurs", error));
    }
    useEffect(() => {
        loadUsers();
    }, []);
    
    const [isUserFormOpen, setIsUserFormOpen] = useState(false);
    const handleUserFormSave = (userData) => {
        // L'URL de base de l'API
        const baseURL = 'http://localhost:3000/users';

        // Choix de l'endpoint et de la méthode HTTP en fonction de la présence d'un user_id
        const endpoint = userData.user_id ? `/${userData.user_id}` : '';
        const method = userData.user_id ? 'put' : 'post';

        // Configuration de la requête à envoyer
        axios({
            method: method,
            url: `${baseURL}${endpoint}`,
            data: userData
        })
        .then(response => {
            alert('Utilisateur enregistré avec succès');
            setIsUserFormOpen(false);
            loadUsers(); // Recharge les données pour mettre à jour la liste
        })
        .catch(error => {
            console.error("Erreur lors de l'enregistrement de l'utilisateur", error);
            alert("Erreur survenue lors de l'enregistrement de l'utilisateur");
        });
    }

    const handleEditClick = (user) => {
        setCurrentUser(user);
        setIsUserFormOpen(true);
    }

    const handleDeleteClick = (user) => {
        setUserToDelete(user);
        setDeleteConfirmOpen(true);
    }

    const handleDeleteConfirm = () => {
        console.log(`Suppression de l'utilisateru avec l'id: ${userToDelete.user_id}`)
        axios.delete(`http://localhost:3000/users/${userToDelete.user_id}`)
            .then(() => {
                console.log("Utilisateur supprimé avec succès");
                setDeleteConfirmOpen(false);
                loadUsers();
            })
            .catch(error => {
                console.error("Erreur lors de la suppression", error);
            });
    }

    const handleDeleteCancel = () => {
        setDeleteConfirmOpen(false);
        setUserToDelete(null);
    }
    return (
        <>
            <Grid container justifyContent="flex-end" style={{ padding: '20px' }}>
                <Button onClick={() => setIsUserFormOpen(true)} variant="contained" color="primary">
                    {currentUser ? "Modifier l'utilisateur" : "Ajouter un utilisateur"}
                </Button>
            </Grid>
            <UserForm 
                open={isUserFormOpen}
                onClose={() => {
                    setIsUserFormOpen(false);
                    setCurrentUser(null);
                }}
                onSave={handleUserFormSave}
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
            />
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Nom</TableCell>
                            <TableCell align="right">Prénom</TableCell>
                            <TableCell align="right">Email</TableCell>
                            <TableCell align="right">Modifier</TableCell>
                            <TableCell align="right">Supprimer</TableCell>  
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow
                                key={user.user_id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0} }}
                            >
                                <TableCell component="th" scope="row">
                                    {user.user_lastname}
                                </TableCell>
                                <TableCell align="right">{user.user_firstname}</TableCell>
                                <TableCell align="right">{user.user_email}</TableCell>
                                <TableCell align="right">
                                    <EditIcon
                                        onClick={() => handleEditClick(user)}
                                        style={{ cursor: 'pointer' }}
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <DeleteIcon 
                                        onClick={() => handleDeleteClick(user)}
                                        style={{ cursor: 'pointer' }}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog
                open={deleteConfirmOpen}
                onClose={handleDeleteCancel}
            >
                <DialogTitle>Confirmer la suppression</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Êtes-vous sûr de vouloir supprimer cet utilisateur ?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel}>Annuler</Button>
                    <Button onClick={handleDeleteConfirm} color="primary" autoFocus>
                        Supprimer
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default UserTable;
