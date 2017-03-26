<template lang="html">
<div class="page">
  <section class="todoapp">
    <header class="header">
      <h1>todos</h1>
      <input class="new-todo" placeholder="What needs to be done?" autofocus
             v-model="title" @keydown.enter="insert" ref="input">
    </header>
    <section class="main" v-show="items.length">
      <input id="toggle-all" class="toggle-all" type="checkbox" @change="toggle">
      <label for="toggle-all">Mark all as complete</label>
      <ul class="todo-list">
        <li v-for="item in items" class="todo"
            :key="item.id" :class="{ completed: item.completed, editing: editing === item.id }">
          <div class="view">
            <input class="toggle" type="checkbox" :checked="item.completed" @change="complete(item.id)">
            <label @dblclick="edit(item.id)">{{ item.title }}</label>
            <button class="destroy" @click="remove(item.id)"/>
          </div>
          <input type="text" class="edit" :id="`editor-${item.id}`"
                 v-model="item.title"
                 @keypress.enter="editing = -1" autofocus
                 @blur="editing = -1">
        </li>
      </ul>
      <footer class="footer">
        <span class="todo-count">{{ items.length }}</span>
        <ul class="filters">
          <li>
            <router-link :to="{ name: 'home'}" :class="{ selected: !type }">All</router-link>
          </li>
          <li>
            <router-link :to="{ name: 'home', params: { type: 'active' } }"
                         :class="{ selected: type === 'active' }">
              Active
            </router-link>
          </li>
          <li>
            <router-link :to="{ name: 'home', params: { type: 'completed' } }"
                         :class="{ selected: type === 'completed' }">
              Completed
            </router-link>
          </li>
        </ul>
        <button class="clear-completed" @click="clear">Clear completed</button>
      </footer>
    </section>
  </section>
  <footer class="info">
    <p>Double-click to edit a todo</p>
    <p>Written by <a href="http://znck.me">Rahul Kadyan</a></p>
    <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
  </footer>
</div>
</template>

<script lang="babel">
const TODO_STORAGE_KEY = '__TODO_STORAGE_KEY_xklajaoiads__'

const store = {
  get () {
    return JSON.parse(localStorage.getItem(TODO_STORAGE_KEY) || '[]')
  },

  set (items) {
    localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(items))
  }
}

export default {
  name: 'ToDo',

  props: {
    type: {
      type: String
    }
  },

  data () {
    return {
      title: '',
      editing: -1,
      _items: this.$isServer ? [] : store.get(),
    }
  },

  computed: {
    items () {
      const type = this.type
      const items = this.$data._items

      if (type === 'active') {
        return items.filter(item => !item.completed)
      } else if (type === 'completed') {
        return items.filter(item => item.completed)
      }

      return items
    }
  },

  methods: {
    edit (id) {
      this.editing = id

      this.$nextTick(() => this.$el.querySelector(`#editor-${id}`).focus())
    },
    insert () {
      this.$data._items.push({
        id: Date.now(),
        title: this.title,
        completed: false
      })

      this.title = ''
    },

    remove (id) {
      const index = this.$data._items.findIndex(item => item.id === id)

      if (index > -1) {
        this.$data._items.splice(index, 1)
      }
    },

    complete (id) {
      const item = this.$data._items.find(item => item.id === id)

      if (item) {
        item.completed = !item.completed
      }
    },

    clear () {
      const completed = this.$data._items.filter(item => item.completed)

      completed.forEach(item => this.remove(item.id))
    },

    toggle (e) {
      this.$data._items.forEach(item => {
        item.completed = e.target.checked
      })
    }
  },

  watch: {
    '$data._items': {
      deep: true,
      handler: (items) => store.set(items)
    }
  }
}
</script>

<style lang="scss">
@import "../../node_modules/todomvc-app-css/index";
</style>