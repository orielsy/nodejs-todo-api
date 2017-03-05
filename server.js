var express = require('express');
var bodyParser = require('body-parser');

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

//app.get('/todos/')
app.get('/todos/:id', function(req, res){
    var todoId = Number(req.params.id);
    var matchedTodo; 
    
    for(var x = 0; x < todos.length; x++){
        if(todos[x].id == todoId){
            matchedTodo = todos[x];
        }
    }
    
    if(matchedTodo == undefined){
        res.status(404).send();        
    } else {
        res.json(matchedTodo);
    }
});

app.post('/todos', function(req, res){
    var body = req.body;
    
    body.id = todoNextId;
    todoNextId++;
    todos.push(body);
    
    /*var hold = {
        id: todoNextId,
        description: body.description,
        completed: body.completed
    };
    todos.push(hold);*/
    
    res.json(todos);
});

app.listen(PORT, function(){
    console.log('express listening on port ' + PORT); 
});