
import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {logout, selectUser} from "../redux/user/userSlice";
import {clearCart} from "../redux/cart/cartSlice";
import {clearMyQuinielas} from "../redux/quinielas/quinielasSlice";
import {auth} from "../config-firebase/firebase";
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Button from '@mui/material/Button';
import PublicIcon from '@mui/icons-material/Public';

const Navbar = () => {
    const dispatch = useDispatch()

    const user = useSelector(selectUser)

    const logoutOfApp = () => {
        dispatch(logout())
        dispatch(clearMyQuinielas())
        dispatch(clearCart())
        auth.signOut().then()
    }

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleMobileMenuOpen = (event) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
        </Menu>
    );

    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >

            {user.user?
                <>
                    <MenuItem onClick={handleMenuClose}>
                        <Typography variant="h6" gutterBottom>
                            <Link to='/account' style={{color: 'blue', textDecoration: 'none'}}>
                                Account
                            </Link>
                        </Typography>
                    </MenuItem>
                    {user.user.uid==='RO8bagM0g0SSnoLcdKWfmB91aM52'&&
                        <MenuItem onClick={handleMenuClose}>
                            <Typography variant="h6" gutterBottom>
                                <Link to='/admin' style={{color: 'blue', textDecoration: 'none'}}>
                                    Admin
                                </Link>
                            </Typography>
                        </MenuItem>
                    }
                </>
                :
                <>
                    <MenuItem onClick={handleMenuClose}>
                        <Typography variant="h6" gutterBottom>
                            <Link to='/login' style={{color: 'blue', textDecoration: 'none'}}>
                                Entrar a mi cuenta
                            </Link>
                        </Typography>
                    </MenuItem>
                    <MenuItem onClick={handleMenuClose}>
                        <Typography variant="h6" gutterBottom>
                            <Link to='/register' style={{color: 'blue', textDecoration: 'none'}}>
                                Crear cuenta
                            </Link>
                        </Typography>
                    </MenuItem>
                    {}
                </>

            }


            {user.user?
                <MenuItem onClick={handleMenuClose}>
                    <Button type="submit" variant="contained" color="primary" onClick={logoutOfApp}>logout</Button>
                </MenuItem>
                :
                null
            }



        </Menu>
    );

    const registered = (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar style={{background: 'white'}}>
                    <Link to="/" style={{color: 'white', textDecoration: 'none'}}>
                        <img src="https://chicagocarhelp.s3.us-east-2.amazonaws.com/192sArtboard+1.png" alt="logo" style={{width: 45, height: "auto"}}/>                    </Link>
                    <Link to="/" style={{color: 'black', textDecoration: 'none', marginLeft: 10}}>
                        <Typography
                            variant="h5"
                            noWrap
                            component="div"
                            style={{fontFamily: 'Cinzel, serif'}}
                        >
                            Quiniela Liga MX
                        </Typography>
                    </Link>
                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                        <Typography variant="h6" gutterBottom>
                            <Link to='/login' style={{color: 'blue', textDecoration: 'none'}}>
                                Login
                            </Link>
                        </Typography>
                    </Box>
                    <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="show more"
                            aria-controls={mobileMenuId}
                            aria-haspopup="true"
                            onClick={handleMobileMenuOpen}
                            color="inherit"
                            style={{color: 'blue'}}

                        >
                            <MenuIcon />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            {renderMobileMenu}
            {renderMenu}
        </Box>
    )
    return (
        <Fragment>{registered}</Fragment>
    );
}


export default Navbar;