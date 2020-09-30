const posts = [
  { title: "post 1", body: "this is post one"},
  { title: "post 2", body: "this is post two"}
];

function getPosts() {
  setTimeout(() => {
    let output='';
    posts.forEach((post, index) => {
      output += `<li>${ post.title }</li>`;
    })
    document.body.innerHTML = output;
  // timeout = 1s
  }, 1000);
}

// define callback
function createPost(post, callback) {
  setTimeout(() => {
    posts.push(post);
    // call the callback
    callback();
  // timeout = 2s
  }, 2000);
}

// pass getPosts as callback to createPost
// ensures that getPosts is run after createPost
createPost({ title: "post 3", body: "This is post three"}, getPosts);
