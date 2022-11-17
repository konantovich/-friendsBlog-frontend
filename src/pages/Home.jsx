import React from "react";
import { useDispatch } from "react-redux"; 
import { useSelector } from "react-redux"; 
import { Box, Tab } from "@mui/material";
import Grid from "@mui/material/Grid";
import  { TabList, TabContext } from '@mui/lab'
import axios from "../axios";

import { mainUrl } from '../mainUrl'
import { Post } from "../components/Post";
import { TagsBlock } from "../components/TagsBlock";
import {
  fetchPosts,
  fetchTags
} from "../redux/slices/posts";

export const Home = () => {
  const dispatch = useDispatch(); 

  const { posts, tags } = useSelector((state) => state.posts); 

  const [userData, setUserData] = React.useState( useSelector((state) => state.auth.data))

  const isPostLoading = posts.status === "loading"; 
  const isTagsLoading = tags.status === "loading";

  const [sortDatePosts, setSortDatePosts] = React.useState(null);
  const [sortDateToggle, setSortDateToggle] = React.useState(false);


  React.useEffect(() => {
    dispatch(fetchPosts()); 
    dispatch(fetchTags());

     axios.get('/auth/me').then((res) =>{

      setUserData(res.data.userData)
    
     })
    
  }, []);


  const handlePostsByTag = (name) => {
     axios 
    .get(`/tag/${name}`) 
    .then((res) => {

      setSortDatePosts(res.data)
    })
    .catch((err) => {
      console.warn(err);
      alert("Error get the post");
    });

  }

  const handleSortDatePosts = () => {
    setSortDateToggle({ sortDateToggle: !sortDateToggle });
    axios
    .post(`/posts/${Math.random() * 10000}/date`) 
    .then((res) => {
      setSortDatePosts(res.data);
    })
    .catch((err) => {
      console.warn(err);
      alert("Error get the post");
    });
  };

  const handleSortPopularPosts = () => {

    axios
    .post(`/posts/${Math.random() * 10000}/popular`) 
    .then((res) => {
      setSortDatePosts(res.data);
    })
    .catch((err) => {
      console.warn(err);
      alert("Error get the post");
    });
  };

  //TABS
  const [tabsValue, setTabsValue] = React.useState('0')
  const handleTabsChange = (event: React.SynteticEvent, newValue: string) => {
    setTabsValue(newValue)
  }

  return (
    <>
    <TabContext value={tabsValue}>
      <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
      <TabList
        aria-label="basic tabs example"
        onChange={handleTabsChange}
        textColor='secondary'
        indicatorColor='secondary'
        centered
      >
        <Tab onClick={handleSortDatePosts} label="New" index={0} value='0'/>
        <Tab onClick={handleSortPopularPosts} label="Popular" index={1} value='1' />
      </TabList>
      </Box>
    </TabContext>

      <Grid container spacing={4}>

      <Grid xs={4} item>
          <TagsBlock
            handlePostsByTag={handlePostsByTag}
            items={tags.items}
            isLoading={isTagsLoading}
           
          />
        </Grid>
        <Grid xs={8} item>
          {(isPostLoading
            ? [...Array(5)] //[...Array(5)] fake array with 5 undefinds
            : sortDatePosts
            ? sortDatePosts
            : posts.items
          ).map(
            (
              obj,
              index 
            ) =>
            
            //if first load undefined, load isPostLoading 
              isPostLoading ? (
                <Post key={index} isLoading={true} />
              ) : (
                <Post
                key={index}
                  id={obj._id}
                  title={obj.title}
                  imageUrl={
                    obj.imageUrl ? `${mainUrl}${obj.imageUrl}` : ""
                  }
                  user={obj.user}
                  createdAt={obj.createdAt}
                  viewsCount={obj.viewsCount}
                  commentsCount={obj.comments.length}
                  tags={obj.tags}
                  isEditable={userData?._id === obj.user._id}//find user id if === post id, user see button edit
                >
                 
                </Post>
              )
          )}
        </Grid>
        
      </Grid>
    </>
  );
};
