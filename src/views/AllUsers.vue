<template>
  <div id="all-users">
    <div class="ui container">
      <el-row>
        <el-col :span="24">
          <div class="ui dividing header">全部人员</div>
          <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="username" label="用户名" width="120"></el-table-column>
            <el-table-column prop="name" label="姓名" width="80"></el-table-column>
            <el-table-column prop="email" label="邮箱" width="240"></el-table-column>
            <el-table-column prop="gender" label="性别" width="80"></el-table-column>
            <el-table-column prop="date_joined" label="加入时间" width="175"></el-table-column>
            <el-table-column prop="last_login" label="上次登陆时间" width="175"></el-table-column>
            <el-table-column fixed="right" label="操作" width="250">
              <template slot-scope="scope">
                <div class="ui small buttons">
                  <button @click="handleClick(scope.row)" class="ui button grey">编辑</button>
                  <div class="or"></div>
                  <button class="ui button">删除</button>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            id="pagination"
            @current-change="pageChange"
            background layout="prev, pager, next"
            :total="pageData.count">
          </el-pagination>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    filters: {
      strfTime: function (value) {
        return value.split('.')[0].replace('T', ' ')
      }
    },
    name: 'all-users',
    data() {
      return {
        tableData: [],
        pageData: {}
      }
    },
    methods: {
      handleEdit(index, row) {
        console.log(index, row);
      },
      handleDelete(index, row) {
        console.log(index, row);
      },
      pageChange(page) {
        axios.get(`http://127.0.0.1:8000/user_profile/`, {params: {page: page}})
          .then(res => {
            this.pageData = {
              count: res.data.count,
              results: res.data.results,
              next: res.data.next,
              previous: res.data.previous
            }

            this.tableData = res.data.results
            this.tableData.forEach((item) => {
              item.date_joined = item.date_joined.split('.')[0].replace('T', ' ')
              item.last_login = item.last_login.split('.')[0].replace('T', ' ')
            })
          })
      }
    },
    created() {
      // 验证登陆
      let token = cookie.getCookie('token')
      if (token) this.$store.commit('login')

      axios.get('http://em.gengwenhao.com:8000/org_profile/')
        .then(res => {
          this.treeData = res.data.results
        })

      this.pageChange(1)
    }
  }
</script>

<style scoped>
  #all-users {
    padding-top: 25px;
  }
</style>
