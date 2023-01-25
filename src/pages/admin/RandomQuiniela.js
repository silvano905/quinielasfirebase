import React, {Fragment, useState, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom"
import {selectJornada, selectNextJornada} from "../../redux/jornadas/jornadasSlice";
import { db } from '../../config-firebase/firebase'
import {collection, addDoc, serverTimestamp, query, orderBy, where, getDocs, writeBatch, doc} from 'firebase/firestore'
import { v4 as uuidv4 } from 'uuid';
import {setAlert, removeAlert} from "../../redux/alerts/alertsSlice";
// material ui imports for styling
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Grid from "@mui/material/Grid";
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import {getCart} from "../../redux/cart/cartSlice";
const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    marginTop: 15,
    color: theme.palette.text.secondary,
    background: '#fdfffc',
    boxShadow: '0 3px 5px 2px rgba(11, 82, 91, .5)',
}));

const StyledText = styled(Typography)(({ theme }) => ({
    ...theme.typography.body2,
    background: '#11468F',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(11, 82, 91, .5)',
    color: 'white',
    padding: 5,
    fontSize: 18,
    textAlign: 'center',
}));

const StyledTextExtra = styled(Typography)(({ theme }) => ({
    ...theme.typography.body2,
    background: '#007f5f',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(11, 82, 91, .5)',
    color: 'white',
    padding: 5,
    fontSize: 18,
    textAlign: 'center',
}));

const StyledTextTwo = styled(Typography)(({ theme }) => ({
    ...theme.typography.body2,
    background: 'black',
    border: 0,
    borderRadius: 3,
    color: 'white',
    padding: 5,
    fontSize: 18,
    textAlign: 'center',
    width: 80,
    margin: '5px auto 5px auto'
}));

const RandomQuiniela = ({user, game}) => {
    const navigate = useNavigate()
    const batch = writeBatch(db);
    const dispatch = useDispatch()
    const currentJornada = useSelector(selectJornada)
    useEffect(() => {
    }, []);

    let games
    if(currentJornada){
        games = {}
        for (let i = 0; i < currentJornada.games.length; i++) {
            let name = currentJornada.games[i].gameName
            games[name] = ''
        }
    }

    //for extra games
    let gamesExtra
    if(currentJornada){
        gamesExtra = {}
        for (let i = 0; i < currentJornada.gamesExtra.length; i++) {
            let name = currentJornada.gamesExtra[i].gameName
            gamesExtra[name] = ''
        }
    }

    const [formData, setFormData] = useState(games);
    //extra games
    const [formDataExtra, setFormDataExtra] = useState(gamesExtra);
    const onChangeExtra = e => setFormDataExtra({...formDataExtra, [e.target.name]: e.target.value})
    //end

    let names = [
        'luis9', 'perronV', '763sv', 'santiago', 'elsebas', 'matias2022', 'niconico',
        'chapito9', 'diegoPerez', 'el n', 'mz', 'emilioMexico', 'leo4545', 'chivista9',
        'angelRendon', 'joseluis3', '93perez', 'paco', 'donJulio', 'vicente Alcaraz'
    ]


    const onSubmit = async (e) => {
        e.preventDefault();
        let ll = ['L', 'E', 'V']
        for (let i = 0; i < 100; i++) {
            let gamesToAdd = [];
            for (const [key, value] of Object.entries(formData)) {
                let yy = Math.floor(Math.random() * 3)
                gamesToAdd.push(
                    {
                        gameName: key,
                        homeResult: 0,
                        awayResult: 0,
                        canceled: false,
                        played: false,
                        correct: false,
                        guess: ll[yy],
                        result: ''
                    })
            }

            let gamesToAddExtra = [];
            for (const [key, value] of Object.entries(formDataExtra)) {
                let yy = Math.floor(Math.random() * 3)
                gamesToAddExtra.push(
                    {
                        gameName: key,
                        homeResult: 0,
                        awayResult: 0,
                        canceled: false,
                        played: false,
                        correct: false,
                        guess: ll[yy],
                        result: ''
                    })
            }

            let p = doc(collection(db, "quinielas"))
            let namesIndex = Math.floor(Math.random() * 20)
            batch.set(p, {
                username: names[namesIndex],
                userId: uuidv4(),
                fiveDigitId: currentJornada.fiveDigitId,
                correct: 0,
                paid: true,
                winner: false,
                jornadaNumber: currentJornada.jornadaNumber,
                games: gamesToAdd,
                gamesExtra: gamesToAddExtra,
                timestamp: serverTimestamp()

            })

        }
        await batch.commit()

    };



        return (
            <Fragment>
                    <Button style={{margin: '-15px auto 5px auto', background: "whitesmoke", color: "black"}} variant="contained" onClick={onSubmit}>agregar</Button>
            </Fragment>
        )

}

export default RandomQuiniela;