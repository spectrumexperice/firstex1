
"use client"
import {  useDispatch } from "react-redux";
import fetchUserDetails from "@/app/utilities/fetchUserDetails";
import {setUserDetails} from '../../store/userSlice'
import {setpartnerDetails} from '../../store/partnerSlice'
import { useEffect } from "react";
import Hero from '@/app/[locale]/component/Hero'
import WhyChooseUs from '@/app/[locale]/component/WhyChooseUs '
import Footer from '@/app/[locale]/component/Footer'
import Ourfields from '@/app/[locale]/component/OurField'
import Ourwork from '@/app/[locale]/component/Ourwork'
import fetchPartnerDetails from '@/app/utilities/fetchPartnerDetails'
import PartnersSection from '@/app/[locale]/component/PartnersSection'
import SendMessageSection from '@/app/[locale]/component/SendMessageSection'
export default function Home() {
  const dispatch=useDispatch()
  const fetchUser=async()=>{
   const userData=await fetchUserDetails() 
   
   dispatch(setUserDetails(userData))
  }
  const fetchpartnerdetails=async()=>{
   try {
        dispatch(setpartnerDetails({ loading: true }));
        const response = await fetchPartnerDetails();
        dispatch(setpartnerDetails({ partners: response.data, loading: false }));
      } catch (error) {
        dispatch(setpartnerDetails({ error: "فشل تحميل الشركاء", loading: false }));
      }
  }
  useEffect(()=>{
    fetchUser()
    fetchpartnerdetails()
  },)
  return (
    <>
    
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
