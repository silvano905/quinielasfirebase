import React, {useState, Fragment} from 'react';
import {auth, db} from '../config-firebase/firebase'
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth'
import {Navigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {login, selectUser, getUserData} from "../redux/user/userSlice";
import {Link} from "react-router-dom";
import {doc, onSnapshot, getDoc} from "firebase/firestore";
import {setAlert, removeAlert} from "../redux/alerts/alertsSlice";

// material ui imports for styling
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Grid from "@mui/material/Grid";
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";


const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    padding: 5,
    marginTop: 10
}));

function Login() {
    const user = useSelector(selectUser)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const loginToApp = (e) => {
        e.preventDefault()
        signInWithEmailAndPassword(auth, email, password)
            .then(userAuth =>{
                dispatch(login({
                    email: userAuth.user.email,
                    uid: userAuth.user.uid,
                    displayName: userAuth.user.displayName
                }))

                const docRef = doc(db, "usersData", userAuth.user.uid);
                const docSnap = getDoc(docRef).then((x)=>{
                    dispatch(getUserData({
                        phone: x.data().phoneNumber
                    }))
                })
            }).catch(error =>alert(error.message))
    }
    const dispatch = useDispatch()

    const [values, setValues] = useState({
        showPassword: false,
    });

    const resetPasswordLink = (e) => {
        e.preventDefault()
        dispatch(setAlert('Revisa tu correo electronico', 'success'))
        sendPasswordResetEmail(auth, email).then(()=>handleClose())
        setTimeout(()=>{dispatch(removeAlert())}, 5000)
    }

    const [open, setOpen] = React.useState(false);


    const handleClose = () => {
        setOpen(false);
    };

    const formDialog = (
        <div>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Requerir nueva clave para tu cuenta</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Escribe tu correo electrónico para recibir instrucciones sobre cómo crear una nueva clave.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Correo electrónico"
                        type="email"
                        name='email'
                        onChange={e => setEmail(e.target.value)}
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button onClick={resetPasswordLink}>Enviar</Button>
                </DialogActions>
            </Dialog>
        </div>
    )

    if(user){
        return <Navigate to='/'/>
    }
    return (
        <Fragment>
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={1} justifyContent="center">
                    <Grid item sm={11} lg={7} xs={11}>
                        <Item elevation={4}>
                            <Typography variant="h5" gutterBottom style={{color: 'black'}}>
                                Introduce tu correo electrónico y contraseña
                            </Typography>
                            <Typography variant="h6" gutterBottom style={{marginBottom: 10, color: '#22223b'}}>
                                No tienes una cuenta?
                                <Link to='/register' style={{textDecoration: 'none', color: 'blue'}}> Crear cuenta
                                </Link>
                            </Typography>

                            <form onSubmit={loginToApp} style={{marginTop: 10}}>
                                <Grid container spacing={2} justifyContent="center">
                                    <Grid item sm={11} lg={7} xs={11}>
                                        <FormControl>
                                            <TextField
                                                variant="outlined"
                                                id="standard-basic"
                                                label="Correo electrónico"
                                                name="email"
                                                onChange={e => setEmail(e.target.value)}
                                                required
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item sm={11} lg={7} xs={11}>
                                        <FormControl>
                                            <InputLabel htmlFor="outlined-adornment-password">Contraseña</InputLabel>
                                            <OutlinedInput
                                                id="outlined-adornment-password"
                                                label="Contraseña"
                                                type={values.showPassword ? 'text' : 'password'}
                                                autoComplete="current-password"
                                                name="password"
                                                value={password}
                                                onChange={e => setPassword(e.target.value)}
                                                required
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item sm={11} lg={7} xs={11}>
                                        <Button style={{margin: 10}} type="submit" variant="contained" color="primary">Entrar</Button>
                                    </Grid>
                                </Grid>
                            </form>

                            <Button onClick={()=> setOpen(!open)} style={{margin: 10}} type="submit" variant="outlined" color="error">Olvidaste tu clave?</Button>

                            {open?
                                <>{formDialog}</>
                                :
                                null
                            }
                        </Item>
                    </Grid>
                </Grid>
            </Box>

        </Fragment>
    );
}

export default Login;