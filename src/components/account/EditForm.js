import React, {Fragment, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {auth, db} from '../../config-firebase/firebase'
import { updateProfile, updateEmail } from 'firebase/auth'
import {getUserData, updatePhoneNumber} from "../../redux/user/userSlice";
import {
    addDoc,
    arrayUnion,
    collection,
    deleteDoc,
    doc,
    increment, limit, onSnapshot, orderBy,
    query,
    serverTimestamp,
    updateDoc
} from 'firebase/firestore'
import FormControl from "@mui/material/FormControl";
import Button from '@mui/material/Button';
import TextField from "@mui/material/TextField";
import {login, selectUserPhone} from "../../redux/user/userSlice";

//end material ui

const EditForm = ({id, name, email, phone}) => {
    const dispatch = useDispatch()

    const [formData, setFormData] = useState({
        show: false,
        showInfo: true,
        id:'',
        displayName: null,
        email: null,
        phone: null
    });

    useEffect(() => {
        setFormData({...formData, displayName: name, email: email, id: id, phone: phone})

    }, []);



    const payReady = (e) => {
        e.preventDefault();
        if(name!==formData.displayName||email!==formData.email){
            updateEmail(auth.currentUser, formData.email).then()
            updateProfile(auth.currentUser, {
                displayName: formData.displayName
            }).then()
            dispatch(login({
                email: formData.email,
                uid: auth.currentUser.uid,
                displayName: formData.displayName,
            }))
        }
        if(phone!==formData.phone){
            updateDoc(doc(db, 'usersData', id),{
                phoneNumber: formData.phone
            }).then(()=>{
                dispatch(updatePhoneNumber({phoneNumber: formData.phone}))
            })
        }

        // dispatch(editUser(id, formData));
        // history.push('/')
    };

    return (
        <Fragment>

                <form onSubmit={payReady}>
                    <FormControl style={{marginBottom: 8}}>
                        <TextField
                            label="Nombre"
                            name='displayName'
                            value={formData.displayName}
                            onChange={e => setFormData({ ...formData, [e.target.name]: e.target.value })}
                            fullWidth
                        />
                    </FormControl>

                        <FormControl style={{marginTop: 10}}>
                            <TextField
                                label="número de teléfono"
                                name='phone'
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, [e.target.name]: e.target.value })}
                                fullWidth
                            />
                        </FormControl>

                    <div>
                        <Button style={{margin: '20px 0 10px'}} type='submit' variant="contained" color="primary">
                            confirmar
                        </Button>
                    </div>
                </form>

        </Fragment>
    );

};

export default EditForm;