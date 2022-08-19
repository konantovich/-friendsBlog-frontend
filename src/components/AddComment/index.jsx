import React from "react";

import styles from "./AddComment.module.scss";

import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { useSelector } from "react-redux"; 

import { mainUrl } from '../../mainUrl'
import { selectIsAuth } from "../../redux/slices/auth";

export const AddComment = ({ handleClickPost, data }) => {
 
  const isAuth = useSelector(selectIsAuth);

  return (
    <>
      {isAuth ? (
        <div className={styles.root}>
          <Avatar
            classes={{ root: styles.avatar }}
            src={data.avatarUrl ? mainUrl+data.avatarUrl : '/noavatar.png'}
          />
          <form onSubmit={handleClickPost} className={styles.form}>
            <TextField
              label="Add comment"
              variant="outlined"
              maxRows={10}
              multiline
              type="text"
            
              fullWidth
            />
            <Button type="submit" variant="contained" >
              Send
            </Button>
            
          </form>
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
};
