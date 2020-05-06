import React, { useState, useRef, useEffect } from "react";
import { Button, Icon } from "semantic-ui-react";
const TodoHead = ({ todos, params, setParams, handleUpload, isShow }) => {
  const [file, setFile] = useState({});
  const fileRef = useRef(null);
  const onChange = e => {
    setFile(e.target.files[0]);
    fileRef.current.value = e.target.files[0].name;
  };
  useEffect(() => {
    // console.log("TodoHead 렌더링");
  });

  const onSubmit = e => {
    e.preventDefault();
    handleUpload(file);
  };

  const handleClick = e => {
    e.preventDefault();
    let value = e.target.value;
    setParams(params => ({
      ...params,
      order: value
    }));
  };

  return (
    <div className="todo-head">
      <h1
        style={{
          cursor: "pointer"
        }}
        onClick={() => {
          window.location.reload();
        }}
      >
        TODO WebApp
      </h1>
      <div className="btn-holder">
        <div className="btn-file-group">
          <div className="upload">
            <form onSubmit={onSubmit}>
              <div className="file_input">
                <label>
                  {/* <i className="fas fa-paperclip"></i> */}
                  <Icon name="file" />
                  <input type="file" onChange={onChange} />
                </label>
                <input ref={fileRef} type="text" readOnly title="File Route" />
                <Button
                  primary
                  type="submit"
                  style={{
                    borderTopLeftRadius: "0",
                    borderBottomLeftRadius: "0"
                  }}
                >
                  업로드
                </Button>
              </div>
            </form>
          </div>
          <div className="download">
            <Button secondary>다운로드</Button>
          </div>
        </div>
        {isShow && todos.todos.length !== 0 && (
          <div className="btn-filter-group">
            <Button
              primary
              value="createdAt"
              onClick={handleClick}
              className={params.order === "createdAt" ? "active" : ""}
            >
              생성일순
            </Button>
            <Button
              secondary
              value="updatedAt"
              onClick={handleClick}
              className={params.order === "updatedAt" ? "active" : ""}
            >
              최근수정순
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoHead;
