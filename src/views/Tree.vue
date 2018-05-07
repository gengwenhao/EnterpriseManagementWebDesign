<template>
  <div id="tree">
    <el-row>
      <el-col :span="5">
        <el-tree id="tree-panel" :data="treeData" :props="defaultProps" accordion
                 @node-click="handleNodeClick"></el-tree>
      </el-col>
      <el-col :span="19">
        <h3>{{ curTitle }}<span @click="pageToAll" v-if="curTitle != '全部'" class="fa fa-history"></span></h3>
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="username" label="用户名" width="120"></el-table-column>
          <el-table-column prop="name" label="姓名" width="80"></el-table-column>
          <el-table-column prop="email" label="邮箱" width="80"></el-table-column>
          <el-table-column prop="gender" label="性别" width="80"></el-table-column>
          <el-table-column prop="date_joined" label="加入时间" width="150"></el-table-column>
          <el-table-column prop="last_login" label="上次登陆时间" width="120"></el-table-column>
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
</template>

<script>
  import cookie from '../../static/js/cookie'
  import * as api from '../api/api'

  export default {
    name: 'tree',
    data() {
      return {
        treeData: [],
        tableData: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        pageData: {},
        curTitle: '全部'
      };
    },
    methods: {
      pageToAll() {
        api.getOrgProfile().then(res => {
          this.treeData = res.data.results
        })

        this.pageChange(1)
        this.curTitle = '全部'
      },
      handleNodeClick(data) {
        api.getUserProfile({user_orgs: data.id}).then(res => {
          this.pageData = {
            count: res.data.count,
            results: res.data.results,
            next: res.data.next,
            previous: res.data.previous
          }

          this.tableData = res.data.results
        })

        this.curTitle = data.name
      },
      pageChange(page) {
        api.getUserProfile({page}).then(res => {
          this.pageData = {
            count: res.data.count,
            results: res.data.results,
            next: res.data.next,
            previous: res.data.previous
          }
          this.tableData = res.data.results
        })
      }
    },
    created() {
      // 验证登陆
      let token = cookie.getCookie('token')
      if (token) this.$store.commit('login')

      console.log('开始获取组织机构信息')
      api.getOrgProfile().then(res => {
        this.treeData = res.data.results
      })

      this.pageChange(1)
    }
  }
</script>

<style scoped>
  h3 {
    text-align: center;
  }

  #tree {
    padding-top: 25px;
  }

  #tree-panel {
    border-right: 2px solid #40adff;
    padding: 0 8px;
  }

  #pagination {
    margin: 12px 0;
  }

  span.fa.fa-history {
    cursor: pointer;
  }
</style>
