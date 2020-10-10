var url = 'https://../../www.j4devel../opment.com?a=1';

// // var search = new RegExp("\..\/");
// // // var searchRegEx = new RegExp(/\..\/);
// // // console.log(searchRegEx)

// // url = url.replace(/\..\//g, '');
// // console.log(url)

// function replaceAll(str, replace_this, replace_with) {
//   // inserts value between every element of arr
//   // const interleave = (arr, thing) => [].concat(...arr.map(n => [n, thing])).slice(0, -1);
//   // var arr = "\\" + interleave(replace_this.split(""), "\\").join('');
//   const search = "\.\.\/";
//   const searchexp = new RegExp(search, 'gi');

//   str = str.replace(searchexp, replace_with);

//   return str
// }

// console.log(replaceAll(url, "../", ''))

// var s = 'ahttpssfds../../b'
var search = '../'
var searchRegEx = new RegExp(search, 'g')
console.log(url.replace(searchRegEx, ''))
// console.log(s)