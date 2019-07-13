'use strict';
import AppConstants from './appConstants.js';
import postApi from './api/postApi.js';
import utils from './utils.js';

const handleItemRemove = async (e, post) => {
  try {
    const confirmMessage = `Bạn muốn xóa ${post.title} ?`;
    if (window.confirm(confirmMessage)) {
      await postApi.remove(post.id);
      window.location.reload();
    }
  } catch (error) {
    console.log(error);
    alert('Bạn không thể xóa post này!!!: ', error);
  }
};



const buildPostItem = (item) => {
  const postItemTemplate = document.querySelector('#postItemTemplate');
  const postItemFragment = postItemTemplate.content.cloneNode(true);
  const postItemElement = postItemFragment.querySelector('li');

  const postItemTitle = postItemElement.querySelector('#postItemTitle');
  postItemTitle.innerText = item.title;

  const postItemDescription = postItemElement.querySelector('#postItemDescription');
  postItemDescription.innerText = item.description;

  const postItemAuthor = postItemElement.querySelector('#postItemAuthor');
  postItemAuthor.innerText = item.author;

  const postItemTimeSpan = postItemElement.querySelector('#postItemTimeSpan');
  const date = `${utils.formatDate(item.updatedAt)}`;
  postItemTimeSpan.innerText = date;
  console.log(date);

  const postItemImage = postItemElement.querySelector('#postItemImage');
  postItemImage.src = item.imageUrl;
  const postItemRemove = postItemElement.querySelector('#postItemRemove');
  if (postItemRemove) {
    postItemRemove.addEventListener('click', (e) => {
      handleItemRemove(e, item);
      e.stopPropagation();
    });
  };

  const postItem = postItemElement.querySelector('#postItem');
  postItem.addEventListener('click', () => {
    const detailPageUrl = `post-detail.html?postId=${item.id}`;
    window.location = detailPageUrl;
  });

  const postItemEdit = postItemElement.querySelector('#postItemEdit');
  postItemEdit.addEventListener('click', (e) => {
    const editPageUrl = `add-edit-post.html?postId=${item.id}`;
    window.location = editPageUrl;
    console.log(postItemEdit);
    e.stopPropagation();
  });


  return postItemElement;
};

const renderPagination = (pagination) => {
  // console.log(pagination);
  let page = pagination._page;

  const previousElement = document.querySelector('#previous');
  if (page > 1) {
    previousElement.classList.remove('disabled');
  }
  previousElement.addEventListener('click', () => {
    --page;
    previousElement.href = `?_limit=6&_page=${page}`;
  });
  console.log(previousElement);

  let totalPage = Math.ceil(pagination._totalRows / pagination._limit);
  
  const nextElement = document.querySelector('#next');
 
  console.log(page, totalPage)
  if (page === totalPage) {
    paginationUp.classList.add('disabled');
  }
  
  console.log(page);
  nextElement.addEventListener('click', () => {
    ++page;
  nextElement.href = `?_limit=6&_page=${page}`;
  });
  console.log(nextElement);
 
}; 

// -----------------------
// MAIN LOGIC
// -----------------------
const init = async () => {

  try {
    let param = new URLSearchParams(window.location.search);

    const limit = '_limit=6';
    let numberPage = param.get('_page') || 1;
    let page = `_page=${numberPage}`;

    const limitAndPage = `${page}&${limit}&_sort=updatedAt&_order=desc`;
    const postList = await postApi.getAll(limitAndPage);
    const data = postList.data;


    const pagination = postList.pagination;
    renderPagination(pagination);

    console.log(data);
    const listPost = document.querySelector('#postsList');
    for (const item of data) {
      const post = buildPostItem(item);
      listPost.appendChild(post);

    }

  } catch (error) {
    console.log(error);
  }

};

init();