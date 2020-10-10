

function extractPhones(source) {
  const regex = '?'
  return source.match(regex)
}


const EX_TEXT = "hello 214-111-2222 how are you? do you know 2145558888?"
console.log(extractPhones(EX_TEXT))



