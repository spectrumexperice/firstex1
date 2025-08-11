import Axios from '../utilities/axios'
import SummaryApi from '../common/summaryApi'
const fetchpartnerDetails=async()=>{
    try{
        const response=await Axios({
            ...SummaryApi.Partner.getAllPartner
        })
        return response.data
    }catch(error){
        console.log(error)
    }
}
export default fetchpartnerDetails