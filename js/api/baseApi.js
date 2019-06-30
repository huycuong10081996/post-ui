import fetchClient from "./fetchClient.js";
import AppConstants from "../appConstants.js";

export default class BaseApi {
    getResourceName() {
        throw new Error('Plese implement this method');
    }
    getAll() {
        const url = `${AppConstants.API_URL}/${this.getResourceName()}`;
        return fetchClient.get(url);
    } //get post list

    getDetail(postId) {
        const url = `${AppConstants.API_URL}/${this.getResourceName()}/${postId}`;
        return fetchClient.get(url);
    } //get post detail

    add(post) {
        const url = `${AppConstants.API_URL}/${this.getResourceName()}`;
        return fetchClient.get(url, post);
    }

    update(post) {
        const url = `${AppConstants.API_URL}/${this.getResourceName()}/${post.id}`;
        return fetchClient.patch(url, post);
    }

    remove(postId) {
        const url = `${AppConstants.API_URL}/${this.getResourceName()}/${postId}`;
        return fetchClient.delete(url);
    }
}