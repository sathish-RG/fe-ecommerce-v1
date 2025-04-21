import axios from 'axios';

const baseURL= 'https://be-ecommerce-v1.onrender.com/api/v1'

const instance=axios.create({
  baseURL,
  timeout:10000,
  headers:{
    'Content-type':'application/json',
    
  },
  withCredentials:true,
});
export default instance;