let web_1 = "https://pushnami.com/";
let web_2 = "https://www.pushnami.com/dadada"

let test1 = web_1.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').replace(/.com.+/, '');
let test2 = web_2.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').replace(/.com.+/, '');

test1
test2
let out = (test1 === test2)
out
