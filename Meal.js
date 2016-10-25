let DB = require('./DB');

class Meal{
    constructor(meal){
    }
    
    Provide(data){
        data.remain = data.count;
        let db = new DB();
        if(data.item !== "---")
            data.name = data.item;
        delete data.item;
        db.Insert("Provide", data);
    }

    Need(data){
        let db = new DB();
        db.Insert("Need", data);
    }

    Get(cb){
        let db = new DB();
        db.Get("Need", (result) =>{
            cb(result);
        });
    }

    GetMeal(cb){
        let db = new DB();
        db.GetMeal((result) => {
            cb(result);
        });  
    }

}

module.exports = Meal;
