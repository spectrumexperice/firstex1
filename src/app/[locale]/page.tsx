'use client';

import { useDispatch } from 'react-redux';
import { useEffect } from 'react';

import fetchUserDetails from '../utilities/fetchUserDetails';
import { setUserDetails } from '../store/userSlice';
import fetchworksDetails from '../utilities/fetchWorksDetails';
import fetchpartnerDetails from '../utilities/fetchPartnerDetails';
import fetchProductData from '../utilities/fetchProductData';
import fetchCategoies from '../utilities/fetchCategories';
import { setpartnerDetails } from '../store/partnerSlice';
import { setWorksDetails } from '../store/workSlice';
import { setProductData,setLoading } from '../store/productSlice';
import { setCategoriesDetails } from '../store/category';
import Hero from '@/app/[locale]/component/Hero'
import WhyChooseUs from '@/app/[locale]/component/WhyChooseUs'
import Footer from '@/app/[locale]/component/Footer'
import Ourfields from '@/app/[locale]/component/OurField'
import Ourwork from '@/app/[locale]/component/Ourwork'
import PartnersSection from '@/app/[locale]/component/PartnersSection'
import SendMessageSection from '@/app/[locale]/component/SendMessageSection'
import Header from '@/app/[locale]/component/Header'
import { error } from 'console';

export default function Home() {
  const dispatch = useDispatch();

  useEffect(() => {
   

    async function fetchUser() {
      const userData = await fetchUserDetails();
      dispatch(setUserDetails(userData));
    }

    async function fetchpartnerdetails() {
      try {
        dispatch(setpartnerDetails({ loading: true }));
        const response = await fetchpartnerDetails();
        dispatch(setpartnerDetails({ partners: response.data, loading: false }));
      } catch (error) {
        dispatch(setpartnerDetails({ error: 'فشل تحميل الشركاء', loading: false }));
      }
    }
    async function fetchWorks(){
      try{
        dispatch(setWorksDetails({loading: true}))
        const response =await fetchworksDetails()
        dispatch(setWorksDetails({works:response.data,loading:false}))

      }catch (error) {
        dispatch(setWorksDetails({ error: 'فشل تحميل الشركاء', loading: false }));
      }
    }
     async function fetchProduct(){
      try{
        dispatch(setLoading(true))
        const response=await fetchProductData() 
        dispatch(setProductData(response.data))

      }catch(error){
        dispatch(setLoading(false))
      }
    }
      async function fetchCategories(){
      try{
        dispatch(setCategoriesDetails({loading: true}))
        const response =await fetchCategoies()
       /*  console.log("response : ",response) */
        dispatch(setCategoriesDetails(response.data))

      }catch (error) {
        dispatch(setCategoriesDetails({ error: 'فشل تحميل الفئات', loading: false }));
      }
    }
    
    fetchUser();
    fetchpartnerdetails();
    fetchWorks()
    fetchProduct()
    fetchCategories()
  }, [dispatch]);

  return (
    <>
      <Header />
      <Hero />
      <WhyChooseUs />
      <Ourfields />
      <Ourwork />
      <PartnersSection />
      <SendMessageSection />
      <Footer />
    </>
  );
}
