import WhyChooseContent from "./whyChooseUSSection";
import Head from "next/head";


const WhyChooseUs = () => {

  

  return (
    <>
      <Head>
        <title>سبكتروم | لماذا تختارنا</title>
        <meta name="description" content="نستخدم أحدث المعدات والتقنيات لضمان أفضل جودة صوت , نضمن أداءً مستقرًا وموثوقًا في جميع الأنظمة الصوتية
        , فرقنا تنجز المشاريع بكفاءة وفي الوقت المحدد , دعم فني مستمر وخدمة ما بعد البيع عالية المستوى" />
        <meta
          name="keywords"
          content="جودة صوت, موثوقية, سرعة التنفيذ, خدمة عملاء, حلول صوتية, سبكتروم"
        />
        <meta property="og:title" content={`سبكتروم |لماذا تختارنا`} />
        <meta property="og:description" content="نستخدم أحدث المعدات والتقنيات لضمان أفضل جودة صوت , نضمن أداءً مستقرًا وموثوقًا في جميع الأنظمة الصوتية
        , فرقنا تنجز المشاريع بكفاءة وفي الوقت المحدد , دعم فني مستمر وخدمة ما بعد البيع عالية المستوى " />
        <meta property="og:type" content="website" />
      </Head>
       <WhyChooseContent/>
    </>
  );
};

export default WhyChooseUs;
