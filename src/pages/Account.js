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
    const myPhoneNumber = useSelector(selectUserPhone)

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
                                            {user.photoURL?
                                                <Avatar src={user.photoURL}/>
                                                :
                                                <AccountBoxIcon/>
                                            }
                                        </Divider>
                                    </div>

                                </Grid>
                                <Fragment>
                                    <Grid item sm={12} lg={12} xs={12}>
                                        <Typography variant="h5" component="div" style={{color: '#004e98'}}>
                                            {user.displayName}
                                        </Typography>
                                    </Grid>
                                    <Grid item sm={12} lg={12} xs={12}>
                                        <Typography variant="h5" component="div" style={{color: '#004e98', margin: 8}}>
                                            {user.email}
                                        </Typography>
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
                                        <EditForm name={user.displayName} email={user.email} id={user._id} phone={myPhoneNumber}/>
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