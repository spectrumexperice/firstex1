
"use client"
import {  useDispatch } from "react-redux";
import fetchUserDetails from "@/app/utilities/fetchUserDetails";
import {setUserDetails} from '../../store/userSlice'
import {setpartnerDetails} from '../../store/partnerSlice'
import { useEffect } from "react";
import Hero from '../component/Hero';
import WhyChooseUs from '../component/WhyChooseUs '
import Footer from '../component/Footer';
import Ourfields from '../component/OurField';
import Ourwork from '../component/Ourwork';
import fetchPartnerDetails from '@/app/utilities/fetchPartnerDetails'
import PartnersSection from "../../PartnersSection/PartnersSection";
import SendMessageSection from "../component/SendMessageSection";
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
  },[])
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
