var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express();
var PORT = process.env.PORT || 8080;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function(req, res){
   res.send('Todo API Root'); 
});

app.get('/todos', function(req, res){
   res.json(todos);
});

app.get('/todos/:id', function(req, res){
    var todoId = Number(req.params.id);
    var matchedTodo = _.findWhere(todos, {id: todoId}); 
    
    if(matchedTodo == undefined){
        res.status(404).send();        
    } else {
        res.json(matchedTodo);
    }
});

app.post('/todos', function(req, res){
    var body = _.pick(req.body, 'completed', 'description');
    
    if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
        return res.status(400).send();
    }
    
    body.description = body.description.trim();
    body.id = todoNextId;
    todoNextId++;
    todos.push(body);
    res.json(body);
});

app.delete('/todos/:id', function(req, res){
    var todoId = Number(req.params.id);
    var matchedTodo = _.findWhere(todos, {id: todoId});
    
    if(matchedTodo){
        todos = _.without(todos, matchedTodo);
        res.json(todos);
    } else{
        res.status(404).json({"error": "no todo found with that id"});
    }
});
app.put('/todos/:id', function(req, res){
    var body = _.pick(req.body, 'completed', 'description');
    var todoId = Number(req.params.id);
    var matchedTodo = _.findWhere(todos, {id: todoId});
    var validAttr = {};
    
    if(!matchedTodo){
        return res.status(404).json({"error": "id not found"});    
    }
    
    if(body.hasOwnProperty('completed') && _.isBoolean(body.completed)){
        validAttr.completed = body.completed;
    } else if(body.hasOwnProperty('completed')){
        return res.status(400).send();
    } else{
        //no attr
    }
    
    if(body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0){
        validAttr.description = body.description;
    } else if(body.hasOwnProperty('description')){
        return res.status(400).send();
    }
    
    _.extend(matchedTodo, validAttr);
    res.json(matchedTodo);
});
app.listen(PORT, function(){
    console.log('express listening on port ' + PORT); 
});