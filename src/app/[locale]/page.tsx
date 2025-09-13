'use client';


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
 return <h1>Test</h1>;
}
