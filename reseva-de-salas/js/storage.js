const storage = {

get: (key) => {
return JSON.parse(localStorage.getItem(key)) || [];
},

set: (key,data) => {
localStorage.setItem(key,JSON.stringify(data));
},

generateId: () => {
return '_' + Math.random().toString(36).substr(2,9);
}

}