<template>
  <div id="org-tree">
    <el-tree :data="org_list" :props="defaultProps"></el-tree>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'org-tree',
    data() {
      return {
        org_list: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        }
      }
    },
    created() {
      axios.get('http://em.gengwenhao.com:8000/org_profile/')
        .then(res => {
          this.org_list = res.data.results
        })
    }
  }
</script>

<style scoped>
  #org-tree {
    padding: 12px;
    background-color: #44f7f8;
  }
</style>
