<template>
  <div id="app">
    <!--  <div class="nav flex justify-center p-10">
      <router-link class="px-4" to="/">Home</router-link>
      <router-link  class="px-4" to="/espana">España</router-link>
    </div> -->
    <router-view />
  </div>
</template>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

a {
  font-weight: bold;
  color: #2c3e50;
}

a.router-link-exact-active {
  color: #42b983;
}
</style>
