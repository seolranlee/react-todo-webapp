import axios from "axios";
// READ
export async function fetchTodos(params) {
  let response;
  try {
    if (params.keyword !== "") {
      // Axios 라이브러리는 Promise () 객체를 만듭니다
      response = await axios.get(
        `http://localhost:8080/todos?done=${params.done}&keyword=${
          params.keyword
        }&startdate=${params.date[0]}&enddate=${params.date[1]}&orderby=${
          params.order
        }&page=${params.currentPage}`
      );
    } else {
      response = await axios.get(
        `http://localhost:8080/todos?page=${params.currentPage}`
      );
    }
  } catch (error) {
    console.log(error);
  }
  return response;
}

export async function getTodo(id) {
  let response;
  await axios
    .get(`http://localhost:8080/todos/${id}`)
    .then(res => {
      response = res.data;
    })
    .catch(error => {
      console.log(error);
    });
  return response;
}

export async function fetchRelationship() {
  let response;
  try {
    response = await axios.get(`http://localhost:8080/todos/relationship`);
  } catch (error) {
    console.log(error);
  }
  return response;
}

// CREATE
export async function createTodo(newTodo, parents) {
  let payload = {
    data: [newTodo, { parents }]
  };
  let response;
  await axios
    .post(`http://localhost:8080/todos/new`, payload)
    .then(res => {
      response = res.data;
    })
    .catch(error => {
      console.log(error);
    });
  return response;
}

// UPLOAD
export async function uploadFile(file) {
  let response;
  const formData = new FormData();
  formData.append("file", file);
  const config = {
    headers: {
      "content-type": "multipart/form-data"
    }
  };
  await axios
    .post(`http://localhost:8080/todos/uploadfile`, formData, config)
    .then(res => {
      response = res.data;
    })
    .catch(error => {
      console.log(error);
    });
  return response;
}

// UPDATE
export async function editTodo(id, todo, remove) {
  let payload = {
    data: [todo, { remove: remove }]
  };
  let response;
  await axios
    .put(`http://localhost:8080/todos/${id}`, payload)
    .then(res => {
      response = res.data;
    })
    .catch(error => {
      console.log(error);
    });
  return response;
}

export async function todoRelationCheck(id) {
  let response;
  await axios
    .get(`http://localhost:8080/todos/${id}/relationship`)
    .then(res => {
      response = res.data;
    })
    .catch(error => {
      console.log(error);
    });
  return response;
}

export async function toggleDone(id, done) {
  let response;
  await axios
    .put(`http://localhost:8080/todos/${id}/done`, done)
    .then(res => {
      response = res.data;
    })
    .catch(error => {
      console.log(error);
    });
  return response;
}

// DELETE
export async function deleteTodo(id) {
  let response;
  await axios
    .delete(`http://localhost:8080/todos/${id}`)
    .then(res => {
      response = res.data;
    })
    .catch(error => {
      console.log(error);
    });
  return response;
}

export async function deleteChildren(id) {
  let response;
  await axios
    .delete(`http://localhost:8080/todos/relation/children/${id}`)
    .then(res => {
      response = res.data;
    })
    .catch(error => {
      console.log(error);
    });
  return response;
}

export async function deleteParent(id) {
  let response;
  await axios
    .delete(`http://localhost:8080/todos/relation/parent/${id}`)
    .then(res => {
      response = res.data;
    })
    .catch(error => {
      console.log(error);
    });
  return response;
}
