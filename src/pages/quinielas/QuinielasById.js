import React, {Fragment, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {collection, getDocs, limit, orderBy, query, where, doc, getDoc} from "firebase/firestore";
import QuinielaComp from "../../components/quinielas/QuinielaComp";
import {db} from "../../config-firebase/firebase";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Grid from "@mui/material/Grid";
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import TextField from "@mui/material/TextField";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import CardMedia from '@mui/material/CardMedia';
import Select from "@mui/material/Select";
import {useParams} from "react-router-dom";


//end material ui

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    margin:5
}));

const StyledText = styled(Typography)(({ theme }) => ({
    ...theme.typography.body2,
    background: 'linear-gradient(45deg, #02CC92 8%, #1283C9 80%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(11, 82, 91, .5)',
    color: 'white',
    padding: 5,
    fontSize: 18,
    textAlign: 'center'
}));

const StyledTextTwo = styled(Typography)(({ theme }) => ({
    ...theme.typography.body2,
    background: 'black',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(11, 82, 91, .5)',
    color: 'white',
    padding: 5,
    fontSize: 18,
    textAlign: 'center'
}));

const StyledTextThree = styled(Typography)(({ theme }) => ({
    ...theme.typography.body2,
    background: 'linear-gradient(45deg, #80ed99 30%, #57cc99 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(11, 82, 91, .5)',
    color: 'white',
    padding: 5,
    fontSize: 18,
    textAlign: 'center'
}));

const QuinielasById = () => {
    const params = useParams();
    const dispatch = useDispatch()
    const[item, setItem] = useState()

    useEffect(() => {
        let obj = doc(db, 'quinielas', params.id)
        const docSnap = getDoc(obj).then(x=>{
            setItem(x.data())
        })
    }, [params.id]);

    if(item){
        return (
            <Box sx={{ flexGrow: 1 }}>
                <Grid  container spacing={1} justifyContent="center">
                    <Grid item sm={11} lg={6} xs={11}>
                        <div>
                            {item?
                                <QuinielaComp game={item} showScore={true}/>
                                :
                                null
                            }
                        </div>
                    </Grid>
                </Grid>
            </Box>
        );

    }else {
        return (
            <p>loading..</p>
        )
    }


};

export default QuinielasById;