import React from "react";

import { SideBlock } from "./SideBlock";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import Skeleton from "@mui/material/Skeleton";

import axios from "../axios"; 
import { mainUrl } from '../mainUrl'
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux"; 
import { useDispatch } from "react-redux"; 


import { fetchAddComment } from '../redux/slices/posts'
import { AddComment } from "../components/AddComment";



export const CommentsBlock = ({ items, children, isLoading = true }) => {


  const [comments, setComments] = React.useState([]);
  const [userData, setUserData] = React.useState( useSelector((state) => state.auth.data));

  const { id } = useParams();

  const dispatch = useDispatch();
  const commentsData = useSelector((state) => state.posts.posts);

  const isCommentsLoading = commentsData.status === "loaded"; 

  React.useEffect(() => {

    if (id) {
      axios
      .get(`/posts`) 

      .then((res) => {
        const currentPost = res.data.filter((obj) => obj._id === id)
        setComments(currentPost[0].comments)
        })
        .catch((err) => console.log("get post error", err));
    }

    axios.get('/auth/me').then((res) =>{
      setUserData(res.data.userData)
    
     })

  }, [isCommentsLoading])


  const handleClickPost = async  (event) => {

    event.preventDefault()

    dispatch(fetchAddComment({'id': id, 'userData': userData, 'text': event.target[0].value}))

    event.target.reset()

  };

  return (
    <SideBlock title="Comments">
      <List>
        {(isLoading ? [...Array(5)] : comments).map((obj, index) => (
           <React.Fragment key={index}>
           <ListItem alignItems="flex-start">
             <ListItemAvatar>
               {isLoading ? (
                 <Skeleton variant="circular" width={40} height={40} />
               ) : (
                 <Avatar alt={obj.user.fullName} src={mainUrl+obj.user.avatarUrl} />
               )}
             </ListItemAvatar>
             {isLoading ? (
               <div style={{ display: "flex", flexDirection: "column" }}>
                 <Skeleton variant="text" height={25} width={120} />
                 <Skeleton variant="text" height={18} width={230} />
               </div>
             ) : (
               <ListItemText
                 primary={obj.user.fullName ?? ''}
                 secondary={obj.comment ?? ''}
               />
             )}
           </ListItem>
           <Divider variant="inset" component="li" />
         </React.Fragment>
        ))}
      </List>
      {children}
      <AddComment handleClickPost={handleClickPost} data={userData} />
    </SideBlock>
  );
};
