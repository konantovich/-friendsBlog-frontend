import React from "react";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Typography from '@mui/material/Typography';
import SimpleMDE from "react-simplemde-editor"; //text editor
import "easymde/dist/easymde.min.css";
import { useSelector } from "react-redux"; 
import { useNavigate, Navigate, useParams } from "react-router-dom"; 
import { Link } from "react-router-dom";

import axios from "../../axios";
import { mainUrl } from '../../mainUrl'
import styles from "./AddPost.module.scss";
import { selectIsAuth } from "../../redux/slices/auth";

export const AddPost = () => {
  const { id } = useParams(); 

  const navigate = useNavigate(); 
  const isAuth = useSelector(selectIsAuth);
  const [isLoading, setIsLoading] = React.useState(false);
  const [imageUrl, setImageUrl] = React.useState("");
  const [text, setText] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [tags, setTags] = React.useState("");
  const inputFileRef = React.useRef(null); 
  const isEditing = Boolean(id);

  const handleChangeFile = async (event) => {

    //upload post image
    try {
      const formData = new FormData(); 
      const file = event.target.files[0]; 
      formData.append("image", file);
      const { data } = await axios.post("/upload", formData);
      if (!data) {
        setImageUrl(data.url);
      }
      setImageUrl(data.url);
    } catch (error) {

      alert("error upload image", error);
    }
  };

  const onClickRemoveImage = () => {
    setImageUrl(""); //delete image
  };

  //save text
  const onChange = React.useCallback((text) => {
    // useCallback need for SimpleMDE
    setText(text);
  }, []);

  const onSubmit = async () => {
    try {
      setIsLoading(true);

      const fields = {
        title,
        imageUrl,
        tags, 
        text,
      };

      if (!imageUrl) {
        setImageUrl('http://localhost:4444/uploads/image-1669136369778-475062336.png')
      }

      const { data } = isEditing //add or edit post
          ? await axios.patch(`/posts/${id}`, fields) 
          : await axios.post("/posts", fields); 

      const _id = isEditing ? id : data._id; //post _id

      navigate(`/posts/${_id}`); 
    } catch (error) {
      console.warn("Post didn't added", error);
      alert("error adding post. Need minimum 3 symbols");
    }
  };

  React.useEffect(() => {
    if (id) {//if (id) we in edit mode (not new add post)
      axios
        .get(`/posts/${id}`)
        .then((res) => {

          setTitle(res.data.title);
          setText(res.data.text);
          setTags(res.data.tags.join(",")); //Array => string
          setImageUrl(res.data.imageUrl);
        })
        .catch((err) => console.log("change post error", err));
    }
  }, []);

  const options = React.useMemo(
    // useMemo need for SimpleMDE text editor
    () => ({
      spellChecker: false,
      maxHeight: "200px",
      autofocus: true,
      placeholder: "Enter text...",
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    []
  );

  //if haven't auth autoLink on main page
  if (!window.localStorage.getItem("token") && !isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <Paper elevation={0} style={{ padding: 30 }}>
      <div className="addImage">
     {
      !imageUrl && (
        <>
        <Typography>
         <Button
        onClick={() => inputFileRef.current.click()}
        variant="outlined"
        size="large"
      >
       Load preview
      </Button>
      <input
        ref={inputFileRef}
        type="file"
        onChange={handleChangeFile}
        hidden
      />
      </Typography>
      </>
      )
     }
      {imageUrl && (
        <>
          <Button
            variant="contained"
            style={{margin: 'auto -75px', position: 'absolute'}}
            size="small"
            color="error"
            onClick={onClickRemoveImage}
          >
            Delete
          </Button>
          <img
            className={styles.image}
            src={`${mainUrl}${imageUrl}`}
            alt="Uploaded"
          />
        </>
      )}
      </div>

      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Post title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
      />
         <TextField
        classes={{ root: styles.tags }}
        variant="standard"
        placeholder="Tags"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        fullWidth
      />
      <SimpleMDE
        className={styles.editor}
        value={text}
        onChange={onChange}
        options={options}
      />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          {isEditing ? "Save" : "Post"}
        </Button>
        <Link to="/">
          <Button size="large">Cancel</Button>
        </Link>
      </div>
    </Paper>
  );
};
