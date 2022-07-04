import React, {Fragment, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {db} from '../../config-firebase/firebase'
import {deleteQuiniela} from "../../redux/cart/cartSlice";
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
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import FaceIcon from '@mui/icons-material/Face';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import {Link} from "react-router-dom";
//end material ui

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    margin: ' -5px auto 9px auto'
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

const StyledTextExtra = styled(Typography)(({ theme }) => ({
    ...theme.typography.body2,
    background: 'linear-gradient(45deg, #d8572a 8%, #c32f27 80%)',
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

const StyledTextThree = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(11, 82, 91, .5)',
    color: 'black',
    padding: 5,
    fontSize: 18,
    textAlign: 'center'
}));

const StyledTextWrong = styled(Typography)(({ theme }) => ({
    ...theme.typography.body2,
    background: 'linear-gradient(45deg, #ff9100 30%, #ff5400 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(11, 82, 91, .5)',
    color: 'white',
    padding: 5,
    fontSize: 18,
    textAlign: 'center'
}));

const StyledTextCorrect = styled(Typography)(({ theme }) => ({
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

const StyledCard = styled(Card)(({ theme }) => ({
    ...theme.typography.body2,
    background: 'linear-gradient(45deg, #80ed99 30%, #57cc99 90%)',
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(11, 82, 91, .5)',
    margin:'10px auto 10px auto'
}));

const StyledTextFour = styled(Typography)(({ theme }) => ({
    ...theme.typography.body2,
    background: 'black',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(11, 82, 91, .5)',
    color: 'white',
    padding: 5,
    fontSize: 18,
    textAlign: 'center',
    margin: '-10px auto 2px auto'
}));

const QuinielaComp = ({game, showScore, showDelete, id}) => {
    const dispatch = useDispatch()

    const deleteQuinielaFromCart = (e) => {
        e.preventDefault()
        const docRef = doc(db, 'quinielas', id)
        deleteDoc(docRef).then()
        dispatch(deleteQuiniela(id))
    }

    const[show, setShow] = useState(false)

    let list = game.games.map(item => {
        return(
            <>
                {item.gamePlayed?
                    <Grid item sm={1} lg={2} xs={1}>
                        <StyledTextTwo>
                            {item.homeResult}
                        </StyledTextTwo>
                    </Grid>
                    :
                    !item.canceled?
                    <Grid item sm={1} lg={2} xs={1}>
                        <StyledTextTwo>
                            -
                        </StyledTextTwo>
                    </Grid>
                        :
                        null
                }
                {item.canceled?
                    <Grid item sm={10} lg={6} xs={10}>
                        <StyledText>
                            {item.gameName} <span style={{color: "darkred"}}> - cancelado</span>
                        </StyledText>
                    </Grid>
                    :
                    <Grid item sm={8} lg={6} xs={8}>
                        <StyledText>
                            {item.gameName}
                        </StyledText>
                    </Grid>
                }
                {item.gamePlayed?
                    <Grid item sm={1} lg={2} xs={1}>
                        <StyledTextTwo>
                            {item.awayResult}
                        </StyledTextTwo>
                    </Grid>
                    :
                    !item.canceled?
                    <Grid item sm={1} lg={2} xs={1}>
                        <StyledTextTwo>
                            -
                        </StyledTextTwo>
                    </Grid>
                        :
                        null
                }
                {item.correct&&item.gamePlayed?
                    <Grid item sm={2} lg={2} xs={2}>
                        <StyledTextCorrect>
                            {item.guess}
                        </StyledTextCorrect>
                    </Grid>
                    :
                    item.gamePlayed&&!item.correct?
                        <Grid item sm={2} lg={2} xs={2}>
                            <StyledTextWrong>
                                {item.guess}
                            </StyledTextWrong>
                        </Grid>
                        :
                        <Grid item sm={2} lg={2} xs={2}>
                            <StyledTextThree>
                                {item.guess}
                            </StyledTextThree>
                        </Grid>
                }

            </>
        )
    })

    let listExtra = game.gamesExtra.map(item => {
        return(
            <>
                {item.gamePlayed?
                    <Grid item sm={1} lg={2} xs={1}>
                        <StyledTextTwo>
                            {item.homeResult}
                        </StyledTextTwo>
                    </Grid>
                    :
                    <Grid item sm={1} lg={2} xs={1}>
                        <StyledTextTwo>
                            -
                        </StyledTextTwo>
                    </Grid>
                }
                <Grid item sm={8} lg={6} xs={8}>
                    <StyledTextExtra>
                        {item.gameName}
                    </StyledTextExtra>
                </Grid>
                {item.gamePlayed?
                    <Grid item sm={1} lg={2} xs={1}>
                        <StyledTextTwo>
                            {item.awayResult}
                        </StyledTextTwo>
                    </Grid>
                    :
                    <Grid item sm={1} lg={2} xs={1}>
                        <StyledTextTwo>
                            -
                        </StyledTextTwo>
                    </Grid>
                }
                {item.correct&&item.gamePlayed?
                    <Grid item sm={2} lg={2} xs={2}>
                        <StyledTextCorrect>
                            {item.guess}
                        </StyledTextCorrect>
                    </Grid>
                    :
                    item.gamePlayed&&!item.correct?
                        <Grid item sm={2} lg={2} xs={2}>
                            <StyledTextWrong>
                                {item.guess}
                            </StyledTextWrong>
                        </Grid>
                        :
                        <Grid item sm={2} lg={2} xs={2}>
                            <StyledTextThree>
                                {item.guess}
                            </StyledTextThree>
                        </Grid>
                }

            </>
        )
    })

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <StyledCard>
                    <CardContent>
                        <Item>
                            <Grid  container spacing={1} justifyContent="center">
                                <Grid item>
                                    <Chip icon={<FaceIcon />} label={game.username} style={{margin: '2px 0px 2px 0px'}}/>
                                </Grid>
                                <Grid item>
                                    <Typography variant="h5" component="div" gutterBottom style={{margin: '2px 0px 2px 0px'}}>
                                        Jornada {game.jornadaNumber}
                                    </Typography>
                                </Grid>

                                {/*<Grid item sm={4} lg={2} xs={4}>*/}
                                {/*    <BorderColorIcon style={{margin: '-5px 0px -5px 0px'}}/>*/}
                                {/*</Grid>*/}

                            </Grid>
                        </Item>
                        <Grid  container spacing={1} justifyContent="center">
                            {list}
                            {show?
                                <>
                                    <Typography variant="h6" component="div" gutterBottom style={{margin: "10px auto 10px auto", textAlign: "center"}}>
                                        Si un partido de los 9 se suspende entonce se usará el primer partido alternativo. Si dos
                                        partidos de los 9 se suspende entonces se usaran los dos partidos alternativos.
                                    </Typography>
                                    {listExtra}
                                </>
                                :
                                null
                            }
                        </Grid>

                        <div style={{margin: "12px auto -3px auto", textAlign: "center"}}>
                            <Button onClick={()=>setShow(!show)} variant="outlined" size='small'>partidos alternativos</Button>
                        </div>

                    </CardContent>
                    <CardActions>
                        {showScore?
                            <StyledTextFour>Puntos: {game.correct}</StyledTextFour>
                            :
                            null
                        }
                        {showDelete?
                            <Button onClick={deleteQuinielaFromCart} variant="contained" color="secondary">Borrar</Button>
                            :
                            null
                        }
                    </CardActions>
                </StyledCard>
            </Box>
        </>
    );

};

export default QuinielaComp;