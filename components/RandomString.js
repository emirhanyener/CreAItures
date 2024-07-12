const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
function randomString(size){
    let str = "";
    for (let index = 0; index < size; index++) {
        str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str;
}

module.exports = { randomString };
