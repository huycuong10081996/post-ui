import utils from "./utils.js";
import postApi from "./api/postApi.js";
import AppConstants from "./appConstants.js";

const validatePostForm = () => {
    let isValid = true;

    // title is required
    const title = utils.getValueByElementId('postTitle');
    if (!title) {
        utils.addClassByElementId('postTitle', ['is-invalid']);
        isValid = false;
    }

    // author is required
    const author = utils.getValueByElementId('postAuthor');
    if (!author) {
        utils.addClassByElementId('postAuthor', ['is-invalid']);
        isValid = false;
    }

    return isValid;
};

const handleFormSubmit = async () => {

    let isValid = validatePostForm();
    if (isValid) {
        const formValue = getFormValue();
        const newPost = {
            ...formValue
        };
        await postApi.add(newPost);
        const editPageUrl = `add-edit-post.html?postId=${newPost.id}`;
        window.location = editPageUrl;
    }
}

const handleEditButtonClick = async (id) => {
    const formValue = getFormValue();
    const newPost = {
        ...formValue,
        id
    };
    await postApi.update(newPost);
    alert('Post updated')
}

const handleChangeImageClick = (url) => {
    if (url) {
        return utils.setBackgroundImageByElementId('postHeroImage', url);
    }
    const randomId = 1 + Math.trunc(Math.random() * 1000);
    const imageUrl = `https://picsum.photos/id/${randomId}/${AppConstants.DEFAULT_IMAGE_WIDTH}/${AppConstants.DEFAULT_IMAGE_HEIGHT}`;
    utils.setBackgroundImageByElementId('postHeroImage', imageUrl);
};

const getFormValue = () => {
    const formValue = {};

    const controlNameList = ['Title', 'Author', 'Description'];

    const isValid = validatePostForm();
    if (!isValid) {
        throw new Error();
    }
    controlNameList.forEach(controlName => {
        const inputName = document.getElementById(`post${controlName}`);
        formValue[controlName.toLowerCase()] = inputName.value;
    })

    formValue.imageUrl = utils.getBackgroundImageByElementId('postHeroImage');
    return formValue;
}

const setFormValue = (formValue) => {
    const controlNameList = ['Title', 'Author', 'Description'];

    controlNameList.forEach(controlName => {
        const inputName = document.getElementById(`post${controlName}`);
        inputName.value = formValue[controlName.toLowerCase()];
    })
}

const init = async () => {
    const postChangeImageButton = document.querySelector('#postChangeImage');
    if (postChangeImageButton) {
        postChangeImageButton.addEventListener('click', event => handleChangeImageClick());
    }

    const formSubmit = document.querySelector('#postForm');

    const params = new URLSearchParams(window.location.search);
    const postId = params.get('postId');
    if (!postId) {
        handleChangeImageClick();
        if (formSubmit) {
            formSubmit.addEventListener('submit', (e) => {
                e.preventDefault();
                handleFormSubmit();
            })
        }
        return;
    }
    const post = await postApi.getDetail(postId);
    if (formSubmit) {
        formSubmit.addEventListener('submit', (e) => {
            e.preventDefault();
            handleEditButtonClick(post.id);
        })
    }
    const goToDetailPageLink = document.querySelector('#goToDetailPageLink');
    if (goToDetailPageLink) {
        goToDetailPageLink.href = `post-detail.html?postId=${postId}`;
        goToDetailPageLink.innerHTML = '<i class="fas fa-eye mr-1"></i> View Post Detail ';
    }

    handleChangeImageClick(post.imageUrl);
    setFormValue(post);
}

init();