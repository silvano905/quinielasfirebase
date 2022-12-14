import React, {Fragment, useState, useEffect} from 'react';
import EditForm from "../components/account/EditForm";
import DeleteAccount from "../components/account/DeleteAccount";
import Grid from "@mui/material/Grid";
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import Divider from "@mui/material/Divider";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import {useSelector} from "react-redux";
import {selectUser, selectUserPhone} from "../redux/user/userSlice";
import Avatar from '@mui/material/Avatar';
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccordionDetails from "@mui/material/AccordionDetails";

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    marginTop: 15,
    color: theme.palette.text.secondary,
    marginBottom: 15,
    background: '#fdfffc',
    boxShadow: '0 3px 5px 2px rgba(11, 82, 91, .5)',
}));

function Account() {
    const [showForm, setShowForm] = useState(false);
    const user = useSelector(selectUser)

    return (
        <Fragment>
            <Box sx={{ flexGrow: 1 }} style={{minHeight: '100vh'}}>
                <Grid container spacing={1} justifyContent="center">
                    <Grid item xs={11} sm={11} lg={7}>
                        <Item elevation={6}>
                            <Grid container spacing={1} justifyContent="center">
                                <Grid item sm={11} lg={12} xs={11}>
                                    <Typography variant="h5" gutterBottom style={{color: '#ffc300', fontFamily: 'Cinzel, serif'}}>
                                        Mi cuenta
                                    </Typography>
                                    <div style={{margin: "auto"}}>
                                        <Divider>
                                            {user.user.photoURL?
                                                <Avatar src={user.user.photoURL}/>
                                                :
                                                <AccountBoxIcon/>
                                            }
                                        </Divider>
                                    </div>

                                </Grid>
                                <Fragment>
                                    <Grid item sm={12} lg={12} xs={12}>
                                        <Typography variant="h5" component="div" style={{color: '#004e98'}}>
                                            {user.user.displayName}
                                        </Typography>
                                    </Grid>
                                    <Grid item sm={12} lg={12} xs={12}>
                                        <Typography variant="h5" component="div" style={{color: '#004e98', margin: 8}}>
                                            {user.user.email}
                                        </Typography>
                                    </Grid>
                                    <Grid item sm={12} lg={12} xs={12}>
                                        {user.userData.country==='México'?
                                            <Avatar alt="Remy Sharp" src="https://chicagocarhelp.s3.us-east-2.amazonaws.com/Flag_of_Mexico_(bordered).svg.png" variant="rounded" style={{margin: "auto"}}/>
                                            :
                                            <Avatar alt="Remy Sharp" src="https://chicagocarhelp.s3.us-east-2.amazonaws.com/800px-Flag_of_the_United_States.svg.png" variant="rounded"  style={{margin: "auto"}}/>
                                        }
                                    </Grid>
                                    <Grid item sm={12} lg={12} xs={12}>
                                        <Accordion style={{background:"linear-gradient(45deg, #14213d 8%, #03071e 80%)", color: 'whitesmoke'}}>
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon style={{color: "white"}}/>}
                                                aria-controls="panel1a-content"
                                                id="panel1a-header"
                                            >
                                                <Typography variant="h6" gutterBottom>Quinielas gratis: {user.userData.freeQuantity}</Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Typography variant="h6" component="div" gutterBottom style={{textAlign: "start"}}>
                                                    Puedes recibir 5 quinielas gratis si invitas a un amigo a jugar y comprar un minimo de 2 quinielas.
                                                </Typography>
                                                <Typography variant="h6" component="div" gutterBottom style={{textAlign: "start", marginTop: 5}}>
                                                    Al comprar las quinielas tu amigo tiene que ingresar tu cupon de usuario que es el: <span style={{color: "#ffba08"}}>{user.userData.userCouponCode}</span>
                                                </Typography>
                                            </AccordionDetails>
                                        </Accordion>
                                    </Grid>
                                    <Grid item sm={12} lg={12} xs={12}>
                                        <Accordion style={{background:"linear-gradient(45deg, #14213d 8%, #03071e 80%)", color: 'whitesmoke'}}>
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon style={{color: "white"}}/>}
                                                aria-controls="panel1a-content"
                                                id="panel1a-header"
                                            >
                                                <Typography variant="h6" gutterBottom>Amigos referidos: {user.userData.totalReferredFriends}/5</Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Typography variant="h6" component="div" gutterBottom style={{textAlign: "start"}}>
                                                    Puedes referir un limite de 5 amigos.
                                                </Typography>
                                                <Typography variant="h6" component="div" gutterBottom style={{textAlign: "start", marginTop: 5}}>
                                                    Cupon de usuario: <span style={{color: "#ffba08"}}>{user.userData.userCouponCode}</span>
                                                </Typography>
                                            </AccordionDetails>
                                        </Accordion>
                                    </Grid>
                                </Fragment>
                                {showForm?
                                    <Grid item sm={12} lg={12} xs={12}>
                                        <Button style={{margin: 10}} variant="contained" color="warning" onClick={() => setShowForm(!showForm)}>cancelar</Button>
                                    </Grid>
                                    :
                                    <Grid item sm={12} lg={12} xs={12}>
                                        <Button variant="contained" color="primary"
                                                onClick={() => setShowForm(!showForm)}
                                                style={{margin: 10}}
                                        >cambiar información</Button>
                                    </Grid>
                                }

                                {showForm ?
                                    <Grid item sm={12} lg={12} xs={12}>
                                        <EditForm name={user.user.displayName} email={user.user.email} id={user.user.uid} phone={user.userData.phoneNumber}/>
                                    </Grid>
                                    :
                                    null
                                }

                                <Grid item sm={12} lg={6} xs={12}>
                                    <MoreHorizIcon/>
                                </Grid>
                            </Grid>
                        </Item>
                    </Grid>
                </Grid>
                <DeleteAccount/>
            </Box>
        </Fragment>
    );
}

export default Account;