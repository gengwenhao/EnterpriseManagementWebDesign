<template>
  <div id="app">
    <navbar></navbar>
    <router-view></router-view>
    <footer-common></footer-common>
  </div>
</template>

<script>
  import Navbar from './components/Navbar'
  import FooterCommon from './components/FooterCommon'
  import semantic from 'semantic'


  export default {
    components: {Navbar, FooterCommon},
    data() {
      return {
        defaultActive: 1
      }
    }
  }

</script>

<style>
  body {
    padding: 0;
    margin: 0;
  }

  .org-tree {
    float: left;
    width: 25%;
    height: 100%;
  }


</style>
