import React from "react";
import _ from "lodash";
import { Menu, Container } from "semantic-ui-react";

const TodoPagination = ({ todos, setParams }) => {
  const pages = _.range(todos.pnStart, todos.pnEnd + 1);

  const onChangePage = idx => {
    setParams(params => ({
      ...params,
      currentPage: idx
    }));
  };

  if (todos.todos.length === 0) return <div className="pagination"></div>;
  return (
    <Container textAlign="center">
      <Menu pagination className="todo-pagination">
        <Menu.Item
          type="prevItem"
          className={todos.page === 1 ? "disabled item" : "item"}
          onClick={() => onChangePage(todos.page - 1)}
        >
          ⟨
        </Menu.Item>
        {pages.map((page, idx) => (
          <Menu.Item
            key={idx}
            name={page.toString()}
            active={todos.page === page}
            onClick={() => onChangePage(page)}
          />
        ))}
        <Menu.Item
          type="nextItem"
          className={todos.page === todos.pnTotal ? "disabled item" : "item"}
          onClick={() => onChangePage(todos.page + 1)}
        >
          ⟩
        </Menu.Item>
      </Menu>
    </Container>
  );
};

export default TodoPagination;
