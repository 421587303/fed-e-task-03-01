<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <div style="text-align: center;">
      <router-link class="link" to="/">welcome</router-link>
      <router-link class="link" to="/home">home</router-link>
      <router-link class="link" to="/about">about</router-link>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'App',
  }
</script>

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }

  .link {
    margin: 0 6px;
  }
</style>
