<template>
  <div id="index">
    <el-main>
      <el-row>
        <el-col :span="24">
          <h5 id="title">
            <router-link :to="{path: '/'}"><i class="fa fa-home"></i>主页</router-link>
          </h5>
        </el-col>
      </el-row>
      <el-row class="info-groups">
        <el-col :span="6" class="info-parent">
          <div class="ui segment info">
            <h3 class="info-title">用户总数</h3>
            <div class="info-content" id="user-count">{{ all_users_count }}</div>
            <small class="info-footer">All users</small>
          </div>
        </el-col>
        <el-col :span="6" class="info-parent">
          <div class="ui segment info">
            <h3 class="info-title">今日新用户</h3>
            <div class="info-content">{{ new_user_count_today }}</div>
            <small class="info-footer">NEW users</small>
          </div>
        </el-col>
        <el-col :span="6" class="info-parent">
          <div class="ui segment info">
            <h3 class="info-title">组织总数</h3>
            <div class="info-content" id="org-count">{{ all_orgs_count }}</div>
            <small class="info-footer">All orgs</small>
          </div>
        </el-col>
        <el-col :span="6" class="info-parent">
          <div class="ui segment info">
            <h3 class="info-title">本月新加入组织</h3>
            <div class="info-content">{{ all_orgs_count_month }}</div>
            <small class="info-footer">New orgs</small>
          </div>
        </el-col>
      </el-row>
      <el-row class="message-box">
        <el-col :span="8">
          <div class="content-box">
            <h3 class="title"><i class="fa fa-paper-plane-o"></i>最近活跃用户</h3>
            <div v-if="recent_users.length != 0" class="ui segment">
              <div v-for="user in recent_users" class="ui image label">
                {{ user.username }}
              </div>
            </div>
            <div v-else="recent_users.length != 0" class="ui segment">
              暂无..
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="content-box">
            <h3 class="title"><i class="fa fa-pie-chart"></i>人数统计</h3>
            <div class="content-body">
              <ve-pie :data="chartData" :settings="chartSettings"></ve-pie>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="content-box">
            <h3 class="title"><i class="fa fa-user-plus"></i>我的留言</h3>
            <div class="content" v-for="(msg, index) in user_message.results">
              <el-col :span="12">
                <div class="ui card">
                  <div class="content">
                    <div class="header">{{ msg.time.date }}</div>
                  </div>
                  <div class="content">
                    <h4 class="ui sub header">{{ msg.time.time }}</h4>
                    <div class="ui small feed">
                      {{ msg.content | slinceMsg }}
                    </div>
                  </div>
                  <div class="extra content">
                    <button @click="openMsgDetailPanel(index)" class="ui animated inverted blue small button">
                      <div class="visible content">查看详情</div>
                      <div class="hidden content">
                        <i class="right arrow icon"></i>
                      </div>
                    </button>
                  </div>
                </div>
              </el-col>
            </div>
            <el-col id="id-msg-pagination" :span="18">
              <el-pagination
                id="pagination"
                @current-change="pageChange"
                small
                background layout="prev, pager, next"
                :page-size="4"
                :total="msg_count"
              >
              </el-pagination>
            </el-col>
            <el-col :span="6">
              <button v-if="isLogin" @click="showAddMsgModal" id="id-add-msg-btn"
                      class="ui animated fade button small inverted blue">
                <div class="visible content">添加留言</div>
                <div class="hidden content">
                  Add
                </div>
              </button>
            </el-col>
          </div>
        </el-col>
      </el-row>
    </el-main>
  </div>
</template>

<script>
  import ElRow from "element-ui/packages/row/src/row"
  import cookie from '../../static/js/cookie'
  import * as api from '../api/api'

  export default {
    components: {ElRow},
    name: 'index',
    data() {
      return {
        msg_count: 0,
        all_users_count: 0,
        new_user_count_today: 0,
        all_orgs_count: 0,
        all_orgs_count_month: 0,
        user_message: {},
        recent_users: []
      }
    },
    computed: {
      isLogin() {
        return this.$store.state.isLogin
      }
    },
    filters: {
      slinceMsg(str) {
        return (str && str.length > 8) ?
          str.substring(0, 8) + '...' :
          str.substring(0, 8)
      }
    },
    methods: {
      // 弹出添加留言模态框
      showAddMsgModal() {
        this.$prompt('请输入留言内容', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({value}) => {
          if (value) {
            api.postUserMsg(value).then(res => {
              this.$message(`添加留言成功: ${value}`)
              this.getMsg()
            }, err => {
              this.$message('发送失败')
            })
          } else {
            this.$message('请输入留言内容')
          }
        })
      },
      // 留言详情面板
      openMsgDetailPanel(index) {
        if (index > this.user_message.results.length) return
        this.$alert(this.user_message.results[index].content,
          this.user_message.results[index].name)
      },
      // 分页
      pageChange(page) {
        api.getUserMsg(page)
          .then(res => {
            this.user_message = res.data
          }, err => {
            console.log('获取用户留言失败', err)
          })
      },
      // 设置图表
      setChart(res) {
        this.chartData = {
          columns: ['组织', '人数'],
          rows: res.data.org_users_count
        }
        this.all_users_count = res.data.all_users_count
        this.new_user_count_today = res.data.new_user_count_today
        this.all_orgs_count = res.data.all_orgs_count
        this.all_orgs_count_month = res.data.all_orgs_count_month
        this.recent_users = res.data.recent_users
        this.chartSettings = {
          dimension: '组织',
          metrics: '人数'
        }
      },
      // 获取用户留言
      getMsg() {
        api.getUserMsg(1)
          .then(res => {
            this.user_message = res.data
            this.msg_count = res.data.count
          }, err => {
            this.$message('获取用户留言失败', err)
          })
      },
      // 获取用户信息
      getUserInfo() {
        api.getUserInfo()
          .then(res => {
            this.setChart(res)
          })
          .catch(err => {
            console.log(err)
          })
      }
    },
    created() {
      // 验证登陆
      let token = cookie.getCookie('token')
      if (token) this.$store.commit('login')

      // 网络请求数据
      this.getUserInfo()
      this.getMsg()
    }
  }
</script>

<style scoped>
  #id-msg-pagination {
    margin-top: 20px;
  }

  #id-add-msg-btn {
    margin-top: 12px;
  }

  #title {
    text-align: left;
    text-indent: 14px;
  }

  #title > a {
    color: #2e2e2e;
  }

  .info {
    padding-left: 20px;
    margin: 24px 12px;
  }

  .info > h3.info-title {
    text-align: left;
    font-size: 14px;
    color: grey;
  }

  .info .info-content {
    color: #409eff;
    font-size: 35px;
    font-weight: 100;
  }

  .info .info-footer {
    font-size: 12px;
    display: block;
    text-align: left;
    color: rgba(1, 1, 1, .3);
    padding-top: 12px;
  }

  .info-title::after {
    display: inline-block;
    height: 2px;
    width: 150px;
  }

  .info-parent {
    margin: 24px 0;
  }

  /*.info-parent:hover {*/
  /*box-shadow: 0 1px 1px 25px rgba(1, 1, 1, .07);*/
  /*}*/

  #user-count, #org-count {
    color: #c10008;
  }

  .message-box {
    margin-top: 22px;
  }

  .echarts {
    height: 300px;
  }

  .ui.image.label {
    margin-bottom: 6px;
  }

</style>
