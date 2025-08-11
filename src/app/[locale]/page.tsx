'use client';

import { useDispatch } from 'react-redux';
import { useEffect } from 'react';

import fetchUserDetails from '@/app/utilities/fetchUserDetails';
import { setUserDetails } from '@/app/store/userSlice';

import fetchPartnerDetails from '@/app/utilities/fetchPartnerDetails';
import { setpartnerDetails } from '@/app/store/partnerSlice';

import Hero from '@/app/[locale]/component/Hero';
import WhyChooseUs from '@/app/[locale]/component/WhyChooseUs ';
import Footer from '@/app/[locale]/component/Footer';
import Ourfields from '@/app/[locale]/component/OurField';
import Ourwork from '@/app/[locale]/component/Ourwork';
import PartnersSection from '@/app/[locale]/component/PartnersSection';
import SendMessageSection from '@/app/[locale]/component/SendMessageSection';
import Header from './component/Header';

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
        const response = await fetchPartnerDetails();
        dispatch(setpartnerDetails({ partners: response.data, loading: false }));
      } catch (error) {
        dispatch(setpartnerDetails({ error: 'فشل تحميل الشركاء', loading: false }));
      }
    }

    fetchUser();
    fetchpartnerdetails();
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
