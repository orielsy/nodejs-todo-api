var express = require('express');
var app = express();
var PORT = process.env.PORT || 8080;
var todos = [{
        id: 1,
        description: 'meet mom for lunch',
        completed: false 
    },
    {
        id: 2,
        description: 'go to market',
        completed: false
    },
    {
        id: 3,
        description: 'booty rape',
        completed: true
    }
];

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

app.listen(PORT, function(){
   console.log('express listening on port ' + PORT); 
});