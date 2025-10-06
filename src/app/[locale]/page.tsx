'use client';

import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import Head from "next/head";
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
import Hero from './component/Hero';
import WhyChooseUs from './component/WhyChooseUs';
import Footer from './component/Footer';
import Ourfields from './component/OurField';
import Ourwork from './component/Ourwork';
import PartnersSection from './component/PartnersSection';
import SendMessageSection from './component/SendMessageSection';
import Header from './component/Header';
import { error } from 'console';

export default function Home() {
  const dispatch = useDispatch();

useEffect(() => {
  async function fetchAll() {
    try {
      const [user, partners, works, products, categories] = await Promise.all([
        fetchUserDetails(),
        fetchpartnerDetails(),
        fetchworksDetails(),
        fetchProductData(),
        fetchCategoies()
      ]);

      dispatch(setUserDetails(user));
      dispatch(setpartnerDetails({ partners: partners.data, loading: false }));
      dispatch(setWorksDetails({ works: works.data, loading: false }));
      dispatch(setProductData(products.data));
      dispatch(setCategoriesDetails(categories.data));
    } catch (error) {
      console.error("Error fetching home data", error);
    }
  }

  fetchAll();
}, [dispatch]); 


  return (
    <>
    <Head>
        <title>سبكتروم | حلول صوتية متكاملة</title>
        <meta name="description" content="نحن في سبكتروم نقدم حلول صوتية متكاملة مع أحدث الأنظمة والتقنيات العالمية. استشارات، تصميم، وتنفيذ مشاريع صوتية باحترافية." />
        <meta name="keywords" content="حلول صوتية, أنظمة صوتية, تركيب صوتيات, استشارات صوتية, مشاريع صوتية, سبكتروم" />
        <link rel="canonical" href="https://s-spectrum.com/" />
        <meta property="og:title" content="سبكتروم | حلول صوتية متكاملة" />
        <meta property="og:description" content="نحن في سبكتروم نقدم حلول صوتية متكاملة مع أحدث الأنظمة والتقنيات العالمية." />
        <meta property="og:type" content="website" />
      </Head>
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
