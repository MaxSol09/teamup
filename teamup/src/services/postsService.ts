import { API_ENDPOINTS } from "@/api/endpoints"
import axios from "axios"

class PostsService {

    getPosts(){
        const data = axios.get(API_ENDPOINTS.CONTENT.GET_POSTS)

        return data
    }

}

export const questionsService = new PostsService()