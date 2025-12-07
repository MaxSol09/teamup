import { API_ENDPOINTS } from "@/api/endpoints"
import axios from "axios"
import { Post } from "@/types/posts"

const getToken = () =>
  typeof window !== 'undefined' ? localStorage.getItem('token') : null;

class PostsService {
  async getAll(): Promise<Post[]> {
    const token = getToken();
    
    const response = await axios.get(API_ENDPOINTS.POSTS.GET_ALL, {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
    });
    
    return response.data;
  }
}

export const postsService = new PostsService();