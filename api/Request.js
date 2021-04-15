import axios from 'axios';

const TIMEOUT = 50000;

const httpConfig = {
  baseURL: 'http://10.0.2.2:4242',
  timeout: TIMEOUT,
  headers: {
    Accept: 'application/json',
    ContentType: 'application/json;charset=UTF-8',
  },
  responseType: 'json',
  withCredentials: true,
};

export const axiosInstance = axios.create(httpConfig);
/**
 * Returns a Axios Request Promise
 * method : get, post, put, patch, delete
 */
export default async function request({url, method, data, _config}) {

  const config = {...(_config||{})}
  
  switch (method) {
    case 'post':
      console.log("=========================================================");
      console.log("post Data : ", url, data, config)
      var result = await axiosInstance.post(url, data, config);
      console.log("=========================================================");
      console.log("Result", JSON.stringify(result.data));
      console.log("=========================================================");
      return result;
    case 'patch':
      return axiosInstance.patch(url, data, config);
    case 'put':
      return axiosInstance.put(url, data, config);
    case 'delete':
      return axiosInstance.delete(url, config);
    case 'file':
      return axiosInstance.post(url, data,  {
        headers: {
          'idToken': idtoken,
          ContentType: 'multipart/form-data'
        }
      });
    case 'image':
      return axiosInstance.get(url, {
        responseType: 'blob'
      });
    default:
      return axiosInstance.get(url, {...config, params: data});
  }
}

