import React, { useState, useEffect } from "react";
import { Button, Form, Input, Radio } from "semantic-ui-react";
const TodoSearch = ({ getTodos, parameters, hadleParams, setIsShow }) => {
  const [isSlideDown, setIsSlideDown] = useState(false);
  const [isDate, setIsDate] = useState(false);
  const [params, setParams] = useState(parameters);

  const timezoneOffset = new Date().getTimezoneOffset() * 60000;
  const timezoneDate = new Date(Date.now() - timezoneOffset);
  const now = timezoneDate.toISOString().slice(0, 10);

  const handleChange = e => {
    let value = e.target.value;
    setParams(params => ({
      ...params,
      done: value
    }));
  };

  const handleDateSet = (e, idx) => {
    let target = e.target.value;

    setParams(params => ({
      ...params,
      date: params.date.map((item, index) => {
        if (index === idx) {
          return target;
        } else {
          return item;
        }
      })
    }));
  };

  const onSubmit = e => {
    e.preventDefault();
    setIsShow(true);
    if (params.keyword === "") {
      alert("검색어를 입력하세요.");
      return;
    }
    if (params.date === undefined) {
      setParams(params => ({
        ...params,
        date: ["", ""]
      }));
      hadleParams(params);
      getTodos(params);
    } else {
      setParams(params => ({
        ...params
      }));
      hadleParams(params);
      getTodos(params);
    }
    setParams(params => ({
      ...params,
      currentPage: 1
    }));
    hadleParams(params);
  };

  const handleKeyPress = e => {
    if (e.key === "Enter") {
      onSubmit(e);
    }
  };

  useEffect(() => {
    if (params.date[0] !== "" && params.date[1] !== "") setIsDate(true);
  }, [params.date]);

  return (
    <Form onSubmit={onSubmit} style={{ marginTop: "30px" }}>
      <Form.Group widths="equal">
        <Form.Field>
          <div className="todo-date-search">
            <div
              className={isSlideDown ? "select-box active" : "select-box"}
              onClick={() => {
                if (!isSlideDown) {
                  setParams(params => ({
                    ...params,
                    date: [now, now]
                  }));
                } else {
                  setParams(params => ({
                    ...params,
                    date: ["", ""]
                  }));
                }
                setIsSlideDown(!isSlideDown);
              }}
            >
              <span>{isDate ? "기간입력" : "전체기간"}</span>
              <i className="fas fa-chevron-down"></i>
            </div>
            {isSlideDown && (
              <ul className="sub-select-box">
                <li
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setIsSlideDown(!isSlideDown);
                    setIsDate(false);
                    setParams(params => ({
                      ...params,
                      date: ["", ""]
                    }));
                  }}
                >
                  <span>전체기간</span>
                </li>
                <li>
                  <div id="date_enter" className="date_enter">
                    <div id="explain_period" className="tit">
                      기간 입력
                    </div>
                    <Form>
                      <Form.Group widths="equal">
                        <Form.Field width={5}>
                          <Input
                            className="date start"
                            type="date"
                            id="input_1"
                            maxLength="10"
                            value={params.date[0]}
                            onChange={e => {
                              handleDateSet(e, 0);
                            }}
                          />
                        </Form.Field>
                        <Form.Field width={5}>
                          <Input
                            className="date end"
                            type="date"
                            id="input_2"
                            maxLength="10"
                            value={params.date[1]}
                            onChange={e => {
                              handleDateSet(e, 1);
                            }}
                          />
                        </Form.Field>
                        <Form.Field width={2}>
                          <Button
                            className="btn-date-set"
                            type="button"
                            value="설정"
                            onClick={() => {
                              setIsSlideDown(false);
                              setIsDate(true);
                            }}
                          >
                            설정
                          </Button>
                        </Form.Field>
                      </Form.Group>
                    </Form>
                  </div>
                </li>
              </ul>
            )}
          </div>
        </Form.Field>
        <Form.Field>
          <div className="todo-done-search">
            <Radio
              label="전체"
              value=""
              id="radio-1"
              name="radio"
              onChange={handleChange}
              type="radio"
              checked={"" === params.done}
            />
            <Radio
              label="완료"
              value="1"
              id="radio-2"
              name="radio"
              type="radio"
              onChange={handleChange}
              checked={"1" === params.done}
            />
            <Radio
              label="미완료"
              value="0"
              id="radio-3"
              name="radio"
              type="radio"
              onChange={handleChange}
              checked={"0" === params.done}
            />
          </div>
        </Form.Field>
        <Form.Field>
          <div className="todo-keyword-search">
            <input
              type="text"
              name="keyword"
              placeholder="검색어를 입력하세요."
              onChange={({ target: { value } }) => {
                setParams(params => ({
                  ...params,
                  keyword: value
                }));
              }}
              value={params.keyword}
              onKeyPress={handleKeyPress}
            />
          </div>
        </Form.Field>
        <Button type="submit">Submit</Button>
      </Form.Group>
    </Form>
  );
};

export default TodoSearch;
