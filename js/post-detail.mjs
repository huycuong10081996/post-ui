import postApi from './api/postApi.js';
import utils from './utils.js';

const renderPost = (post) => {


    //set banner image
    utils.setBackgroundImageByElementId('postHeroImage', post.imageUrl);


    // set tittle
    // const h1TitleElement = document.querySelector('#postDetailTitle');
    // if (h1TitleElement) {
    //     h1TitleElement.innerText = post.title;
    // }
    utils.setTextByElementId('postDetailTitle', post.title);

    // set author
    utils.setTextByElementId('postDetailAuthor', post.author);
    // set date time
    const dateString = ` - ${utils.formatDate(post.updatedAt)}`;
    utils.setTextByElementId('postDetailTimeSpan', dateString);

    // set description
    utils.setTextByElementId('postDetailDescription', post.description);
};

// update href and content
const renderEditLink = (post) => {
    const editLink = document.querySelector('a#goToEditPageLink');
    // console.log(editLink);
    if (editLink) {
        editLink.href = `add-edit-post.html?postId=${post.id}`;
        editLink.innerHTML = '<i class="fas fa-edit"></i> Edit post';
    }
};

const init = async () => {
    // Write your logic here ....
    try {
        //retrieve postId from query params
        // lấy postId về
        const params = new URLSearchParams(window.location.search);
        const postId = params.get('postId');
        if (!postId) return;

        // fetch post detail by id
        const post = await postApi.getDetail(postId);

        // render post
        renderPost(post);

        // update edit link
        renderEditLink(post);


    } catch (error) {
        console.log(error)
    }
};

init();