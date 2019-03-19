 //rest parameters
 function Max(...numbers) {
    let result = -Infinity;
    for(let number of numbers){
        if(number > result)
            result = number;
    }
    return result;
}
console.log(Max(4,1,9,-2));