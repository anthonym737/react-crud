import { Button } from '@mui/base';
import { 
    Dialog, 
    DialogActions, 
    DialogContent, 
    DialogTitle, 
    TextField 
} from '@mui/material';
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'

const UserForm = ({ open, onClose, onSave, currentUser, setCurrentUser }) => {
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
        defaultValues: {
            user_lastname: currentUser ? currentUser.user_lastname : "",
            user_firstname: currentUser ? currentUser.user_firstname : "",
            user_email: currentUser ? currentUser.user_email : ""
        }
    });
    const handleClose = () => {
        setCurrentUser(null);
        reset();
        onClose();
    }
    const onSubmit = (data) => {
        if(currentUser) {
            data.user_id = currentUser.user_id;
        }
        onSave(data);
        handleClose();    
    };

    useEffect(() => {
        if(currentUser) {
            setValue('user_lastname', currentUser.user_lastname);
            setValue('user_firstname', currentUser.user_firstname);
            setValue('user_email', currentUser.user_email);
        }
    }, [currentUser, setValue]);
  return (
    <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{currentUser ? "Modifier un utilisateur" : "Ajouter un utilisateur"}</DialogTitle>
        <DialogContent>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <TextField
                    margin="dense"
                    label="Nom"
                    fullWidth
                    variant="outlined"
                    {...register('user_lastname', { required: "Nom requis" })}
                    error={!!errors.lastname}
                    helperText={errors.lastname?.message}
                />
                <TextField
                    margin="dense"
                    label="Prénom"
                    fullWidth
                    variant="outlined"
                    {...register('user_firstname', { required: "Prénom requis" })}
                    error={!!errors.firstname}
                    helperText={errors.firstname?.message}
                />
                <TextField
                    margin="dense"
                    label="Email"
                    fullWidth
                    variant="outlined"
                    {...register('user_email', { required: "Email requis" })}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                />
                <DialogActions>
                    <Button onClick={handleClose}>Annuler</Button>
                    <Button type="submit" color="primary">
                        {currentUser ? 'Modifier' : 'Ajouter'}
                    </Button>
                </DialogActions>
            </form>
        </DialogContent>
    </Dialog>
  )
}

export default UserForm;