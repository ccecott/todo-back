// require the Express module
const express = require("express");

//creates a new router object
const todo = express.Router();
// must input the connection file 
const pool = require("./connections");
const todoUri = "/todo-list";

const items = [
];


todo.get(todoUri, (req, res) => {

    // .json sends response as JSON
    //   res.status(200).json(items); //note: defaults to 200 if request has succeeded.
    // we can use sql commants to get data from the database 
    pool.query("SELECT * FROM todos ORDER BY ID").then(result => {

        res.json(result.rows);

    })
});

// // route
// todo.get(`${todoUri}/:id`, (req, res) => {
//     const id = parseInt(req.params.id);
//     // Find by ID
//     const item = items.find(item => item.id === id);
//     if (item) {
//         res.status(200).json(item)
//     } else {
//         // Set response code to 404
//         res.status(404);
//         res.send(`ID ${id} Not Found`);
//     }
// });

// route
todo.post(todoUri, (req, res) => {
    // we have to target the column we want to post to using the syntax "($1::data type)",[req.body.value]
    pool.query("INSERT INTO todos(task, completed) VALUES($1::text,$2::boolean)",
        [req.body.task, req.body.completed]).then(() => {
            res.json(req.body)
        })
});


// route
todo.put(`${todoUri}/:id`, (req, res) => {
    pool.query("UPDATE todos SET completed=$1::boolean WHERE id=$2::int", [req.body.completed, req.params.id]).then(() => {
        res.json(req.body);
    })
});

// route
todo.delete(`${todoUri}/:id`, (req, res) => {
    pool.query("DELETE FROM todos WHERE id=$1::int", [req.params.id]).then(() => {
        res.status(200).json(`${req.params.id}`);
    })
});

module.exports = { todo };