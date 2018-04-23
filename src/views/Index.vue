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
            <h3 class="title"><i class="fa fa-paper-plane-o"></i>最近用户</h3>
            <div v-if="recent_users.length != 0" class="ui segment">
              <div v-for="(user, index) in recent_users" class="ui image label">
                {{ user.username }} <i :index="index" @click="removeUser(index)" class="delete icon"></i>
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
            <h3 class="title"><i class="fa fa-user-plus"></i>用户留言</h3>
            <div class="content-body">
              <div class="ui segment">
                <div class="ui comments">
                  <h3 class="ui dividing header">最近的用户</h3>
                  <div class="comment">
                    <div class="content" v-for="msg in user_message">
                      <a class="author">{{ msg.name }}: </a>
                      <div class="metadata">
                        <span class="date">{{ msg.time }}</span>
                      </div>
                      <div class="text">
                        <small>{{ msg.content }}</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-main>
  </div>
</template>

<script>
  import ElRow from "element-ui/packages/row/src/row";
  import Modal from '../components/Modal'

  export default {
    components: {ElRow, Modal},
    name: 'index',
    data() {
      return {
        all_users_count: 0,
        new_user_count_today: 0,
        all_orgs_count: 0,
        all_orgs_count_month: 0,
        user_message: [],
        recent_users: []
      }
    },
    methods: {
      // 删除用户
      removeUser(index) {
        delete this.recent_users.splice(index, 1)
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
        this.user_message = res.data.user_message
        this.recent_users = res.data.recent_users
        this.chartSettings = {
          dimension: '组织',
          metrics: '人数'
        }
      },
    },
    created() {
      // 网络请求数据
      this.$http.get('http://127.0.0.1:8000/api/userinfo/')
        .then(res => {
          this.setChart(res)
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
</script>

<style scoped>
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
