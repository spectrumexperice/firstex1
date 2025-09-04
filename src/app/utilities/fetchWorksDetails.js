import Axios from '../utilities/axios'
import SummaryApi from '../common/summaryApi'
const fetchworksDetails=async()=>{
    try{
        const response=await Axios({
            ...SummaryApi.Work.getall
        })
        return response.data
    }catch(error){
        console.log(error)
    }
}
export default fetchworksDetails