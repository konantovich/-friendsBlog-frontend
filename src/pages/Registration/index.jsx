import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { useForm } from "react-hook-form"; //react forms
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux'; 
import { Navigate } from "react-router-dom";

import axios from '../../axios';
import { mainUrl } from '../../mainUrl';
import { fetchRegister, selectIsAuth } from "../../redux/slices/auth";
import styles from './Login.module.scss';


export const Registration = () => {

  const isAuth = useSelector(selectIsAuth)
  const dispatch = useDispatch();

  //avatar image upload
  const [avatarUrl, setAvatarUrl] = React.useState("");
  const inputFileRef = React.useRef(null);
  const handleChangeFile = async (event) => {

    try {
      const formData = new FormData(); 
      const file = event.target.files[0]; //image
      formData.append("image", file); //conver image to formData
      const { data } = await axios.post("/upload/avatars", formData); //response image data
      setAvatarUrl(data.url);
      console.log(data.url)
    } catch (error) {
      console.log(error);
      alert("error upload image", error);
    }
  };
  const onClickRemoveImage = () => {
    setAvatarUrl(""); //delete image
  };

  const { register, handleSubmit, setError, clearErrors, formState: { errors, isValid } } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      password: ''
    },
    mode: 'onChange'
})

  const onSubmit = async (values) => { 

    let dataWithImage = {}
    if (avatarUrl) {
      dataWithImage =  {
        ...values,
        avatarUrl
      }
    }
    
    //register with image url or without
    const data = (avatarUrl ? await dispatch(fetchRegister(dataWithImage)) : await dispatch(fetchRegister(values)))

    if (!data.payload) { //if undefined 
      return alert('error register')
    }
       //if have token in data.payload 
       if ('token' in data.payload) {
        window.localStorage.setItem('token', data.payload.token) //save in localStorage
      } else {
        alert('failed to register!')
      }
  }

  if (isAuth) {
    return <Navigate to='/'/>
  }

  return (
    <Paper elevation={1} classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
      Create account
      </Typography>
      <div className={styles.avatar}>
       {!avatarUrl && <Avatar 
          sx={{ width: 100, height: 100 }} 
          onClick={() => inputFileRef.current.click()}
          variant="outlined"
          size="large"/>}
      <input
        ref={inputFileRef}
        type="file"
        onChange={handleChangeFile}
        hidden
      />
      {avatarUrl && (
        <>
          <IconButton aria-label="delete"
        
            onClick={onClickRemoveImage}
          >
           <DeleteIcon />
          </IconButton>
          <img
            className={styles.image}
            src={mainUrl+avatarUrl}
            alt="Uploaded"
          />
        
        </>
      )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}> 
      <TextField  
          className={styles.field}
          label="Full name"
         
          error={Boolean(errors.fullName?.message)} //red color if error
          helperText={errors.fullName?.message}//return error text
          {...register('fullName', { required: 'Enter the full Name' })}
          fullWidth
        />
         <TextField
          className={styles.field}
          label="E-Mail"
          type="email" //browser validation
          error={Boolean(errors.email?.message)} 
          helperText={errors.email?.message}
          {...register('email', { required: 'Enter the mail' })}
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
        Register
        </Button>
      </form>
    </Paper>
  );
};
