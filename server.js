var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js')

var app = express();
var PORT = process.env.PORT || 8080;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function(req, res){
   res.send('Todo API Root'); 
});

app.get('/todos', function(req, res){
    var query = req.query;
    var where = {};    

    if(query.hasOwnProperty('completed') && query.completed === 'true'){
        where.completed = true;
    } else if (query.hasOwnProperty('completed') && query.completed === 'false'){
        where.completed = false;
    }
    
    if(query.hasOwnProperty('q') && query.q.length > 0){
        where.description = {
            $like: '%' + query.q + '%'
        };
    }
    
    db.todo.findAll({where: where}).then(function (todos){
       res.json(todos); 
    }, function(e){
        res.status(500).send();
    });
});

app.get('/todos/:id', function(req, res){
    var todoId = Number(req.params.id);
    
    db.todo.findById(todoId).then(function (todo){
        if(!!todo){
            res.json(todo.toJSON());
        } else {
            res.status(404).send();
        }
    }, function (e){
        res.status(500).send();
    });
    
});

app.post('/todos', function(req, res){
    var body = _.pick(req.body, 'completed', 'description');
    
    db.todo.create(body).then(function(todo){
       res.json(todo.toJSON()); 
    }, function(e){
        res.status(400).json(e);
    });
    
});

app.delete('/todos/:id', function(req, res){
    var todoId = Number(req.params.id, 10);
    
    db.todo.destroy({
       where: {
           id: todoId
       } 
    }).then(function (rowsDeleted){
        if(rowsDeleted === 0){
            res.status(404).json({
                error: 'No todo with id'
            });
        } else {
            res.status(204).send();
        }
    }, function(){
        res.status(500).send();
    });
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
    }
    
    if(body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0){
        validAttr.description = body.description;
    } else if(body.hasOwnProperty('description')){
        return res.status(400).send();
    }
    
    _.extend(matchedTodo, validAttr);
    res.json(matchedTodo);
});

db.sequelize.sync().then(function (){
    app.listen(PORT, function(){
        console.log('express listening on port ' + PORT); 
    });
});



