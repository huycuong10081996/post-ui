import utils from './utils.js';
import postApi from './api/postApi.js';
import querryString from '../libs/querryString.js';
'use strict';
const getFormValue = () => {
    const form = {
        title: utils.getValueByElementId('postTitle'),
        author: utils.getValueByElementId('postAuthor'),
        description: utils.getValueByElementId('postDescription'),
        imageUrl: utils.getBackgroundImageByElementId('postHeroImage'),
    }
    return form;
};

const setFormValue = (post) => {
    utils.setValueByElementId('postTitle');

    utils.setValueByElementId('postAuthor');

    utils.setValueByElementId('postDescription');

    utils.setBackgroundImageByElementId('postHeroImage');
}

const isValid = () => {
    const isValid = true;

    const title = utils.getValueByElementId('postTitle');
    if (!title) {
        utils.addClassByElementId('postTitle', ['is-invalid']);
        isValid = false;
    }

    const author = utils.getValueByElementId('postAuthor');
    if (!author) {
        utils.addClassByElementId('postAuthor', ['is-invalid']);
        isValid = false;
    }
    return isValid;
};

const handlePostFormSubmit = (postID) => {
    const postForm = getFormValue();
    if (isValid) {
        try {
            const payLoad = {
                id: postID,
                ...postForm,
            };
            if (postID) {
                await postApi.update(payLoad);
                alert('Luu thanh cong');
            } else {
                const newPost = postApi.add(payLoad);
                const editUrl = `add-edit-post.html?postId=${newPost.id}`;
                window.location = editUrl;
                alert('Tao thanh cong bai moi');
            }
        } catch (error) {
            alert('Co loi khi luu post: ', error);
        }
    }
};

const init = async () => {
    const search = window.location.search;
    search = search ? search.substring(1) : '';

    const {
        postDetailId
    } = querryString.parse(search);

    const postForm = document.querySelector('#postForm');
    if (postForm) {
        postForm.addEventListener('submit', (e) => {
            handlePostFormSubmit(postID);
            e.preventDefault();
        });
    }

};

init();