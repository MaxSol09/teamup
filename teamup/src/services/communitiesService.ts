import { API_ENDPOINTS } from "@/api/endpoints"
import axios from "axios"

class CommunitiesService {

    getCommunities(){
        const data = axios.get(API_ENDPOINTS.CONTENT.GET_POSTS)

        return data
    }

}

export const communitiesService = new CommunitiesService()