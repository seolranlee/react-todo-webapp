import React, { useState, useEffect } from "react";

import TodoHead from "./components/TodoHead";
import TodoCreate from "./components/TodoCreate";
import TodoList from "./components/TodoList";
import TodoPagination from "./components/TodoPagination";
import TodoSearch from "./components/TodoSearch";

import * as API from "./util/TodoAPI";

import "./style.scss";
import { Container } from "semantic-ui-react";
const App = () => {
  // data
  const [todos, setTodos] = useState(null);
  const [relationship, setRelationship] = useState(null);

  //search
  //params
  const [params, setParams] = useState({
    done: "",
    keyword: "",
    date: ["", ""],
    order: "",
    currentPage: 1
  });

  const [isShow, setIsShow] = useState(false);
  const [error, setError] = useState(false);

  // READ
  const getTodos = async params => {
    try {
      let response;
      response = await API.fetchTodos(params);
      setTodos(response.data);
    } catch (e) {
      setError(e);
    }
  };

  const getRelationship = async () => {
    let response;
    try {
      response = await API.fetchRelationship();
      setRelationship(response.data);
    } catch (e) {
      setError(e);
    }
  };

  // CREATE
  const handleCreate = async (text, parents) => {
    const newTodo = {
      text,
      done: 0
    };
    const response = await API.createTodo(newTodo, parents.sort().toString());
    if (response.error === undefined) {
      if (parents.length !== 0) getRelationship();
      getTodos(params);
      // 참조값 초기화
    }
  };

  //UPLOAD
  const handleUpload = file => {
    API.uploadFile(file)
      .then(() => {
        getRelationship();
        getTodos(params);
        window.location.reload();
      })
      .catch(error => {
        console.log(error);
      });
  };

  // UPDATE
  const handleEdit = async (id, text, remove) => {
    const index = todos.todos.findIndex(todo => todo.todo_id === id);
    const selected = todos.todos[index];
    let response = null;
    response = await API.editTodo(
      id,
      {
        ...selected,
        text
      },
      remove
    );
    if (response.error === undefined) {
      if (remove.length !== 0) getRelationship();
      // getTodos(params);
      API.getTodo(id);
    }
  };
  const handleToggle = async id => {
    const index = todos.todos.findIndex(todo => todo.todo_id === id);
    const selected = todos.todos[index];
    const relations = await API.todoRelationCheck(id);

    let response = null;
    let errMsg = "";
    let todo;

    // 대전제: 아무 아이템과 관계맺지 않은 경우.
    if (relations.length === 0) {
      response = await API.toggleDone(id, {
        done: (selected.done ^= 1)
      });

      //대전제1. 참조 당일거나, 참조 하거나 하는 무언가가 있는 경우.
      //어떤 관계라도 존재하는 경우.
    } else {
      let isReferencedArr = [];
      let isReferringArr = [];
      let isDoneReferring = [];
      let isUndoneRefferring = [];

      relations.forEach(ref => {
        // 참조 하는 todo가 있는 경우
        if (ref.referring_done !== null) {
          isReferringArr.push(ref);
          if (ref.referring_done === 1) {
            isDoneReferring.push(ref);
          } else {
            isUndoneRefferring.push(ref.referring_text);
          }
        }
        // 참조 당하고 있는 todo가 있는 경우 & 걔가 완료상태인 경우>체크해제 안됨
        if (ref.referenced_done === 1) {
          isReferencedArr.push(ref.referenced_text);
        }
      });

      // 참조당하고 있는데 걔네가 완료상태임.
      if (isReferencedArr.length !== 0) {
        errMsg =
          "참조된 " +
          isReferencedArr.toString() +
          "가 완료상태입니다. 이를 먼저 해지해주세요.";
        alert(errMsg);
        return;
      }

      // 참조하고 있는 아이템들이 모두 완료된 상태임>토글 가능
      if (isReferringArr.length === isDoneReferring.length) {
        response = await API.toggleDone(id, {
          ...selected,
          done: (selected.done ^= 1)
        });
      } else {
        errMsg =
          "참조하고 있는 " +
          isUndoneRefferring.toString() +
          "가 완료된 상태가 아닙니다. 이를 먼저 완료해주세요.";
        alert(errMsg);
        return;
      }
    }

    // 코드수정
    // if (response.error === undefined) {
    //   // 화면상에서 토글시키는 기능을 추가하면 전체 투두를 불러올필요는 없을듯.
    //   API.getTodo(id);
    // }

    if (response.error === undefined) {
      todo = API.getTodo(id);
      return todo;
    }
  };

  // DELETE
  const handleRemove = async id => {
    const relations = await API.todoRelationCheck(id);
    let response;
    let subResponse;
    // 아무 관계도 없는 경우
    if (relations.length === 0) {
      let response = await API.deleteTodo(id);
      if (response.error === undefined) {
        getTodos(params);
        // API.getTodo(id);
      }
    } else {
      //어떠한 관계가 형성된 경우
      let referringArr = [];
      let referencedArr = [];

      relations.forEach(ref => {
        if (ref.referring_id !== null) referringArr.push(ref);
        if (ref.referenced_id !== null) referencedArr.push(ref);
      });

      // 참조된 todo(피참조된 todo) // 예시: todo1,todo3
      if (referencedArr.length !== 0) {
        let referencedTextArr = [];
        referencedArr.forEach(ref => {
          referencedTextArr.push(ref.referenced_text);
        });
        if (
          window.confirm(
            `${referencedTextArr.toString()} 가 해당 TODO를 참조하고있습니다. 삭제하실려면 확인, 아니면 취소를 눌러주세요.`
          )
        ) {
          response = await API.deleteTodo(id);
          if (response.error === undefined)
            subResponse = await API.deleteParent(id);
          if (subResponse.error === undefined) {
            getRelationship();
            getTodos(params);
          }
        }
      }

      // 참조하고 있는 todo // todo4
      if (referringArr.length !== 0) {
        response = await API.deleteTodo(id);
        if (response.error === undefined)
          subResponse = await API.deleteChildren(id);
        if (subResponse.error === undefined) {
          getRelationship();
          getTodos(params);
        }
      }
      return false;
    }
  };

  useEffect(() => {
    getTodos(params);
  }, [params.currentPage, params.order]);

  useEffect(() => {
    getRelationship();
  }, []);

  if (error) return <div class="error">에러가 발생했습니다</div>;

  return (
    <div className="todo-app">
      {todos && relationship && (
        <Container style={{ width: "800px" }}>
          <TodoHead
            todos={todos}
            getTodos={getTodos}
            params={params}
            setParams={setParams}
            handleUpload={handleUpload}
            isShow={isShow}
          />
          <TodoCreate handleCreate={handleCreate} />
          <TodoList
            todos={todos}
            relationship={relationship}
            handleToggle={handleToggle}
            handleEdit={handleEdit}
            handleRemove={handleRemove}
          />
          <Container style={{ padding: "15px 0", width: "800px" }}>
            <TodoPagination todos={todos} setParams={setParams} />
            <TodoSearch
              getTodos={getTodos}
              parameters={params}
              hadleParams={setParams}
              setIsShow={setIsShow}
            />
          </Container>
        </Container>
      )}
    </div>
  );
};

export default App;
