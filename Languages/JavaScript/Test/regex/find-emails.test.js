

function extractEmails(source) {
  const regex = /\S+[a-z0-9]@[a-z0-9\.]+/img
  return source.match(regex)
}


const EX_TEXT = "hello sean@example.com how are you? do you know bob@example.com?"
console.log(extractEmails(EX_TEXT))



