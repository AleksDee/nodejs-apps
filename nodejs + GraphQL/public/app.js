new Vue({
  el: "#app",
  data() {
    return {
      isDark: true,
      show: true,
      todoTitle: "",
      todos: []
    };
  },
  created() {
    const query = `
      query {
        getTodos {
          id title done createdAt updatedAt
        }
      }
    `;

    fetch("/graphql", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({ query: query })
        .then(res => res.json())
        .then(response => {
          this.todos = response.data.getTodos;
        })
    });
  },

  methods: {
    completeTodo(id) {
      const query = `
        mutation {
          completeTodo(id: "${id}") {
            updatedAt
          }
        }
      `;
      fetch("/graphql", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({ query })
      })
        .then(res => res.json())
        .then(response => {
          const idx = this.todos.findIndex(t => t.id === id);
          this.todos[idx].updatedAt = response.data.completeTodo.updatedAt;
        })
        .catch(e => console.log(e));
    },
    addTodo() {
      const title = this.todoTitle.trim();
      if (!title) {
        return;
      }
      const query = `
        mutation {
          createTodo(todo: {title: "${title}"}) {
            id title done cratedAt updatedAt
          }
        }
      `;
      fetch("/graphql", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({ title })
      })
        .then(res => res.json())
        .then(response => {
          const todo = response.data.createTodo;
          this.todos.push(todo);
          this.todoTitle = "";
        })
        .catch(e => console.log(e));
      // this.todos.push({
      //   title: title,
      //   id: Math.random(),
      //   done: false,
      //   date: new Date()
      // });
      this.todoTitle = "";
    },
    removeTodo(id) {
      const query = `
        mutation {
          deleteTodo(id: "${id}")
        }
      `;
      fetch("/graphql" + id, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({ query })
      })
        .then(() => {
          this.todos = this.todos.filter(t => t.id !== id);
        })
        .catch(e => console.log(e));
    }
  },
  filters: {
    capitalize(value) {
      return (
        value
          .toString()
          .charAt(0)
          .toUpperCase() + value.slice(1)
      );
    },
    date(value) {
      return new Intl.DateTimeFormat("ru-RU", {
        year: "numeric",
        month: "long",
        day: "2-digit"
      }).format(new Date(value));
    }
  }
});
