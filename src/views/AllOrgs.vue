<template>
  <div id="all-orgs">
    <div class="ui container">
      <el-row>
        <el-col :span="24">
          <div class="ui dividing header">全部组织</div>
          <div class="ui statistic">
            <div class="label">组织总数</div>
            <div class="value">
              {{ tableData.length }}
            </div>
          </div>
          <el-table
            :data="tableData"
            style="width: 100%">
            <el-table-column
              label="编码"
              width="180">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.code }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="机构类型"
              width="180">
              <template slot-scope="scope">
                <i class="fa fa-star"></i>
                <span style="margin-left: 10px">{{ scope.row.org_type }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="级别"
              width="180">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.category_type }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="加入时间"
              width="180">
              <template slot-scope="scope">
                <i class="el-icon-time"></i>
                <span style="margin-left: 10px">{{ scope.row.add_time }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="名称"
              width="180">
              <template slot-scope="scope">
                <el-popover trigger="hover" placement="top">
                  <p>名称: {{ scope.row.name }}</p>
                  <p>级别: {{ scope.row.category_type }}</p>
                  <div slot="reference" class="name-wrapper">
                    <el-tag size="medium">{{ scope.row.name }}</el-tag>
                  </div>
                </el-popover>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import cookie from '../../static/js/cookie'
  import ElRow from "element-ui/packages/row/src/row";
  import axios from 'axios'
  import * as api from '../api/api'

  export default {
    components: {ElRow},
    name: 'all-orgs',
    data() {
      return {
        tableData: []
      }
    },
    methods: {
      handleEdit(index, row) {
        console.log(index, row);
      },
      handleDelete(index, row) {
        console.log(index, row);
      }
    },
    created() {
      // 验证登陆
      let token = cookie.getCookie('token')
      if (token) this.$store.commit('login')

      api.getOrgInfo().then(res => {
        this.tableData = res.data.orgs
      })
    }
  }
</script>

<style scoped>
  #all-orgs {
    padding-top: 25px;
  }
</style>
