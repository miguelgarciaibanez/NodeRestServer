

//============
// Puerto
//============
process.env.PORT = process.env.PORT || 3000;



//=================
//Env
//=================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev' 

//=================
// Token expiration
//=================
// 60 SECS * 60 mins * 24 hours * 30 dias
process.env.TOKEN_EXPIRATION = 60*60*24*30

//=================
// token SEED
//=================
process.env.TOKEN_SEED = process.env.TOKEN_SEED || 'development-secret-seed'

//================
// DATABASE
//================

let urlDB;

if (process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
     urlDB = process.env.mongoURI; // Set up in heroku
}

process.env.URLDB = urlDB;

//================
// google client Id
//================

process.env.CLIENT_ID = process.env.CLIENT_ID || '275065576702-cq315q3bd20oun0f9e8iaeqmcu8rufcj.apps.googleusercontent.com';
