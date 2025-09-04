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
  },
  Work:{
    addwork:{
       method:'post',
        url:`${baseURL}/api/work/add`,
        
    },
    getall:{
       method:'get',
        url:`${baseURL}/api/work/getall`
    },
    deleteWork:(id)=>({
        method:'delete',
        url:`${baseURL}/api/work/delete/${id}`
    })
  },
  MsgAdmin:{
    getAll:{
      method:'get',
      url:`${baseURL}/api/MsgAdmin/all`,
    },
     delete:(id,type)=>({
      method:'DELETE',
      url:`${baseURL}/api/MsgAdmin/delete/${id}/${type}`,
    }),
    replay:(id,type)=>({
      method:'post',
      url:`${baseURL}/api/MsgAdmin/reply/${id}/${type}`,
    }),
    export:(format)=>({
      method:'get',
      url:`${baseURL}/api/MsgAdmin/export?format=${format}`,
    })
  },
  NewLetter:{
     subscribe:{
      method:'post',
      url:`${baseURL}/api/MsgAdmin/subscribe`,
    },
    all:{
      method:'get',
      url:`${baseURL}/api/MsgAdmin/all`,
    },
    delete:(id)=>({
      method:'DELETE',
      url:`${baseURL}/api/MsgAdmin/delete/${id}`,
    }),
  },
  Product:{
    getAll:{
      method:'get',
      url:`${baseURL}/api/Product/all`,
    },
    getBySlug: (slug) => ({
  method: 'get',
  url: `${baseURL}/api/Product/getone/${slug}`
}),

    addCategory:{
       method:'post',
       url:`${baseURL}/api/Product/addCategory`
    },
    getcategory:{ 
    method:'get',
    url:`${baseURL}/api/Product/category`},
  
    add:{
      method:'post',
      url:`${baseURL}/api/Product/add`,
    },
    getone:(id)=>({
      method:'get',
      url:`${baseURL}/api/Product/getone/${id}`,
    }),
    search:{
      method:'get',
      url:`${baseURL}/api/Product/search`,
    },
    update: (id) => ({
  method: 'patch',
  url: `${baseURL}/api/Product/update/${id}`,
}),

     delete:(id)=>({
      method:'delete',
      url:`${baseURL}/api/Product/delete/${id}`,
    }),
   
    subcategory:{
      method:'get',
      url:`${baseURL}/api/Product/subcategory`
    },
    subcategoryProducts:(subcategorySlug)=>({
      method:'get',
      url:`${baseURL}/api/Product/getsubcategoryProduct/${subcategorySlug}`
    }),
    getGroup:{
      method:'get',
      url:`${baseURL}/api/Product/getGroup`
    }

  }

  
 
};

export default SummaryApi;
