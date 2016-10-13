let DB = require('./DB');

class User{
    constuctor(){
    }

    Register(data){
        let db = new DB();
        db.Insert('User', data);   
    }
    
    Edit(user, data, cb){
        console.log("user.edit");
        console.log(user);
        let db = new DB();
        delete data.email;
        delete data.passwd2;
        delete data.identity;
        delete data.id;
        if(data.passwd === ""){
            delete data.passwd;
        }
        db.Edit(user, data, (result) => {
            cb(result);
        });
    }

    Login(data, cb){
        let db = new DB();
        db.Login(data, (result, isLogin) => {
            delete result.passwd;
            cb(result, isLogin);
        });   
    }
}

module.exports = User;
