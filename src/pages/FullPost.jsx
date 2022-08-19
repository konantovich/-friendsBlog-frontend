import React from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown"; //beautiful text
import { Typography } from '@mui/material';
import { useSelector } from "react-redux"; 

import axios from "../axios";
import { mainUrl } from '../mainUrl'
import { Post } from "../components/Post";
import { CommentsBlock } from "../components/CommentsBlock";


export const FullPost = () => {
  const { id } = useParams(); //post _id from url link

  const [data, setData] = React.useState();
  const [isLoading, setLoading] = React.useState(true);

  const [didMount, setDidMount] = React.useState(true);

  //For comments count
  const [commentsCount, setCommentsCount] = React.useState([]);
  const commentsData = useSelector((state) => state.posts.posts)
  const isCommentsLoading = commentsData.status === "loaded"; 

  React.useEffect(() => {

    if (didMount) {
      axios
      .get(`/posts/${id}`) //find post
      .then((res) => {
        setData(res.data);
        setLoading(false);
        setCommentsCount(res.data.commentsCount)
        setDidMount(false)
      })
      .catch((err) => {
        console.warn(err);
        alert("Error get the post");
      });

    } else {
      axios
      .get(`/posts`) 
      .then((res) => {
        const currentPost = res.data.filter((obj) => obj._id === id)
        setData(currentPost[0]); 
        setLoading(false);
         setCommentsCount(currentPost[0].commentsCount)
      })
    }
  }, [isCommentsLoading]);

 
  if (isLoading) {
    return <Post isLoading={isLoading} isFullPost />;
  }


  return (
    <>
      <Post
        id={data._id}
        title={data.title}
        imageUrl={data.imageUrl ? mainUrl + data.imageUrl : ""}
        user={data.user}
        createdAt={data.createdAt}
        viewsCount={data.viewsCount}
        commentsCount={commentsCount}
        tags={data.tags}
        isFullPost
      >
        <Typography>
          <ReactMarkdown children={data.text} />
        </Typography>
      </Post>
      <CommentsBlock
        items= {isLoading ? [] : data}
        isLoading={false}
      >   
      </CommentsBlock>
    </>
  );
};
