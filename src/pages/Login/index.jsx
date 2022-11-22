import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { useForm } from 'react-hook-form'; //react forms
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import jwt_decode from 'jwt-decode';
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';

import { useNavigate } from "react-router-dom";

import styles from './Login.module.scss';
import {
   fetchAuth,
   selectIsAuth,
   fetchRegister,
   fetchGoogleAuthOrRegister
} from '../../redux/slices/auth';
import { Navigate } from 'react-router-dom';

import axios from '../../axios';
import { createAwait } from 'typescript';

export const Login = () => {
   const isAuth = useSelector(selectIsAuth);
   const dispatch = useDispatch();
   const navigate = useNavigate();

   const responseGoogle = useGoogleLogin({
      onSuccess: async (response) => {
         try {
            const googleData = await axios.get(
               'https://www.googleapis.com/oauth2/v3/userinfo',
               {
                  headers: {
                     Authorization: `Bearer ${response.access_token}`
                  }
               }
            );

            const data =  dispatch(fetchGoogleAuthOrRegister(googleData.data));
            console.log('googleData',data.requestId)

            if (!data) {

              return alert('error login', setError);
           }

           if ('requestId' in data) {
            console.log('googleData',data.requestId)
              //if have login token on data.payload
              window.localStorage.setItem('token', data.requestId); //save token in localStorage
              dispatch(fetchAuth(data.requestId));
              // <Navigate to='/' />
              navigate('/')
           } else {
              alert('failed to login!');
           }
 
         } catch (e) {
            console.log(e);
         }
      }
   });

   // console.log('response', credentialResponse);

   // var decoded = jwt_decode(credentialResponse.credential);

   // axios
   //    .get( {
   //     headers: {
   //       "Autorization": "Bearer"
   //     }
   //    })
   //    .then((response) => {
   //       console.log(response);

   //       // <Navigate to='/' />;
   //    })
   //    .catch((error) => {
   //       console.log('error', error);
   //    });

   //...register - register login/pass fields
   //useForm have state
   const {
      register,
      handleSubmit,
      setError,
      formState: { errors, isValid }
   } = useForm({
      defaultValues: {
         email: '',
         password: ''
      },
      mode: 'onChange' //validations do after click submit form button
   });

   const onSubmit = async (values) => {
      //if validations ok

      const data = await dispatch(fetchAuth(values)); //login data from backend

      if (!data.payload) {
         //if undefined
         return alert('error login', setError);
      }
      if ('token' in data.payload) {
         //if have login token on data.payload
         window.localStorage.setItem('token', data.payload.token); //save token in localStorage
      } else {
         alert('failed to login!');
      }
   };

   // console.log(errors, isValid) //isValid say valid form or not. errors watch problems

   // console.log('isAuth', isAuth)

   if (isAuth) {
      //if login ok, got to main page
      return <Navigate to='/' />;
   }

   return (
      <Paper elevation={1} classes={{ root: styles.root }}>
         <Typography classes={{ root: styles.title }} variant='h5'>
            Login
         </Typography>
         <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
               className={styles.field}
               label='E-Mail'
               type='email' //browser validation
               error={Boolean(errors.email?.message)} //red color if error
               helperText={errors.email?.message} //return error text
               {...register('email', { required: 'Enter the mail' })}
               fullWidth
            />
            <TextField
               className={styles.field}
               label='Password'
               type='password'
               error={Boolean(errors.password?.message)}
               helperText={errors.password?.message}
               {...register('password', { required: 'Enter the password' })}
               fullWidth
            />
            <Button
               disabled={!isValid}
               type='submit'
               size='large'
               variant='contained'
               fullWidth
            >
               Login
            </Button>
         </form>
         <GoogleLogin onSuccess={responseGoogle} onError={responseGoogle} />;
      </Paper>
   );
};
