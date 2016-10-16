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
    GetStore(){
        let options = {
            url: 'https://api.parse.com/1/functions/getStores',
            method: 'POST',
            headers: {
                'X-Parse-Application-Id': 'oVYLOizsuLXxCRucXmrgWF6q0OjlXc9d1fXfBDmU',
                'X-Parse-REST-API-Key': 'iiBwHRMDSpWdP8NEODUx0WkBXWay5q8YvEPFCxIA',
                'Content-Type': 'application/json'
            }
        }
        request(options, (err, res, body) => {
            if(!err && res.statusCode == 200){
                let info = JSON.parse(body);
                console.log(info.result);
            } else{
                console.log(res.statusCode);
                console.log(err);
            }
        });
    }   

    GetGroup(){
        let data = [];
        this.__groupSrc1();
        this.__groupSrc2();
        this.__groupSrc3();
    
    }

    __groupSrc1(){
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
                    parsedData.push(newObj);
                }
                console.log(parsedData);
            }
        });   
    }
    
    __groupSrc2(){
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
                    parsedData.push(newObj);
                }
                console.log(parsedData);
            }
        });   
    }
    
    __groupSrc3(){
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
                    parsedData.push(newObj);
                }
                console.log(parsedData);
            }
        });   
    }
}

let opendata = new Opendata();

//opendata.GetStore();
opendata.GetGroup();
