import Axios from '../utilities/axios'
import SummaryApi from '../common/summaryApi'
const fetchCategoies=async()=>{
    try{
        const response=await Axios({
            ...SummaryApi.Product.getcategory
        })
        return response.data
    }catch(error){
        console.log(error)
         return null; // من الأفضل إرجاع null في حالة الخطأ
    }
}
export default fetchCategoies