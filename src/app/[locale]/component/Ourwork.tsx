


import Head from "next/head";
import OurWorkSection from "./OurWorksection";

const Ourwork = () => {
  

 

  return (
    <>
      <Head>
        <title>سبكتروم | اعمالنا</title>
        <meta
          name="description"
          content="اكتشف أعمال سبكتروم في مجال الصوتيات — مشاريع احترافية وابتكار مستمر"
        />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={`سبكتروم | اعمالنا`} />
        <meta
          property="og:description"
          content="اعرض أعمالنا الصوتية المميزة وحلولنا الاحترافية."
        />
      </Head>
     <OurWorkSection />
    </>
  );
};

export default Ourwork;