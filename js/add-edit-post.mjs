import utils from './utils.js';
import postApi from './api/postApi.js';
import querryString from '../libs/querryString.js';
import AppConstants from './appConstants.js';

const getFormValue = () => {
    const form = {
        title: utils.getValueByElementId('postTitle'),
        author: utils.getValueByElementId('postAuthor'),
        description: utils.getValueByElementId('postDescription'),
        imageUrl: utils.getBackgroundImageByElementId('postHeroImage'),
    };
    return form;
};

const setFormValue = (post) => {
    utils.setValueByElementId('postTitle', post.title);

    utils.setValueByElementId('postAuthor', post.author);

    utils.setValueByElementId('postDescription', post.description);

    utils.setBackgroundImageByElementId('postHeroImage', post.imageUrl);
};

const validatePostForm = () => {
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
    const isValid=validatePostForm();
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
                const newPost = await postApi.add(payLoad);
                const editUrl = `add-edit-post.html?postId=${newPost.id}`;
                window.location = editUrl;
                alert('Tao thanh cong bai moi');
            }
        } catch (error) {
            alert('Co loi khi luu post: ', error);
        }
    }
};

const handleChangImageClick = () => {
    const randomId = 1 + Math.trunc(Math.random() * 1000);

    const imageUrl = `https://picsum.photos/id/${randomId}/${AppConstants.DEFAULT_IMAGE_WIDTH}/${AppConstants.DEFAULT_IMAGE_HEIGHT}`;

    utils.setBackgroundImageByElementId('postHeroImage', imageUrl);
};

const init = async () => {
    let search = window.location.search;
    search = search ? search.substring(1) : '';

    const {
        postId
    } = querryString.parse(search);

    // return true or false
    const isEditMode = !!postId;
    if (isEditMode) {
        const post = await postApi.getDetail(postId);

        setFormValue(post);
    

    const gotoDetailPageLink = document.querySelector('#goToDetailPageLink');
    
        gotoDetailPageLink.href = `post-detail.html?postID=${post.id}`;
        gotoDetailPageLink.innerHTML = '<i class="fas fa-eye mr-1"></i> View post detail';
    } else {
        handleChangImageClick();
    }

    const postChangeImageButton = document.querySelector('#postChangeImage');
    if (postChangeImageButton) {
        postChangeImageButton.addEventListener('click', handleChangImageClick);
    }

    const postForm = document.querySelector('#postForm');
    if (postForm) {
        postForm.addEventListener('submit', (e) => {
            handlePostFormSubmit(postId);
            e.preventDefault();
        });
    }

};

init();