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

app.listen(PORT, function(){
    console.log('express listening on port ' + PORT); 
});