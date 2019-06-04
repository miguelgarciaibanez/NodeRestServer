

//============
// Puerto
//============
process.env.PORT = process.env.PORT || 3000;



//=================
//Env
//=================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev' 


//================
// DATABASE
//================

let urlDB;

// if (process.env.NODE_ENV === 'dev'){
//     urlDB = 'mongodb://localhost:27017/cafe';
// } else {
     urlDB = process.env.mongoURI;
// }

process.env.URLDB = urlDB;