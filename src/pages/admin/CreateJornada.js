import React, {Fragment, useState, useEffect} from "react";

import {useDispatch, useSelector} from "react-redux";
import {
    collection, addDoc,
    query, orderBy, serverTimestamp, limit,
    onSnapshot, getDocs, where
} from "firebase/firestore";
import {db} from '../../config-firebase/firebase'
// material ui imports for styling
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
import {Redirect} from "react-router-dom";
import {selectUser} from "../../redux/user/userSlice";

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    marginBottom: 60,
    paddingBottom: 8
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
    textAlign: 'center',
    width: 300,
    margin: '2px auto 7px auto'
}));

const StyledTextExtra = styled(Typography)(({ theme }) => ({
    ...theme.typography.body2,
    background: 'linear-gradient(45deg, #e56b6f 8%, #d00000 80%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(11, 82, 91, .5)',
    color: 'white',
    padding: 5,
    fontSize: 18,
    textAlign: 'center',
    width: 300,
    margin: '2px auto 7px auto'
}));

const CreateJornada = () => {
    //react hooks
    const dispatch = useDispatch()
    const user = useSelector(selectUser)
    // useEffect(() => {
    //     dispatch(getJornadaAction())
    // }, []);

    const [text, setText] = useState();
    const [form, setForm] = useState({
        num: '',
        prize: '1000',
        start: '',
        end: ''

    });

    const {num, prize, start, end} = form

    //make a copy of the current state, get the name from input name = input value
    const onChange = e => setText(e.target.value)
    const onChangeNum = e =>
        setForm({ ...form, [e.target.name]: e.target.value });


    //for the 9 official games
    const [theArray, setTheArray] = useState([]);
    let gameNumber = 1
    const addEntryClick = (e) => {
        setTheArray([...theArray, e.target.value]);
        gameNumber += 1
        setText('')
    };

    //for the extra games if one of the 9 official games gets cancelled
    const [theArrayExtra, setTheArrayExtra] = useState([])
    const [textExtra, setTextExtra] = useState();
    const onChangeExtra = e => setTextExtra(e.target.value)

    let gameNumberExtra = 1
    const addEntryClickExtra = (e) => {
        setTheArrayExtra([...theArrayExtra, e.target.value]);
        gameNumberExtra += 1
        setTextExtra('')
    };



    const onSubmit = async (e) => {
        e.preventDefault();
        let fiveDigitNum = await Math.floor(1000 + Math.random() * 90000);
        if(user.user.uid==='RO8bagM0g0SSnoLcdKWfmB91aM52'){

            list = [];
            for (const [key, value] of Object.entries(theArray)) {
                list.push(
                    {
                        index: key,
                        gameName: theArray[key],
                        homeResult: 0,
                        awayResult: 0,
                        canceled: false,
                        gamePlayed: false
                    })
            }

            listExtra = [];
            for (const [key, value] of Object.entries(theArrayExtra)) {
                listExtra.push(
                    {
                        index: key,
                        gameName: theArrayExtra[key],
                        homeResult: 0,
                        awayResult: 0,
                        canceled: false,
                        gamePlayed: false
                    })
            }

            await addDoc(collection(db, "jornadas"), {
                user: "admin",
                activeJornada: false,
                startDate: start,
                endDate: end,
                timestamp: serverTimestamp(),
                prize: parseInt(prize),
                openToBuy: true,
                fiveDigitId: fiveDigitNum,
                jornadaNumber: parseInt(num),
                games: list,
                gamesExtra: listExtra
            })
        }

    };

    let list = theArray.map(item =>{
        return(
            <StyledText>
                {item}
            </StyledText>
        )
    })

    let listExtra = theArrayExtra.map(item =>{
        return(
            <StyledTextExtra>
                {item}
            </StyledTextExtra>
        )
    })

    return (
        <Fragment>
            <Box sx={{ flexGrow: 1 }} style={{minHeight: '100vh'}}>
                <Grid container spacing={1} justifyContent="center">
                    <Grid item sm={11} lg={7} xs={11}>
                        <Item elevation={6}>
                            <form onSubmit={e => onSubmit(e)} style={{marginTop: 10}}>
                                <Grid container spacing={1} justifyContent="center">
                                    <Grid item sm={10} lg={11} xs={11}>
                                        {theArray.length<9?
                                            <>
                                                <Typography component="div" variant="h5" color="text.primary">
                                                    add game {theArray.length+1}
                                                </Typography>
                                                <FormControl>
                                                    <TextField
                                                        id="outlined-multiline-flexible"
                                                        multiline
                                                        label="ex: Pumas vs Toluca"
                                                        maxRows={4}
                                                        name='text'
                                                        value={text}
                                                        onChange={onChange}
                                                    />
                                                </FormControl>
                                            </>
                                            :
                                            theArrayExtra.length<2?
                                                <>
                                                    <Typography component="div" variant="h5" color="text.primary">
                                                        add extra game {theArrayExtra.length+1}
                                                    </Typography>
                                                    <FormControl>
                                                        <TextField
                                                            id="outlined-multiline-flexible"
                                                            multiline
                                                            maxRows={4}
                                                            name='textExtra'
                                                            value={textExtra}
                                                            onChange={onChangeExtra}
                                                        />
                                                    </FormControl>
                                                </>
                                                :
                                                    <Typography component="div" variant="h5" color="text.primary">
                                                        click to submit all 9 games
                                                    </Typography>
                                        }
                                    </Grid>
                                    <Grid item sm={10} lg={11} xs={11}>
                                        <FormControl>

                                            <TextField
                                                id="outlined-multiline-flexible"
                                                label="Jornada"
                                                multiline
                                                maxRows={4}
                                                name='num'
                                                value={num}
                                                onChange={onChangeNum}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item sm={10} lg={11} xs={11}>
                                        <FormControl>

                                            <TextField
                                                id="outlined-multiline-flexible"
                                                label="Premio $"
                                                multiline
                                                maxRows={4}
                                                name='prize'
                                                value={prize}
                                                onChange={onChangeNum}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item sm={10} lg={11} xs={11}>
                                        <FormControl>

                                            <TextField
                                                id="outlined-multiline-flexible"
                                                label="Empieza"
                                                multiline
                                                maxRows={4}
                                                name='start'
                                                value={start}
                                                onChange={onChangeNum}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item sm={10} lg={11} xs={11}>
                                        <FormControl>

                                            <TextField
                                                id="outlined-multiline-flexible"
                                                label="Termina"
                                                multiline
                                                maxRows={4}
                                                name='end'
                                                value={end}
                                                onChange={onChangeNum}
                                            />
                                        </FormControl>
                                    </Grid>
                                    {theArray.length===9&&theArrayExtra.length===2?
                                        <Button style={{margin: 10}} type="submit" variant="contained" color="primary">submit</Button>
                                        :
                                        null
                                    }
                                </Grid>
                            </form>
                            {theArray.length<9?
                                <Button style={{margin: 10}} variant="contained" color="primary" onClick={addEntryClick} value={text}>add</Button>
                                :
                                null
                            }
                            {list}

                            {theArrayExtra.length<2&&theArray.length===9?
                                <Button style={{margin: 10}} variant="contained" color="primary" onClick={addEntryClickExtra} value={textExtra}>add extra</Button>
                                :
                                null
                            }
                            {listExtra}
                        </Item>
                    </Grid>
                </Grid>
            </Box>
        </Fragment>
    )
}

export default CreateJornada;