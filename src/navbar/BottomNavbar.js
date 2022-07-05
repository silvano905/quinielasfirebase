import React from 'react';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import CreateIcon from '@mui/icons-material/Create';
import Box from '@mui/material/Box';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import HomeIcon from '@mui/icons-material/Home';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Fab from '@mui/material/Fab';
import ForumIcon from '@mui/icons-material/Forum';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Avatar from '@mui/material/Avatar';
import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import MoreIcon from '@mui/icons-material/MoreVert';
import {useSelector} from "react-redux";
import {selectUser} from "../redux/user/userSlice";
const StyledFab = styled(Fab)({
    position: 'absolute',
    zIndex: 1,
    top: -8,
    left: 0,
    right: 0,
    margin: '0 auto',
    background: '#f8f9fa',
    color: 'blue'
});

function BottomNavbar() {
    const currentUser = useSelector(selectUser)

    return (
        <div>
            <AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0 }}>
                <Toolbar style={{background: "ghostwhite"}}>
                    <IconButton color="inherit" aria-label="open drawer">
                        <Link to='/' style={{color: 'blue', textDecoration: 'none', marginLeft: 20}}>
                            <HomeIcon fontSize='large'/>
                        </Link>
                    </IconButton>
                    <IconButton color="inherit" aria-label="open drawer">
                        <Link to='/results' style={{color: 'blue', textDecoration: 'none', marginLeft: 20}}>
                            <EmojiEventsIcon fontSize='large'/>
                        </Link>
                    </IconButton>
                    <Link to='/buy' style={{color: 'blue', textDecoration: 'none', marginLeft: 20}}>
                        <StyledFab aria-label="add">
                            <AddIcon fontSize='large'/>
                        </StyledFab>
                    </Link>

                    <Box sx={{ flexGrow: 1 }} />
                    <IconButton color="inherit">
                        <Link to='/cart' style={{color: 'blue', textDecoration: 'none', marginRight: 20}}>
                            <ShoppingCartIcon fontSize='large'/>
                        </Link>
                    </IconButton>

                    <IconButton color="inherit">
                        <Link to='/myQuinielas' style={{color: 'blue', textDecoration: 'none', marginRight: 20}}>
                            <AccountBoxIcon fontSize='large'/>
                        </Link>
                    </IconButton>
                    {/*<IconButton color="inherit">*/}
                    {/*    <MoreIcon />*/}
                    {/*</IconButton>*/}
                </Toolbar>
            </AppBar>
            <Toolbar/>

        </div>
    );
}

export default BottomNavbar;