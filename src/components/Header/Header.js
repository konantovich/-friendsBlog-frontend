import { MDCRipple } from '@material/ripple';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import React from 'react';

import { selectIsAuth, logout } from '../../redux/slices/auth';
import styles from './Header.module.scss';

export const Header = () => {
   const isAuth = useSelector(selectIsAuth);
   const dispatch = useDispatch();

   const onClickLogout = () => {
      if (window.confirm('Are you sure want to logout?')) {
         dispatch(logout());
         window.localStorage.removeItem('token');
      }
   };

   return (
      <div className={styles.root}>
         <Container maxWidth='lg'>
            <div className={styles.inner}>
               <Link className={styles.logo} to='/'>
                  <div>Main</div>
               </Link>
               <div className={styles.buttons}>
                  {isAuth ? (
                     <>
                        <Link to='/add-post'>
                           <Button variant='contained'>Write a post</Button>
                        </Link>
                        <Button
                           onClick={onClickLogout}
                           variant='contained'
                           color='error'
                        >
                           Exit
                        </Button>
                     </>
                  ) : (
                     <>
                        <Link to='/login'>
                           <Button variant='outlined'>Login</Button>
                        </Link>
                        <Link to='/register'>
                           <Button variant='contained'>Create account</Button>
                        </Link>
                     </>
                  )}
               </div>
            </div>
         </Container>
      </div>
   );
};
