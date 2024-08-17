const express = require('express');
const app = express();
const cors = require('cors');
const pool = require("./db");



//middleware 
app.use(cors());
app.use(express.json());//req.body

//Routes
//delete a to do
app.delete("/todos/:id", async (req,res)=>{
    try {
        const {id} = req.params;
        const deleteTodo = await pool.query("DELETE FROM todo WHERE todo_id = $1", [id]);
        res.json("To do deleted");
    } catch (err) {
        console.error(err.message);
    }
})


//get a to do
app.get("/todos/:id", async(req,res)=>{
    try {
        const {id} = req.params;
        const todo = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [id]);
        res.json(todo.rows[0])
    } catch (error) {
        console.error(err.message);
    }
})



//get all to do
app.get("/todos", async(req,res)=>{
    try {
        const allTodos = await pool.query("SELECT * FROM todo");
        res.json(allTodos.rows);
    } catch (err) {
        console.error(err.message);
    }

})

//update a to do
app.put("/todos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { description } = req.body;

        // Check if description is provided
        if (!description) {
            return res.status(400).json({ error: "Description is required" });
        }

        // Check if the todo exists
        const todoExists = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [id]);
        if (todoExists.rows.length === 0) {
            return res.status(404).json({ error: "Todo not found" });
        }

        // Update the todo
        await pool.query("UPDATE todo SET description = $1 WHERE todo_id = $2", [description, id]);

        // Return the updated row
        const updatedTodo = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [id]);
        res.json(updatedTodo.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
});



//Creating a to do

app.post("/todos", async(req, res)=>{ //By using async, we can use await which allow us to wait for the function to complete to continue.
try{
    const {description} = req.body;
    const newTodo = await pool.query("INSERT INTO todo (description) VALUES($1)", [description]);

    res.json(newTodo);
}catch (err){
    console.error(err.message);
}
})


app.listen(5000, ()=>{
    console.log("Server started")
});

