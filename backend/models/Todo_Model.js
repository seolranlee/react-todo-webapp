"use strict";

class Todo {
  constructor() {
    this._model = require("./Todo_Index.js");
  }

  model() {
    return {
      getTodos: (sql, data, callback) => this.getTodos(sql, data, callback),
      getCounts: (sql, data, callback) => this.getCounts(sql, data, callback),
      getTodo: (data, callback) => this.getTodo(data, callback),
      getRelations: (data, callback) => this.getRelations(data, callback),
      getRelation: (id, callback) => this.getRelation(id, callback),
      getFile: (data, callback) => this.getFile(data, callback),
      toggleDone: (id, done, callback) => this.toggleDone(id, done, callback),
      updateTodo: (sql, id, callback) => this.updateTodo(sql, id, callback),
      createTodo: (sql, data, callbac) => this.createTodo(sql, data, callbac),
      uploadFile: (filePath, callback) => this.uploadFile(filePath, callback),
      deleteTodo: (id, callback) => this.deleteTodo(id, callback),
      deleteChildren: (id, callback) => this.deleteChildren(id, callback),
      deleteParent: (id, callback) => this.deleteParent(id, callback)
    };
  }
}

class TodoModel extends Todo {
  getTodos(sql, data, callback) {
    this._model.execute(sql, data, callback);
  }
  getCounts(sql, data, callback) {
    this._model.execute(sql, data, callback);
  }
  getTodo(id, callback) {
    this._model.execute(
      `
      SELECT 
        todo_id,
          text,
          done,
          date_format(createdAt,'%Y-%m-%d') as created_at,
          date_format(updatedAt,'%Y-%m-%d') as updated_at
        FROM todos
        WHERE todo_id = ${id} 
    `,
      id,
      callback
    );
  }
  getRelations(data, callback) {
    this._model.execute(`SELECT * FROM todos_relationships`, data, callback);
  }
  getRelation(id, callback) {
    this._model.execute(
      `
      select 
        todos.todo_id as id,
        todos.text as text,
        todos.done as done,

        todosf.todo_id as referring_id,
        todosf.text as referring_text,
        todosf.done as referring_done,

        todosff.todo_id as referenced_id,
        todosff.text as referenced_text,
        todosff.done as referenced_done

    from todos

    join todos_relationships
      on todos.todo_id = todos_relationships.todo_id
      or todos.todo_id = todos_relationships.parent_id

    left outer join todos todosf
      on (todosf.todo_id = todos_relationships.parent_id and
        todosf.todo_id <> todos.todo_id)
  
    left outer join todos todosff
      on (todosff.todo_id = todos_relationships.todo_id and
        todosff.todo_id <> todos.todo_id)
    
    where todos.todo_id = ${id} 
    
    `,
      id,
      callback
    );
  }
  getFile(data, callback) {
    this._model.execute(
      `
      SELECT 
        todo_id,
        text,
        done,
        date_format(createdAt,'%Y-%m-%d') as created_at,
        date_format(updatedAt,'%Y-%m-%d') as updated_at
      FROM todos
      `,
      data,
      callback
    );
  }
  toggleDone(data, callback) {
    this._model.execute(
      `
      update todos
      set done = ${data.done}
      where todo_id = ${data.id}
    `,
      data,
      callback
    );
  }
  updateTodo(sql, id, callback) {
    this._model.execute(sql, id, callback);
  }
  createTodo(sql, data, callback) {
    this._model.execute(sql, data, callback);
  }
  uploadFile(filePath, callback) {
    const readXlsxFile = require("read-excel-file/node");
    readXlsxFile(filePath).then(rows => {
      // Remove Header ROW
      rows.shift();

      this._model.execute(
        `INSERT INTO todos (text, done) VALUES ?`,
        [rows],
        callback
      );
    });
  }
  deleteTodo(id, callback) {
    this._model.execute(
      `
      DELETE FROM todos
      WHERE todo_id = ${id}
    `,
      id,
      callback
    );
  }
  deleteChildren(id, callback) {
    this._model.execute(
      `
      DELETE FROM todos_relationships
      WHERE todo_id = ${id}
    `,
      id,
      callback
    );
  }
  deleteParent(id, callback) {
    this._model.execute(
      `
      DELETE FROM todos_relationships
      WHERE parent_id = ${id}
    `,
      id,
      callback
    );
  }
}

module.exports = new TodoModel();
