import React, { useState, useEffect } from "react";
import TodoItem from "./TodoItem";
import { Table } from "semantic-ui-react";

const TodoList = ({
  todos,
  relationship,
  handleToggle,
  handleEdit,
  handleRemove
}) => {
  const [editMode, setEditMode] = useState(false);
  const [focus, setFocus] = useState(null);

  useEffect(() => {
    console.log("TodoList 렌더링");
  });

  if (todos.todos.length === 0)
    return (
      <div className="todo-list">
        <div className="no-data">표시할 TODO 아이템이 없습니다.</div>
      </div>
    );
  return (
    <Table stackable>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Status</Table.HeaderCell>
          <Table.HeaderCell width={6}>Text</Table.HeaderCell>
          <Table.HeaderCell>Date</Table.HeaderCell>
          <Table.HeaderCell width={3} textAlign="right"></Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {todos.todos.map(todo => (
          <TodoItem
            key={todo.todo_id}
            todos={todos}
            item={todo}
            editMode={editMode}
            setEditMode={setEditMode}
            focus={focus}
            setFocus={setFocus}
            relationship={relationship}
            handleToggle={handleToggle}
            handleEdit={handleEdit}
            handleRemove={handleRemove}
          />
        ))}
      </Table.Body>
    </Table>
  );
};

export default TodoList;
