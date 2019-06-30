import fetchClient from "./fetchClient.js";
import AppConstants from "../appConstants.js";
import BaseApi from "./baseApi.js";

class PostApi extends BaseApi {
    getResourceName() {
        return 'posts';
    }
    // getAll() {
    //     const url = `${AppConstants.API_URL}/${this.getResourceName()}`;
    //     return fetchClient.get(url);
    // } //get post list

    // getDetail(postId) {
    //     const url = `${AppConstants.API_URL}/${this.getResourceName()}/${postId}`;
    //     return fetchClient.get(url);
    // } //get post detail

    // add(post) {
    //     const url = `${AppConstants.API_URL}/${this.getResourceName()}`;
    //     return fetchClient.get(url, post);
    // }

    // update(post) {
    //     const url = `${AppConstants.API_URL}/${this.getResourceName()}/${post.id}`;
    //     return fetchClient.patch(url, post);
    // }

    // remove(postId) {
    //     const url = `${AppConstants.API_URL}/${this.getResourceName()}/${postId}`;
    //     return fetchClient.delete(url);
    // }
}

const postApi = new PostApi();
export default postApi;