"use strict";
class Todo {
  constructor() {
    this._data = { title: "todos" };
    this._todo = require("../../models/Todo_Model.js").model();
  }

  list() {
    return {
      getTodos: (req, res) => this.getTodos(req, res),
      todo: (req, res) => this.todo(req, res),
      relations: (req, res) => this.relations(req, res),
      relation: (req, res) => this.relation(req, res),
      download: (req, res) => this.download(req, res),
      toggleDone: (req, res) => this.toggleDone(req, res),
      updateTodo: (req, res) => this.updateTodo(req, res),
      createTodo: (req, res) => this.createTodo(req, res),
      uploadFile: (req, res) => this.uploadFile(req, res),
      deleteTodo: (req, res) => this.deleteTodo(req, res),
      deleteChildren: (req, res) => this.deleteChildren(req, res),
      deleteParent: (req, res) => this.deleteParent(req, res)
    };
  }
}

class TodoController extends Todo {
  getTodos(req, res) {
    const tomodel = {};
    if (req.query.orderby === undefined || req.query.orderby === "")
      req.query.orderby = "todo_id";
    const page = Number(req.query.page) || 1; // NOTE: 쿼리스트링으로 받을 페이지 번호 값, 기본값은 1
    const contentSize = 5; // NOTE: 페이지에서 보여줄 컨텐츠 수.
    const pnSize = 5; // NOTE: 페이지네이션 개수 설정.
    const skipSize = (page - 1) * contentSize; // NOTE: 다음 페이지 갈 때 건너뛸 리스트 개수.
    let sql = "";

    if (req.query.done || req.query.keyword || req.query.startdate) {
      if (req.query.done.length === 0) req.query.done = "%";
      if (req.query.startdate.length === 0) req.query.startdate = "0000-01-01";
      if (req.query.enddate.length === 0) req.query.enddate = now;
      sql = `
          SELECT count(*) as count FROM todos
          WHERE done LIKE '${req.query.done}' 
          and date_format(createdAt,'%Y-%m-%d') between '${req.query.startdate}' and '${req.query.enddate}'
          AND text LIKE '%${req.query.keyword}%';
          `;
    } else sql = `SELECT count(*) as count FROM todos`;

    const render = () => {
      const promiseFunc = (resolve, reject) => {
        this._todo.getTodos(sql, tomodel, (countQueryErr, countQueryResult) => {
          if (countQueryErr) throw countQueryErr;
          const totalCount = Number(countQueryResult[0].count); // NOTE: 전체 글 개수.
          const pnTotal = Math.ceil(totalCount / contentSize); // NOTE: 페이지네이션의 전체 카운트
          const pnStart = (Math.ceil(page / pnSize) - 1) * pnSize + 1; // NOTE: 현재 페이지의 페이지네이션 시작 번호.
          let pnEnd = pnStart + pnSize - 1; // NOTE: 현재 페이지의 페이지네이션 끝 번호.
          let sql = "";

          if (req.query.done || req.query.keyword || req.query.startdate)
            sql = `
          SELECT 
            todo_id,
            text,
            done,
            date_format(createdAt,'%Y-%m-%d') as created_at,
            date_format(updatedAt,'%Y-%m-%d') as updated_at
          FROM todos
          WHERE done LIKE '${req.query.done}' 
          and date_format(createdAt,'%Y-%m-%d') between '${req.query.startdate}' and '${req.query.enddate}'
          AND text LIKE '%${req.query.keyword}%'
          ORDER BY ${req.query.orderby} DESC LIMIT ?, ?;
          `;
          else
            sql = `
          SELECT 
            todo_id,
            text,
            done,
            date_format(createdAt,'%Y-%m-%d') as created_at,
            date_format(updatedAt,'%Y-%m-%d') as updated_at
          FROM todos
          ORDER BY ${req.query.orderby} 
          DESC LIMIT ?, ?
            `;
          this._todo.getCounts(
            sql,
            [skipSize, contentSize],
            (contentQueryErr, contentQueryResult) => {
              if (contentQueryErr) throw contentQueryErr;
              if (pnEnd > pnTotal) pnEnd = pnTotal; // NOTE: 페이지네이션의 끝 번호가 페이지네이션 전체 카운트보다 높을 경우.
              const results = {
                page,
                pnStart,
                pnEnd,
                pnTotal,
                todos: contentQueryResult
              };
              res.send(JSON.stringify(results));
            }
          );
        });
      };
      return new Promise(promiseFunc);
    };

    render();
  }
  todo(req, res) {
    const { id } = req.params;

    const render = () => {
      const promiseFunc = (resolve, reject) => {
        this._todo.getTodo(id, (err, rows) => {
          if (err) throw err;

          this._data.result = rows;

          res.send(JSON.stringify(this._data.result));
        });
      };
      return new Promise(promiseFunc);
    };

    render();
  }
  relations(req, res) {
    const tomodel = {};
    const render = () => {
      const promiseFunc = (resolve, reject) => {
        this._todo.getRelations(tomodel, (err, rows) => {
          if (err) throw err;

          this._data.result = rows;

          res.send(JSON.stringify(this._data.result));
        });
      };
      return new Promise(promiseFunc);
    };

    render();
  }
  relation(req, res) {
    const { id } = req.params;
    const render = () => {
      const promiseFunc = (resolve, reject) => {
        this._todo.getRelation(id, (err, rows) => {
          if (err) throw err;

          this._data.result = rows;

          res.send(JSON.stringify(this._data.result));
        });
      };
      return new Promise(promiseFunc);
    };

    render();
  }
  download(req, res) {
    //setting
    const excel = require("exceljs");
    const tomodel = {};
    const render = () => {
      const promiseFunc = (resolve, reject) => {
        this._todo.getFile(tomodel, (err, rows) => {
          if (err) throw err;

          // this._data.result = rows;
          const todoDatas = JSON.parse(JSON.stringify(rows));
          let workbook = new excel.Workbook(); //creating workbook
          let worksheet = workbook.addWorksheet("todos"); //creating worksheet

          //  WorkSheet Header
          worksheet.columns = [
            { header: "todo_id", key: "todo_id", width: 11 },
            { header: "text", key: "text", width: 100 },
            { header: "done", key: "done", width: 1 },
            {
              header: "created_at",
              key: "created_at",
              width: 100,
              outlineLevel: 1
            },
            {
              header: "updated_at",
              key: "updated_at",
              width: 100,
              outlineLevel: 1
            }
          ];

          // Add Array Rows
          worksheet.addRows(todoDatas);

          res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          );
          res.setHeader(
            "Content-Disposition",
            "attachment; filename=" + now + "todos.xlsx"
          );

          return workbook.xlsx.write(res).then(function() {
            res.status(200).end();
          });
          // res.send(JSON.stringify(this._data.result));
        });
      };
      return new Promise(promiseFunc);
    };

