
/* import Link from "next/link";
import Image from "next/image"; */

import Head from "next/head";
import HeroSection from "./HeroSection";
const Hero = () => {
 
  return (
    <>
      <Head>
        <title>سبكتروم | حلول صوتية مبتكرة لعالمك"</title>
        <meta name="description" content="نقدم لك أفضل الحلول للمعالجة والعزل الصوتي " />
        <meta
          name="keywords"
          content="حلول صوتية, معالجة صوتية, عزل صوت, أنظمة صوتية, سبكتروم"
        />
        <meta property="og:title" content={`سبكتروم | حلول صوتية مبتكرة لعالمك"`} />
        <meta property="og:description" content="نقدم لك أفضل الحلول للمعالجة والعزل الصوتي" />
        <meta property="og:type" content="website" />
      </Head>
      <HeroSection />
    </>
  );
};

export default Hero;
