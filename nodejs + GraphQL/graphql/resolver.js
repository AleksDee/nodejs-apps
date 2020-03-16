const Todo = require("../models/todo");

const users = [
  { name: "Igor", age: 30, email: "igor@mail.ru" },
  { name: "Elena", age: 23, email: "elena@mail.ru" }
];

module.exports = {
  test() {
    return {
      count: Math.trunc(Math.random() * 10),
      users
    };
  },
  random({ min, max, count }) {
    const arr = [];
    for (let i = 0; i < count; i++) {
      const random = Math.random() * (max - min) + min;
      arr.push(random);
    }
    return arr;
  },

  addTestUser({ user: { name, email } }) {
    const user = {
      name: user.name,
      email: user.email,
      age: Math.ceil(Math.random() * 30)
    };
    users.push(user);
    return user;
  },

  async getTodos() {
    try {
      return await Todo.findAll();
    } catch (e) {
      console.log(e);
    }
  },

  async createTodo({ todo }) {
    try {
      return await Todo.create({
        title: todo.title,
        done: false
      });
    } catch (e) {
      throw new Error("title is required");
    }
  },

  async completeTodo({ id }) {
    try {
      const todo = await Todo.findByPk(id);
      todo.done = true;
      await todo.save();
      return todo;
    } catch (e) {
      console.log(e);
    }
  },

  async deleteTodo({ id }) {
    try {
      const todos = await Todo.findAll({
        where: { id }
      });
      await todos[0].destroy();
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
};
