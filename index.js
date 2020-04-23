//express
const express = require('express');
const app = express();
const cors = require('cors');
//body-parser
const bodyParser = require('body-parser');
//mqtt.js
const mqtt = require('mqtt')
var client  = mqtt.connect('')//colocar aqui a url do broker MQTT

//variaveis de control
var found = []; //armazenar as respostas
var show = -1; //armazenar a que vai ser enviada
var index = 0; //armazenar a ordem

app.use(cors())
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


var exist = (look) => {
    var func = cel => cel.id == look.id;
    var equals = found.filter(func)
    if(equals.length == 0){
        return false;
    }else{
        return true;
    }
}

app.get('/achados',(req,res) => {
    res.statusCode = 200;
    res.json(found);
});

app.get('/achado/:id', (req,res)=>{
    var id = req.params.id;
    if(isNaN(id)){
        res.sendStatus(400)
    }else{
        var founded = found[id]
        if(founded == undefined){
            res.statusCode = 404;
            res.json({id: 'Vazio' , index: 0});
        }else{
            res.statusCode = 200;
            res.json(founded);
        }
    }
});

//Mqtt

client.on('connect', function () {
    client.subscribe('outTopic', function (err) {
    })
});
  
client.on('message', function (topic, message) {
    var insert = {id: message.toString().trim(), index: index};
    if(!exist(insert)){
        found.push(insert);
        show++;
        index++;
    }
    console.log(found[show]);
});

app.listen(3035,()=>{
    console.log('Api rodando');
})
