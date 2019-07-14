"use strict";
import AppConstants from "./appConstants.js";
import postApi from "./api/postApi.js";
import utils from "./utils.js";

// ----- LEARNING ----

// const getPostList = () => {
//   const options = {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//   };

//   return fetch('https://js-post-api.herokuapp.com/api/posts', options)
//     .then(response => {
//       // console.log(response);

//       if (response.status >= 200 && response.status < 300) {
//         // response.json().then(data => console.log(data));
//         return response.json();
//       }
//     });
// };

// // getPostList().then(data => console.log(data));

// // async function abc() {}

// const getPostListAsync = async () => {
//   const options = {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//   };

//   const response = await fetch('https://js-post-api.herokuapp.com/api/posts', options)
//   if (response.status >= 200 && response.status < 300) {
//     // response.json().then(data => console.log(data));
//     const data = await response.json();
//     return data;
//   }
// };

// const getPostDetail = async (postId) => {
//   const options = {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//   };

//   const url = `${AppConstants.API_URL}/posts/${postId}`;
//   const response = await fetch(url, options);
//   if (response.status >= 200 && response.status < 300) {
//     // response.json().then(data => console.log(data));
//     const data = await response.json();
//     return data;
//   }
// };

// const updatePost = async (post) => {
//   const options = {
//     method: 'PATCH',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify(post),
//   };

//   const url = `${AppConstants.API_URL}/posts/${post.id}`;
//   const response = await fetch(url, options);
//   if (response.status >= 200 && response.status < 300) {
//     // response.json().then(data => console.log(data));
//     const data = await response.json();
//     return data;
//   }
// };

const handleItemRemove = async (e, post) => {
  try {
    const confirmMessage = `delete ${post.title}`;
    if (window.confirm(confirmMessage)) {
      await postApi.remove(post.id);
      window.location.reload();
    }
  } catch (error) {
    console.log(error);
    alert("Can not remove this post: ", error);
  }
};

const buildPostItem = item => {
  const postItemTemplate = document.querySelector("#postItemTemplate");
  const postItemFragment = postItemTemplate.content.cloneNode(true);
  const postItemElement = postItemFragment.querySelector("li");

  const postItemTitle = postItemElement.querySelector("#postItemTitle");
  postItemTitle.innerText = item.title;

  const postItemDescription = postItemElement.querySelector(
    "#postItemDescription"
  );
  postItemDescription.innerText = item.description;

  const postItemAuthor = postItemElement.querySelector("#postItemAuthor");
  postItemAuthor.innerText = item.author;

  const postItemTimeSpan = postItemElement.querySelector("#postItemTimeSpan");
  const date = `${utils.formatDate(item.updatedAt)}`;
  postItemTimeSpan.innerText = date;
  console.log(date);

  const postItemImage = postItemElement.querySelector("#postItemImage");
  postItemImage.src = item.imageUrl;
  const postItemRemove = postItemElement.querySelector("#postItemRemove");
  if (postItemRemove) {
    postItemRemove.addEventListener("click", e => {
      handleItemRemove(e, item);
      e.stopPropagation();
    });
  }

  const postItem = postItemElement.querySelector("#postItem");
  postItem.addEventListener("click", () => {
    const detailPageUrl = `post-detail.html?postId=${item.id}`;
    window.location = detailPageUrl;
  });

  const postItemEdit = postItemElement.querySelector("#postItemEdit");
  postItemEdit.addEventListener("click", e => {
    const editPageUrl = `add-edit-post.html?postId=${item.id}`;
    window.location = editPageUrl;
    console.log(postItemEdit);
    e.stopPropagation();
  });

  return postItemElement;
};

const renderPagination = pagination => {
  console.log(pagination);
  let page = pagination._page;

  const paginationDown = document.querySelector("#paginationDown");
  if (page > 1) {
    paginationDown.classList.remove("disabled");
  }
  paginationDown.addEventListener("click", () => {
    --page;
    paginationDown.href = `?_limit=6&_page=${page}`;
  });
  console.log(paginationDown);

  let totalPage = Math.ceil(pagination._totalRows / pagination._limit);

  const paginationUp = document.querySelector("#paginationUp");

  console.log(page, totalPage);
  if (page === totalPage) {
    paginationUp.classList.add("disabled");
  }

  console.log(page);
  paginationUp.addEventListener("click", () => {
    ++page;
    paginationUp.href = `?_limit=6&_page=${page}`;
  });
  console.log(paginationUp);
};

// getPostListAsync().then(data => console.log)

// -----------------------
// MAIN LOGIC
// -----------------------
const init = async () => {
  // try {
  //   const postList = await postApi.getAll();
  //   console.log(postList);
  // } catch (error) {
  //   console.log(error);
  // }
  // Write your logic here ....
  // const data = await getPostListAsync();
  // console.log(data);

  // const post = await getPostDetail('1356b24a-8b63-41dc-9bbe-1bfd5f4a219a');
  // console.log(post);

  // post.author = 'Po Nguyen';
  // const updatedPost = await updatePost(post);
  // console.log('Updated post: ', updatedPost);

  // const post = await postApi.getDetail('1356b24a-8b63-41dc-9bbe-1bfd5f4a219a');
  // console.log(post);

  // postApi.getAll()
  //   .then(postList => console.log(postList))
  //   .catch(error => console.log('Failed to fetch post list: ', error));

  try {
    let param = new URLSearchParams(window.location.search);

    param.append("_limit", 6);
    param.append("page", param.get("_page") || 1);
    param.append("_sort", "updatedAt");
    param.append("_order", "desc");
    const postList = await postApi.getAll(param.toString());
    const data = postList.data;

    const pagination = postList.pagination;
    renderPagination(pagination);

    console.log(data);
    const listPost = document.querySelector("#postsList");
    for (const item of data) {
      const post = buildPostItem(item);
      listPost.appendChild(post);
    }
  } catch (error) {
    console.log(error);
  }
};

init();

// -------------------
