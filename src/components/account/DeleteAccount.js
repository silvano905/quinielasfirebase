import React from "react";
import {useDispatch} from "react-redux";
import {auth} from '../../config-firebase/firebase'
import {
    deleteUser
} from 'firebase/auth'
import {logout} from "../../redux/user/userSlice";

import Grid from "@mui/material/Grid";
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
    color: theme.palette.text.secondary,
    background: '#fdfffc',
    boxShadow: '0 3px 5px 2px rgba(11, 82, 91, .5)',
}));

const DeleteAccount = () => {

    const dispatch = useDispatch()

    //for delete button
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    //end

    const deleteAccount = (e) => {
        e.preventDefault()
        deleteUser(auth.currentUser).then(()=>{
            dispatch(logout())
            auth.signOut().then()
        })
    }

    return (
        <Grid container spacing={1} justifyContent="center">
            <Grid item xs={11} sm={11} lg={7}>
                <Item elevation={6}>
                    <Grid container direction="row" justify="center" alignItems="center">
                        <Grid item sm={12} lg={12} xs={12}>
                            <Typography variant="h5" gutterBottom style={{color: 'red'}}>
                                Borrar mi cuenta
                            </Typography>
                        </Grid>
                        <Grid item sm={12} lg={12} xs={12}>
                            <Typography variant="h6" gutterBottom style={{padding: 5}}>
                                si quieres puedes eliminar tu cuenta de nuestra plataforma. Se eliminarán
                                todos los datos, incluido el historial de transacciones.
                            </Typography>
                        </Grid>
                        <Grid item sm={12} lg={12} xs={12}>
                            <div style={{margin: 5}}>
                                <Button variant="contained" color="warning" aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                                    borrar
                                </Button>
                                <Menu
                                    id="simple-menu"
                                    anchorEl={anchorEl}
                                    keepMounted
                                    open={Boolean(anchorEl)}
                                    onClose={handleClose}
                                >
                                    <MenuItem onClick={handleClose}>
                                        <Typography variant="h6" gutterBottom>
                                            confirmar la eliminación de su cuenta
                                        </Typography>
                                    </MenuItem>
                                    <MenuItem onClick={handleClose}>
                                        <Button onClick={deleteAccount} variant="contained"
                                                color="success"
                                                size='small'>confirmar</Button>
                                    </MenuItem>
                                </Menu>
                            </div>
                        </Grid>

                    </Grid>
                </Item>
            </Grid>
        </Grid>
    );

};

export default DeleteAccount;