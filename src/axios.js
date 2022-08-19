import axios from "axios";



const instance = axios.create({
    baseURL: 'http://localhost:4444'
});

//middleware 
//add in ALL request authorization field (need for save auth token)
instance.interceptors.request.use(  (req) => {
        req.headers.authorization = window.localStorage.getItem('token')
       //backend response auth ok or not
   return req;
   
  });

export default instance;