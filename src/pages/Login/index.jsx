import React from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { useForm } from "react-hook-form"; //react forms
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux'; 

import styles from "./Login.module.scss";
import { fetchAuth, selectIsAuth } from "../../redux/slices/auth";
import { Navigate } from "react-router-dom"; 

export const Login = () => {

  const isAuth = useSelector(selectIsAuth)
  const dispatch = useDispatch();



  //...register - register login/pass fields
  //useForm have state
  const { register, handleSubmit, setError, formState: { errors, isValid } } = useForm({
      defaultValues: { 
        email: '',
        password: ''
      },
      mode: 'onChange' //validations do after click submit form button
  })

  const onSubmit = async (values) => { //if validations ok
   
    const data = await dispatch(fetchAuth(values))//login data from backend


    if (!data.payload) { //if undefined
      return alert('error login', setError)
    }
       if ('token' in data.payload) { //if have login token on data.payload
        window.localStorage.setItem('token', data.payload.token) //save token in localStorage
      } else {
        alert('failed to login!')
      }

  }

  // console.log(errors, isValid) //isValid say valid form or not. errors watch problems

  // console.log('isAuth', isAuth)

  if (isAuth) {//if login ok, got to main page
    return <Navigate to='/'/>
  }

  return (
    <Paper elevation={1} classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Login
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}> 
        <TextField
          className={styles.field}
          label="E-Mail"
          type="email" //browser validation
          error={Boolean(errors.email?.message)} //red color if error
          helperText={errors.email?.message}//return error text
          {...register('email', { required: 'Enter the mail'})}
          fullWidth
        />
        <TextField 
          className={styles.field} 
          label="Password"
          type="password"
          error={Boolean(errors.password?.message)} 
          helperText={errors.password?.message}
           {...register('password', { required: 'Enter the password' })}
         fullWidth />
        <Button disabled={!isValid} type='submit' size="large" variant="contained" fullWidth>
          Login
        </Button>
      </form>
    </Paper>
  );
};
