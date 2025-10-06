
"use client"
import {  useDispatch } from "react-redux";
import fetchUserDetails from "../../utilities/fetchUserDetails";
import {setUserDetails} from '../../store/userSlice'
import {setpartnerDetails} from '../../store/partnerSlice'
import { useEffect } from "react";
import fetchpartnerDetails from "../../utilities/fetchPartnerDetails";
import dynamic from "next/dynamic";
import fetchworksDetails from "@/app/utilities/fetchWorksDetails";
import { setWorksDetails } from "@/app/store/workSlice";
// Dynamic Imports
const Hero = dynamic(() => import("../component/Hero"));
const WhyChooseUs = dynamic(() => import("../component/WhyChooseUs"));
const Ourfields = dynamic(() => import("../component/OurField"));
const Ourwork = dynamic(() => import("../component/Ourwork"));
const PartnersSection = dynamic(() => import("../component/PartnersSection"));
const SendMessageSection = dynamic(() => import("../component/SendMessageSection"));
const Footer = dynamic(() => import("../component/Footer"));
export default function Home() {
  const dispatch=useDispatch()
  
  useEffect(() => {
  (async () => {
    try {
      const [userData, partnerRes,workRes] = await Promise.all([
        fetchUserDetails(),
        fetchpartnerDetails(),
        fetchworksDetails()
      ]);
      dispatch(setUserDetails(userData));
      dispatch(setpartnerDetails({ partners: partnerRes.data, loading: false }));
        dispatch(setWorksDetails({ works: workRes.data, loading: false }));
    } catch {
      dispatch(setpartnerDetails({ error: "فشل تحميل ", loading: false }));
    }
  })();
}, []);

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
