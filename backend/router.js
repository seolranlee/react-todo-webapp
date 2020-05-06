"use strict";
const Router = app => {
  global.__basedir = __dirname;
  const timezoneOffset = new Date().getTimezoneOffset() * 60000;
  const timezoneDate = new Date(Date.now() - timezoneOffset);
  global.now = timezoneDate.toISOString().slice(0, 10);
  const multer = require("multer");
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, __basedir + "/uploads/");
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname);
    }
  });
  const upload = multer({ storage: storage });
  const Todo = require("./controllers/todo/Index").list();

  app.get("/todos", (req, res) => Todo.getTodos(req, res));
  app.get("/todos/relationship", (req, res) => Todo.relations(req, res));
  app.get("/todos/download/excel", (req, res) => Todo.download(req, res));
  app.get("/todos/:id", (req, res) => Todo.todo(req, res));
  app.get("/todos/:id/relationship", (req, res) => Todo.relation(req, res));
  app.put("/todos/:id/done", (req, res) => Todo.toggleDone(req, res));
  app.put("/todos/:id", (req, res) => Todo.updateTodo(req, res));
  app.post("/todos/new", (req, res) => Todo.createTodo(req, res));
  app.post("/todos/uploadfile", upload.single("file"), (req, res) =>
    Todo.uploadFile(req, res)
  );
  app.delete("/todos/:id", (req, res) => Todo.deleteTodo(req, res));
  app.delete("/todos/relation/children/:id", (req, res) =>
    Todo.deleteChildren(req, res)
  );
  app.delete("/todos/relation/parent/:id", (req, res) =>
    Todo.deleteParent(req, res)
  );
};

module.exports = Router;
