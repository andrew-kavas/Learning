const posts = [
  { title: "post 1", body: 'this is post one'},
  { title: "post 2", body: 'this is post two'}
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

function createPost(post) {
  // create promise, must include resolve and reject params
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      posts.push(post);

      // error check
      const error = true;
      
      // if no error -> resolve normally
      if (!error) {
        resolve();
      // if error -> reject
      } else {
        reject("Error: Something went wrong");
      }
    }, 2000);
  });
}

createPost({ title: "post 3", body: "This is post three"})
  .then(getPosts)
  .catch(err => console.log(err));
