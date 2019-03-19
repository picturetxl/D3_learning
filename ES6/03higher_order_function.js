function nosiy(f){
    return (...args) => {
        console.log("calling with ",args);
        let result = f(...args);
        console.log("calling with ",args," returned ",result);
        return result;
    }
}
nosiy(Math.min)(3,2,1);