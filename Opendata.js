let DB = require('./DB');
let request  = require('request');

class Opendata{
    constructor(){
        this.url = [
            'http://opendata.hccg.gov.tw/dataset/503a35a6-159d-43f0-b5cc-3be0f7fa5ce5/resource/be6f5c20-cc86-48f9-9ad6-1ac8bf5c8e2d/download/20160714084008052.json',
            'http://opendata.hccg.gov.tw/dataset/98ce78ec-809a-4594-ae36-5f9bc38b33fa/resource/e3ef1633-a7de-49f5-aa55-194c0117a184/download/20150303172308789.json',
            'http://opendata.hccg.gov.tw/dataset/7fa90eef-f848-44f6-84b9-84b92f218e1f/resource/d4e63dbc-4d5d-4556-8a7e-6e8adfb5a4e4/download/20150306171627347.json'
        ]
    }

    GetInfo(cb){
        let data = [];
        let db = new DB();
        this._GetStore()
        .then((result) => {
            data = data.concat(result);
            return this._GetGroup();
        }).then((result) => {
            data = data.concat(result);
            return db.PromiseGet('UnregisterUser');    
        }).then((result) => {
            for(let obj of data){
                let flag = true;
                for(let user of result){
                    if(obj.id == user.id){
                        flag = false;
                        break;
                    }
                }
                if(flag){
                    let indb = new DB();
                    obj.registered = false;
                    indb.Insert('UnregisterUser', obj);
                }
            }               
            cb(data);
        }).catch((err) => {
            throw err;
        });
    }

    _InsertUser(){
        
    }

    _GetStore(){
        let options = {
            url: 'https://api.parse.com/1/functions/getStores',
            method: 'POST',
            headers: {
                'X-Parse-Application-Id': 'oVYLOizsuLXxCRucXmrgWF6q0OjlXc9d1fXfBDmU',
                'X-Parse-REST-API-Key': 'iiBwHRMDSpWdP8NEODUx0WkBXWay5q8YvEPFCxIA',
                'Content-Type': 'application/json'
            }
        }
        return new Promise((resolve, reject) => {
            request(options, (err, res, body) => {
                if(!err && res.statusCode == 200){
                    let info = JSON.parse(body);
                    for(let obj of info.result){
                        obj.identity = "Store";
                        obj.name = obj.storeName;
                        delete obj.storeName;
                    }
                    resolve(info.result);
                } else{
                    reject(err);
                }
            });
        });
    }   

    _GetGroup(){
        return new Promise((resolve, reject) => {
            let data = [];
            this.__groupSrc1().then((result) =>{
                data = data.concat(result);
                return this.__groupSrc2();
            }).then((result) => {
                data = data.concat(result);
                return this.__groupSrc3();
            }).then((result) => {
                data = data.concat(result);
                resolve(data);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    __groupSrc1(){
        return new Promise((resolve, reject) => {
            request(this.url[0], (err, res, body) => {
                if(!err && res.statusCode == 200){
                    let jsonStr = body.replace(/\n/g, "\\n").replace(/\s/g, '');
                    let data = JSON.parse(jsonStr);
                    let parsedData = [];
                    for(let obj of data){
                        let newObj = {};
                        newObj.name = obj['機構名稱'];
                        newObj.address = obj['地址'];
                        newObj.phone = obj['電話'];
                        newObj.id = `Src1Num${obj['編號']}`;
                        newObj.identity = "group";
                        parsedData.push(newObj);
                    }
                    resolve(parsedData);
                } else {
                    reject(err);
                }
            });   
        });
    }
    
    __groupSrc2(){
        return new Promise((resolve, reject) => {
            request(this.url[1], (err, res, body) => {
                if(!err && res.statusCode == 200){
                    let jsonStr = body.replace(/\n/g, "\\n").replace(/\s/g, '');
                    let data = JSON.parse(jsonStr);
                    let parsedData = [];
                    for(let obj of data){
                        let newObj = {};
                        newObj.name = obj['單位名稱'];
                        newObj.address = obj['地址'];
                        newObj.phone = obj['聯絡電話'];
                        newObj.id = `Src2Num${obj['聯絡電話'].replace(/[^0-9]/g, '')}`;
                        newObj.identity = "group";
                        parsedData.push(newObj);
                    }
                    resolve(parsedData);
                } else {
                    reject(err);
                }
            });   
        });
    }
    
    __groupSrc3(){
        return new Promise((resolve, reject) => {
            request(this.url[2], (err, res, body) => {
                if(!err && res.statusCode == 200){
                    let jsonStr = body.replace(/\n/g, "\\n").replace(/\s/g, '');
                    let data = JSON.parse(jsonStr);
                    let parsedData = [];
                    for(let obj of data){
                        let newObj = {};
                        newObj.name = obj['單位名稱'];
                        newObj.address = obj['地址'];
                        newObj.phone = obj['電話'];
                        newObj.id = `Src3Num${obj['序號']}`;
                        newObj.identity = "group";
                        parsedData.push(newObj);
                    }
                    resolve(parsedData);
                } else {
                    reject(err);
                }
            });   
        });
    }
}

module.exports = Opendata;
