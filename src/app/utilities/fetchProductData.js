import Axios from '../utilities/axios';
import SummaryApi from '../common/summaryApi';

const fetchProductData = async (categorySlug) => {
  try {
    const response = await Axios({
        ...SummaryApi.Product.getAll,
           params: categorySlug ? { category: categorySlug } : {}

    })
   
    
    return response.data;
  } catch (error) {
    console.error("خطأ في جلب البيانات:", error);
    return null;
  }
};

export default fetchProductData;