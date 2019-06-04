

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
     urlDB = 'mongodb+srv://mgarciaibanez:QsGEo6CFswKWjsC4@tfmcluster-ejih2.mongodb.net/cafe';
// }

process.env.URLDB = urlDB;