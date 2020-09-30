// https://www.youtube.com/watch?v=HgA5VOFan5E&t=1s
// constant runtime, O(1)
function log(array) {
	console.log(array[0]);
	console.log(array[1]);
}

log([1, 2]);
log([1, 2, 3, 4]);
log([1, 2, 3, 4, 5, 6, 7, 8]);


// linear runtime, O(n)
function logAll(array) {
	for (var i = 0; i < array.length; i++) {
		console.log(array[i]);
	}
}

logAll([1, 2]);
logAll([1, 2, 3, 4]);
logAll([1, 2, 3, 4, 5, 6, 7, 8]);


// exponential runtime, O(n^2)
function addAndLog(array) {
	for (var i = 0; i < array.length; i++) {
		for (var j = 0; j < array.length; j++) {
			console.log(array[i] + array[j]);
		}
	}
}

addAndLog(['A', 'B', 'C']);  			// 9 pairs
addAndLog(['A', 'B', 'C', 'D']);		// 16 pairs
addAndLog(['A', 'B', 'C', 'D', 'E']);	// 25 pairs


// logarithmic runtime, O(log n)
// returns index of key in array
function binarySearch(array, key) {
	var low = 0;
	var high = array.length - 1;
	var mid;
	var element;

	while (low <= high) {
		mid = Math.floor((low + high) / 2, 10);
		element = array[mid];
		if (element < key) {
			low = mid + 1;
		} else if (element > key) {
			high = mid - 1;
		} else {
			return mid;
		}
	}
	return -1;
}

console.log(binarySearch([2, 3], 2));
console.log(binarySearch([2, 3, 4, 5], 4));
console.log(binarySearch([2, 3, 4, 5, 6, 7, 8, 9], 6));
