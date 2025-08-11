// lib/axios.js
"use client";

import axios from 'axios';

import SummaryApi from '../common/summaryApi';

const Axios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // مثل http://localhost:5000/api
  withCredentials: true, // مهم لو تستخدم cookies
});

//اضافه التوكن في الهيدر قبل ارسال الطلب

Axios.interceptors.request.use( //تنفذ قبل ارسال اي طلب
  async(config)=>{
    const accessToken=localStorage.getItem('accessToken')
    if(accessToken){
      config.headers.Authorization=`Bearer ${accessToken}`
    }
    return config
  },
  (error)=>{
    return Promise.reject(error)
  }
)
// تجديد التوكن في حال فشل الطلب

Axios.interceptors.request.use( //تنفذ بعد وصول الرد من السيرفر
  (response)=>{
    return response
  },
  async(error)=>{
    let originRequest=error.config
    if(error.response.status === 401 && !originRequest.retry){
      originRequest.retry=true
      const refreshToken=localStorage.getItem('refreshToken')
      if(refreshToken){
        const newAccessToken=await refreshAccessToken(refreshToken)
        if(newAccessToken){
          originRequest.headers.Authorization=`Bearer ${newAccessToken}`
          return Axios(originRequest)
        }
        return Promise.reject(error)
      }
    }
  }
)

//داله تجديد التوكن

const refreshAccessToken=async(refreshToken)=>{
  try{
    const response =await axios({
      ...SummaryApi.refreshToken,
      headers:{
        Authorization:`Bearer ${refreshToken}`
      }
    })
    const accessToken=response.data.data.accessToken
    localStorage.setItem('accessToken',accessToken)
    return accessToken
  }catch(error){
    console.log(error)
  }
}

export default Axios;
