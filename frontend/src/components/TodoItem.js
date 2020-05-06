import React, { useState, useRef, useEffect } from "react";
import { Button, Icon, Label, Table } from "semantic-ui-react";
const TodoItem = ({
  item,
  editMode,
  setEditMode,
  focus,
  setFocus,
  relationship,
  handleToggle,
  handleEdit,
  handleRemove
}) => {
  const textRef = useRef(null);
  const [todo, setTodo] = useState(item);
  const [value, setValue] = useState(todo.text);
  const [isEditing, setIsEditing] = useState(false);
  const [selected, setSelected] = useState(false);
  const [parents, setParents] = useState(null);
  const [removeParents, setRemoveParents] = useState([]);
  useEffect(() => {
    console.log("TodoItem 렌더링");
  });
  useEffect(() => {
    setParents(
      relationship
        .filter(item => {
          return item.todo_id === todo.todo_id;
        })
        .map(item => item.parent_id)
        .sort((a, b) => a - b)
    );
  }, [relationship]);

  const toggleEdit = (e, id) => {
    e.stopPropagation();
    setSelected(id);
    setEditMode(!editMode);
    setIsEditing(!isEditing);

    if (!isEditing) {
      textRef.current.focus();
      setFocus(textRef.current);
    } else {
      handleEdit(todo.todo_id, value, removeParents);
      setSelected(false);
    }
  };

  const onChange = e => {
    if (isEditing) setValue(e.target.value);
  };

  const handleRemoveRef = parent_id => {
    setParents(parents.filter(parent => parent !== parent_id));
    setRemoveParents([...removeParents, parent_id]);
  };

  return (
    <Table.Row
      className={todo.done ? "todo-item on" : "todo-item"}
      style={{ cursor: "pointer" }}
      onClick={() => {
        if (editMode) {
          //나 자신
          if (selected === todo.todo_id) {
            focus.focus();
          } else {
            alert("먼저 수정 모드를 완료해주세요.");
            focus.focus();
            return;
          }
          // 다른것들
        } else {
          handleToggle(todo.todo_id)
            .then(todo => {
              setTodo(todo[0]);
            })
            .catch(error => {
              return;
            });
        }
      }}
    >
      <Table.Cell>
        <Icon name="check" color="blue" size="large" />
      </Table.Cell>
      <Table.Cell>
        <p>id:{todo.todo_id}</p>
        <p>
          <input
            ref={textRef}
            className={isEditing ? "editing" : ""}
            value={value}
            onChange={onChange}
          />
        </p>

        {parents && (
          <div className="todo-parents-list">
            {parents.map(parent_id => {
              return (
                <Label image key={parent_id} color="blue">
                  @{parent_id}{" "}
                  {isEditing ? (
                    <Icon
                      name="delete"
                      onClick={e => {
                        e.stopPropagation();
                        handleRemoveRef(parent_id);
                        textRef.current.focus();
                      }}
                    />
                  ) : (
                    ""
                  )}
                </Label>
              );
            })}
          </div>
        )}
      </Table.Cell>
      <Table.Cell>
        <p>createdAt: {todo.created_at}</p>
        <p>updatedAt: {todo.updated_at}</p>
      </Table.Cell>
      <Table.Cell textAlign="right">
        <div
          className={
            editMode && selected === todo.todo_id
              ? "todo-btn-group hold"
              : editMode
              ? "todo-btn-group hide"
              : "todo-btn-group"
          }
        >
          <Button.Group
            widths="5"
            style={{ minWidth: "120px", margin: "2px 0" }}
          >
            <Button
              primary
              onClick={e => {
                toggleEdit(e, todo.todo_id);
              }}
            >
              {!isEditing ? "EDIT" : "COMPLETE"}
            </Button>
          </Button.Group>
          <Button.Group
            widths="5"
            style={{ minWidth: "120px", margin: "2px 0" }}
          >
            <Button
              secondary
              onClick={e => {
                e.stopPropagation();
                setEditMode(false);
                handleRemove(todo.todo_id);
                // setTodo([]);
              }}
            >
              DELETE
            </Button>
          </Button.Group>
        </div>
      </Table.Cell>
    </Table.Row>
  );
};

export default TodoItem;
