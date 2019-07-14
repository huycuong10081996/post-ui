import postApi from './api/postApi.js';
import utils from './utils.js';


const renderPost = (post) => {
    // Set banner image
    utils.setBackgroundImageByElementId('postHeroImage', post.imageUrl);

    // Set title
    utils.setTextByElementId('postDetailTitle', post.title);

    // Set author
    utils.setTextByElementId('postDetailAuthor', post.author);

    //  Set date time
    // const dateString = utils.formatDate(post.updatedAt);
    const dateString = ` - ${utils.formatDate(post.updatedAt)}`;
    utils.setTextByElementId('postDetailTimeSpan', dateString);

    // Set description
    utils.setTextByElementId('postDetailDescription', post.description);

};

const renderEditLink = (post) => {
    const editLink = document.querySelector('#goToEditPageLink');
    if (editLink) {
        editLink.href = `add-edit-post.html?postId=${post.id}`;
        editLink.innerHTML = '<i class="fas fa-edit"></i> Edit post';
    }
};

// MAIN LOGIC
// -----------------------
const init = async () => {
    try {
        // Retrieve postId from query params
        const params = new URLSearchParams(window.location.search);
        const postId = params.get('postId');
        if (!postId) return;

        // Fetch post detail by id
        const post = await postApi.getDetail(postId);

        // Render post
        renderPost(post);

        // Update edit link
        renderEditLink(post);

    } catch (error) {
        console.log(error);
    }
};

init();

// Example

// const renderPost = (post) => {
//     const page = 1;
//     const limit = 10;
//     const search = `_limit=${limit}&_page=${page}`;
// }