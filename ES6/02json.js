//将对象，数组转换成字符串
let string = JSON.stringify({
    "squirrel": false,
    "events": ["work", "touched tree", "pizza", "running"]
});
console.log(string);
//将字符串转成json对象
console.log(JSON.parse(string).events);