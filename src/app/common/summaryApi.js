// utils/SummaryApi.js













export const baseURL = "http://localhost:8080";

const SummaryApi = {
  register: {
    method: "POST",
    url: `${baseURL}/api/user/register`,
  },
  login: {
    method: "POST",
    url: `${baseURL}/api/user/login`,
  },
  
    logout:{
      method:'get',
      url:`${baseURL}/api/user/logout`
    }
  ,
  forgotPassword:{
    method:"put",
    url:`${baseURL}/api/user/forgot-password`
  },
  verifyOtp:{
    method:'put',
    url:`${baseURL}/api/user/verify-forgot-password-otp`
  },
  resetPassword:{
    method:'put',
    url:`${baseURL}/api/user/reset-password`
  },
  refreshToken:{
    method:'put',
    url:`${baseURL}/api/user/refresh-token`
  },
  userDetails:{
    method:'get',
    url:`${baseURL}/api/user/user-details`
  },
  Partner:{
    
      addPartner:{
        method:'post',
        url:`${baseURL}/api/partner/add`
      },
      getAllPartner:{
        method:'get',
        url:`${baseURL}/api/partner/getall`
      },
      getSinglePartner: (id) => ({
        method: "get",
        url: `${baseURL}/api/partner/get/${id}`,
      }),

      updatePartner: (id) => ({
        method: "patch",
        url: `${baseURL}/api/partner/update/${id}`,
      }),

      deletePartner:(id)=>({
        method:'delete',
        url:`${baseURL}/api/partner/delete/${id}`
      }),

  
  },
  Message:{
    sendMSG:{
      method:'post',
      url:`${baseURL}/api/message/send`
    }
  },
  subscripe:{
    method:'post',
    url:`${baseURL}/api/subscripe/sub`
  },
  MessageCapital:{
    method:'post',
    url:`${baseURL}/api/messageCapital/send`
  }
  
 
};

export default SummaryApi;
