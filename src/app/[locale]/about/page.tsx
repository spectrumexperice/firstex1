
import Head from "next/head"

import AboutContent from "../aboutSection/page";
const AboutPage = () => {

  return (
    <>
      <Head>
        <title>سبكتروم | حلول صوتية متكاملة</title>
        <meta
          name="description"
          content="نحن في سبكتروم نقدم حلول صوتية متكاملة مع أحدث الأنظمة والتقنيات العالمية. استشارات، تصميم، وتنفيذ مشاريع صوتية باحترافية."
        />
        <meta
          name="keywords"
          content="حلول صوتية, أنظمة صوتية, تركيب صوتيات, استشارات صوتية, مشاريع صوتية, سبكتروم"
        />
        <meta property="og:title" content="سبكتروم | حلول صوتية متكاملة" />
        <meta
          property="og:description"
          content="نحن في سبكتروم نقدم حلول صوتية متكاملة مع أحدث الأنظمة والتقنيات العالمية."
        />
        <meta property="og:type" content="website" />
      </Head>
      
      <AboutContent />
    </>
  );
};

export default AboutPage;