'use strict';
import AppConstants from './appConstants.js';
import postAPI from './api/postApi.js';
import utils from './utils.js';
// -----------------------
// MAIN LOGIC
// -----------------------


// ------------Learning-----------

// const getPostList = () => { //trả về 1 cái promise

//   const options = {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//   };

//   return fetch('https://js-post-api.herokuapp.com/api/posts', options) //return promise
//     .then(response => {
//       // console.log(response);
//       if (response.status >= 200 && response.status <= 300) {
//         return response.json(); //parse body về dạng json
//         //respose.json() trả về 1 cái promise
//       }
//     });
// };
// getPostList().then(data => console.log(data));

// async function abc(){}

// Async-await
const getPostListAsync = async () => { //trả về 1 cái promise

  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  };

  const response = await fetch('https://js-post-api.herokuapp.com/api/posts', options) //return data
  //nếu thiếu await thì nó sẽ k thực thi mà chỉ tạo ra 1 promise
  // console.log(response);
  if (response.status >= 200 && response.status <= 300) {
    return response.json(); //parse body về dạng json
    //respose.json() trả về 1 cái promise
  }

};

const getPostDetailAsync = async (postID) => {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  };

  const url = `${AppConstants.API_URL}/posts/${postID}`;

  const response = await fetch(url, options)
  if (response.status >= 200 && response.status < 300)
    return await response.json();
}

//update post
const updatePostDetailAsync = async (post) => {
  const options = {
    method: 'PATCH', //update
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(post), //body này là 1 cái chuỗi
    // JSON.stringify(post) từ JSON object sẽ chuyển về dạng chuỗi
  };

  const url = `${AppConstants.API_URL}/posts/${post.id}`;

  const response = await fetch(url, options);
  if (response.status >= 200 && response.status < 300)
    return await response.json();
}


const renderListPost = (pagination) => {
  let page = pagination._page;

  const nextElement = document.querySelector('#next');
  if (nextElement) {
    nextElement.addEventListener('click', () => {
      ++page;
      nextElement.href = `?_limit=6&_page=${page}`;
    })
  }

  const previousElement = document.querySelector('#previous');
  if (previousElement) {
    previousElement.addEventListener('click', () => {
      --page;
      previousElement.href = `?_limit=6&_page=${page}`;
    });
  }

};



// const data = await getPostListAsync();

const getPostsListElement = () => document.querySelector('ul#postsList');

const handleRemoveButtonClicked = async (post) => {
  try {
    const confirmMessage = `Bạn có muốn xóa ${post.title} này?`;
    if (window.confirm(confirmMessage)) {
      await postAPI.remove(post.id);

      window.location.reload();
    }

  } catch (error) {
    alert('Failed to remove post', error);
  }
};

const buildPostItemElement = (post) => {
  const postItemTemplate = document.querySelector('#postItemTemplate');
  const postItemFragment = postItemTemplate.content.cloneNode(true);
  const postItemElement = postItemFragment.querySelector('li');

  const postItemTitle = postItemElement.querySelector('#postItemTitle');
  console.log(postItemTitle);
  if (postItemTitle) {
    postItemTitle.innerHTML = post.title;
    // postItemTitle.removeAttribute('id');
  }

  const postItemImage = postItemElement.querySelector('#postItemImage');
  if (postItemImage) {
    const postThumbnail = post.imageUrl.split('/');
    postThumbnail.pop();
    postThumbnail.pop();
    postThumbnail.push('400', '117');
    postItemImage.src = postThumbnail.join('/');
  }

  const postItemDescription = postItemElement.querySelector('#postItemDescription');
  if (postItemDescription) {
    postItemDescription.innerText = utils.truncateTextlength(post.description, 150);
    // postItemTitle.removeAttribute('id');
  }

  const postItemAuthor = postItemElement.querySelector('#postItemAuthor');
  if (postItemAuthor) {
    postItemAuthor.innerHTML = post.author
  }

  const postItemTimeSpan = postItemElement.querySelector('#postItemTimeSpan');
  if (postItemTimeSpan) {
    postItemTimeSpan.innerHTML = utils.formatDate(post.updatedAt);
  }

  const postItemRemoveButton = postItemElement.querySelector('#postItemRemove');
  if (postItemRemoveButton) {
    postItemRemoveButton.addEventListener('click', (e) => {
      handleRemoveButtonClicked(post);
      e.stopPropagation();
    });
  }

  const postItem = postItemElement.querySelector('#postItem');
  if (postItem) {
    postItem.addEventListener('click', () => {
      const postItemUrl = `post-detail.html?postId=${post.id}`;
      window.location = postItemUrl;
    });
  }

  const postItemEdit = postItemElement.querySelector('#postItemEdit');
  if (postItemEdit) {
    postItemEdit.addEventListener('click', (e) => {
      const postItemUrl = `add-edit-post.html?postId=${post.id}`;
      window.location = postItemUrl;
      e.stopPropagation();
    });
  }
  return postItemElement;
};

const renderPostApp = (postsList) => {
  const postsListElement = getPostsListElement();
  if (postsListElement) {
    for (const post of postsList) {
      const postItemElement = buildPostItemElement(post);
      postsListElement.appendChild(postItemElement);
    }
  }
};

const init = async () => {
  // Write your logic here ....
  // const data = await getPostListAsync();
  // console.log(data);

  // const post = await getPostDetailAsync('1356b24a-8b63-41dc-9bbe-1bfd5f4a219a');
  // console.log(post);

  // post.author = 'Cuong Nguyen';
  // const updatedPost = await updatePostDetailAsync(post);
  // console.log('Updated post: ', updatedPost);
  // let count = 1;



  // console.log(count);

  // const params = URLSearchParams(window.location.search);
  // const page = params.get('_page');


  const paramStrings = new URLSearchParams(window.location.search);
  let page = paramStrings.get('_page');


  const paramLimit = {
    _limit: 6,
    _page: page || 1,
  };

  const paramString = new URLSearchParams(paramLimit);
  console.log(paramString.toString());



  const postList = await postAPI.getAll(paramString);
  console.log(postList);
  const data = postList.data;
  const pagination = postList.pagination;
  // console.log(postList);
  renderListPost(pagination);
  // const post = await postAPI.getDetail('1356b24a-8b63-41dc-9bbe-1bfd5f4a219a');
  // console.log(post);
  renderPostApp(data);
};
init();