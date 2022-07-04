import React, {useState, Fragment} from 'react';
import {auth, db} from '../config-firebase/firebase'
import { createUserWithEmailAndPassword, updateProfile,  } from 'firebase/auth'
import {addDoc, collection, onSnapshot, orderBy, query, doc, setDoc, serverTimestamp} from "firebase/firestore";
import {useDispatch, useSelector} from "react-redux";
import {login, selectUser, getUserData} from "../redux/user/userSlice";
import {Link, Navigate} from "react-router-dom";
import './Register.css'
// material ui
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

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    padding: 8,
    marginTop: 11,
    marginBottom:10
}));

function Register() {
    const user = useSelector(selectUser)

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    //password
    const [values, setValues] = React.useState({
        password: '',
        showPassword: false,
        phone: null
    });

    const { name, email, password, phone } = formData;
    const [disableButton, setDisableButton] = useState(false)

    const register = (e) => {
        e.preventDefault()
        setDisableButton(true)
        createUserWithEmailAndPassword(auth, email, password)
            .then(cred => {
                let userDataRef = doc(db, "usersData", cred.user.uid);
                setDoc(userDataRef,{
                    phoneNumber: phone
                }).then(()=>{
                    dispatch(getUserData({phone: phone}))
                })
                setDisableButton(false)
                updateProfile(cred.user, {displayName: name}).then(()=>{
                    dispatch(login({
                        email: email,
                        uid: cred.user.uid,
                        displayName: name
                    }))
                })
                })
                .catch(err => {
                    console.log(err.message)
                })
    }
    const dispatch = useDispatch()

    if(user){
        return <Navigate to='/'/>
    }

    return (
        <Fragment>

            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={1} justifyContent="center">
                    <Grid item sm={11} lg={7} xs={11}>
                        <Item elevation={4}>
                            <Typography variant="h5" gutterBottom style={{color: 'black', marginTop: 10}}>
                                Necesitas una cuenta para comprar quinielas
                            </Typography>
                            <Typography  variant="h6" gutterBottom style={{marginBottom: 10, color: '#22223b'}}>
                                Ya tienes una cuenta?
                                <Link to='/login' style={{textDecoration: 'none', color: 'blue'}}> Entrar a mi cuenta
                                </Link>
                            </Typography>

                            <form onSubmit={register} style={{marginTop: 10}}>
                                <Grid container spacing={2} justifyContent="center">
                                    <Grid item sm={11} lg={7} xs={11}>
                                        <FormControl>
                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                id="standard-basic"
                                                label="Nombre del usuario"
                                                name="name"
                                                inputProps={{ maxLength: 20 }}
                                                value={name}
                                                onChange={onChange}
                                                required
                                                style={{marginTop: 10}}
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item sm={11} lg={7} xs={11}>
                                        <FormControl>
                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                id="standard-basic"
                                                label="Número de teléfono"
                                                name="phone"
                                                inputProps={{ maxLength: 20 }}
                                                value={phone}
                                                onChange={onChange}
                                                required
                                                style={{marginTop: 10}}
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item sm={7} lg={7} xs={9}>
                                        <FormControl>
                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                id="standard-basic3"
                                                label="Correo electrónico"
                                                name="email"
                                                value={email}
                                                onChange={onChange}
                                                required
                                                style={{marginTop: 10}}
                                            />
                                        </FormControl>
                                    </Grid>


                                    <Grid item sm={7} lg={7} xs={9}>
                                        <FormControl>
                                            <InputLabel htmlFor="outlined-adornment-password">Contraseña</InputLabel>
                                            <OutlinedInput
                                                id="outlined-adornment-password"
                                                label="Contraseña"
                                                type={values.showPassword ? 'text' : 'password'}
                                                autoComplete="current-password"
                                                name="password"
                                                value={password}
                                                onChange={onChange}
                                                required
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item sm={9} lg={8} xs={9}>
                                        {disableButton?
                                            <Button style={{margin: 10}} type="submit" variant="contained" color="primary" disabled>Registrarme</Button>
                                            :
                                            <Button style={{margin: 10}} type="submit" variant="contained" color="primary">Registrarme</Button>
                                        }
                                    </Grid>


                                </Grid>
                            </form>
                        </Item>
                    </Grid>
                </Grid>
            </Box>
        </Fragment>
    );
}

export default Register;