    render();
  }
  toggleDone(req, res) {
    const tomodel = {
      id: req.params.id,
      done: req.body.done
    };

    const render = () => {
      const promiseFunc = (resolve, reject) => {
        this._todo.toggleDone(tomodel, (err, rows) => {
          if (err) throw err;

          this._data.result = rows;

          res.send(JSON.stringify(this._data.result));
        });
      };
      return new Promise(promiseFunc);
    };

    render();
  }
  updateTodo(req, res) {
    const { id } = req.params;
    let sql = `
    UPDATE todos
    SET text='${req.body.data[0].text}', done=${req.body.data[0].done}
    WHERE todo_id=${id}
`;
    const render = () => {
      const promiseFunc = (resolve, reject) => {
        this._todo.updateTodo(sql, id, (err, rows) => {
          if (err) throw err;
          this._data.result = rows;
          res.send(JSON.stringify(this._data.result));
          if (req.body.data[1].remove !== null) {
            const removeIdArr = req.body.data[1].remove;
            for (let i = 0; i < removeIdArr.length; i++) {
              let sql = `
              DELETE FROM todos_relationships
              WHERE todo_id=${id} and parent_id=${removeIdArr[i]};
              `;
              this._todo.updateTodo(sql, id, (err, rows) => {
                if (err) throw err;
              });
            }
          }
        });
      };
      return new Promise(promiseFunc);
    };

    render();
  }
  createTodo(req, res) {
    const tomodel = {};
    let sql = `
    INSERT INTO todos
    SET text='${req.body.data[0].text}', done=${req.body.data[0].done}
`;
    const render = () => {
      const promiseFunc = (resolve, reject) => {
        this._todo.createTodo(sql, tomodel, (err, rows) => {
          if (err) throw err;
          this._data.result = rows;
          res.send(JSON.stringify(this._data.result));
          if (req.body.data[1].parents.length !== 0) {
            const parentsIdArr = req.body.data[1].parents.split`,`.map(x => +x);
            for (let i = 0; i < parentsIdArr.length; i++) {
              let sql = `
                INSERT INTO todos_relationships(todo_id, parent_id)
                VALUES(${rows.insertId}, ${parentsIdArr[i]});
                `;
              this._todo.createTodo(sql, tomodel, (err, rows) => {
                if (err) throw err;
              });
            }
          }
        });
      };
      return new Promise(promiseFunc);
    };

    render();
  }
  uploadFile(req, res) {
    const filePath = __basedir + "/uploads/" + req.file.filename;
    const render = () => {
      const promiseFunc = (resolve, reject) => {
        this._todo.uploadFile(filePath, (err, rows) => {
          if (err) throw err;
          res.json({
            msg: "File uploaded/import successfully!",
            file: req.file
          });
        });
      };
      return new Promise(promiseFunc);
    };

    render();
  }
  deleteTodo(req, res) {
    const { id } = req.params;

    const render = () => {
      const promiseFunc = (resolve, reject) => {
        this._todo.deleteTodo(id, (err, rows) => {
          if (err) throw err;

          this._data.result = rows;

          res.send(JSON.stringify(this._data.result));
        });
      };
      return new Promise(promiseFunc);
    };

    render();
  }
  deleteChildren(req, res) {
    const { id } = req.params;

    const render = () => {
      const promiseFunc = (resolve, reject) => {
        this._todo.deleteChildren(id, (err, rows) => {
          if (err) throw err;

          this._data.result = rows;

          res.send(JSON.stringify(this._data.result));
        });
      };
      return new Promise(promiseFunc);
    };

    render();
  }
  deleteParent(req, res) {
    const { id } = req.params;
    const render = () => {
      const promiseFunc = (resolve, reject) => {
        this._todo.deleteParent(id, (err, rows) => {
          if (err) throw err;

          this._data.result = rows;

          res.send(JSON.stringify(this._data.result));
        });
      };
      return new Promise(promiseFunc);
    };

    render();
  }
}

module.exports = new TodoController();
