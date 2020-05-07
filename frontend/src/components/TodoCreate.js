import React, { useState, useEffect } from "react";
import * as API from "../util/TodoAPI";
import { Button, Label, Form, Input } from "semantic-ui-react";
const TodoCreate = ({ handleCreate }) => {
  useEffect(() => {
    // console.log("TodoCreate 렌더링");
  });
  const [value, setValue] = useState("");
  const [parents, setParents] = useState([]);
  const [parentValue, setParentValue] = useState("");

  const onSubmit = e => {
    e.preventDefault();
    if (value === "") {
      alert("할 일을 입력해주세요.");
    } else {
      handleCreate(value, parents);
    }
    setValue("");
    setParents([]);
    setParentValue("");
  };

  const addParents = async e => {
    e.preventDefault();
    // 전체적인 코드 수정

    if (parentValue === "") alert("참조하려는 todo id의 값을 입력해주세요.");
    else {
      const response = await API.getTodo(parentValue);
      if (response.length === 0) {
        alert("참조하려는 todo id가 존재하지 않는 id입니다.");
      } else if (parents.includes(parentValue))
        alert("이미 추가한 todo id입니다.");
      else setParents([...parents, parentValue]);
    }
    setParentValue("");
  };

  const handleKeyPress = e => {
    if (e.key === "Enter") {
      onSubmit(e);
    }
  };

  return (
    <div className="todo-create">
      <Form onSubmit={onSubmit} style={{ marginBottom: "30px" }}>
        <Form.Field>
          <label>Add todo Item</label>
          <input
            placeholder="Add todo Item"
            value={value}
            onChange={({ target: { value } }) => setValue(value)}
            onKeyPress={handleKeyPress}
          />
        </Form.Field>
        <Form.Field>
          <div className="ref-todo-list">
            {parents
              .sort((a, b) => a - b)
              .map(parent => {
                return (
                  <Label image key={parent} color="blue">
                    @{parent}{" "}
                  </Label>
                );
              })}
          </div>
          <label>참조 ID(한개 씩 추가)</label>
          <Input type="text" placeholder="Search..." action>
            <input
              placeholder="참조 ID(한개 씩 추가)"
              type="number"
              min="1"
              value={parentValue}
              onChange={({ target: { value } }) => setParentValue(value)}
            />
            <Button onClick={addParents}>참조 ID(한개 씩 추가)</Button>
          </Input>
        </Form.Field>
        <Button type="submit">Todo Item 추가</Button>
      </Form>
    </div>
  );
};

export default TodoCreate;
