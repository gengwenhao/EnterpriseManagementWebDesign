<template>
  <div id="navbar">
    <el-header>
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-menu-item index="1">主页</el-menu-item>
        <el-submenu v-if="isLogin" index="2">
          <template slot="title">机构管理</template>
          <el-menu-item index="2-1">树形图</el-menu-item>
          <el-menu-item index="2-2">查看全部机构</el-menu-item>
          <el-menu-item index="2-3">管理人员</el-menu-item>
        </el-submenu>
        <el-menu-item v-if="isLogin" index="3"><a>个人信息管理</a></el-menu-item>
        <el-menu-item v-if="isLogin" index="4"><a>工具中心</a></el-menu-item>
        <div id="logout" v-if="isLogin">
          <div @click="showLogoutModal" class="ui button inverted blue small">注销登陆</div>
        </div>
        <div v-else="isLogin">
          <div id="userinfo">
            <div @click="showLoginModal" class="ui button inverted blue small">登陆获取更多功能</div>
          </div>
        </div>
      </el-menu>
      <div class="line"></div>
    </el-header>
    <div id="login-modal">
      <div id="login" class="ui base modal">
        <i class="close icon"></i>
        <div class="header">登陆</div>
        <div class="content">
          <div class="ui form">
            <h4 class="ui dividing header">请详细核对您的信息</h4>
            <div class="field">
              <label>用户名</label>
              <input v-model="userName" type="text" placeholder="用户名或邮箱">
            </div>
            <div class="field">
              <label>密码</label>
              <input v-model="userPwd" type="password" placeholder="用户名或邮箱">
            </div>
          </div>
        </div>
        <div class="actions">
          <div class="ui black deny button">
            取消
          </div>
          <div @click="login" class="ui positive right labeled icon button">
            登陆
            <i class="checkmark icon"></i>
          </div>
        </div>
      </div>
    </div>
    <div id="logout-modal">
      <!-- 模态框 -->
      <div id="id-logout" class="ui basic modal">
        <i class="close icon"></i>
        <div class="header">
          确定退出登陆麽?
        </div>
        <div class="image content">
          <div class="image">
            <i class="archive icon"></i>
          </div>
          <div class="description">
            如果您退出您的账户, 将无法享受更多的功能!
          </div>
        </div>
        <div class="actions">
          <div class="two fluid ui inverted buttons">
            <div class="ui cancel red basic inverted button">
              <i class="remove icon"></i>
              取消
            </div>
            <div @click="logout" class="ui ok green basic inverted button">
              <i class="checkmark icon"></i>
              确认
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
  import cookie from '../../static/js/cookie'

  export default {
    name: 'navbar',
    computed: {
      isLogin() {
        return this.$store.state.isLogin
      }
    },
    data() {
      return {
        activeIndex: 1,
        userName: '',
        userPwd: '',
        boardMessageCount: 0
      }
    },
    components: {},
    methods: {
      // init Messaage Board
      initMsgBoard() {
        this.$http.get('http://em.gengwenhao.com:8000/board/', {
          headers: {
            'Authorization': 'JWT ' + cookie.getCookie('token'),
          }
        }).then(res => {
          this.boardMessageCount = res.data.count
        })
      },
      // notify
      notify(title, messageText) {
        const h = this.$createElement;
        this.$notify({
          title: title,
          message: h('i', {style: 'color: teal'}, messageText)
        })
      },
      // 退出登陆
      logout() {
        cookie.delCookie('token')
        this.$store.commit('logout')
      },
      // 显示注销模态模态框
      showLogoutModal() {
        $('#id-logout').modal('show')
      },
      // 清空用户输入状态
      clearInput() {
        this.userName = ''
        this.userPwd = ''
      },
      // 登陆
      login() {
        if (this.userName !== '' && this.userPwd !== '')
          this.postLoginData()
        else
          this.$message('请输入用户名或密码')
        this.clearInput()
      },
      // 发送验证登陆的数据到服务器后端
      postLoginData() {
        this.$http({
          method: 'post',
          url: 'http://em.gengwenhao.com:8000/login/',
          data: {
            username: this.userName,
            password: this.userPwd
          }
        }).then(res => {
          cookie.setCookie('token', res.data.token, 7)
          this.$store.commit('login')
          this.notify('认证信息通过', '欢迎登陆')

        }, err => {
          console.log(err)
          this.notify('无法使用提供的认证信息登录', '检查您的输入信息或网络状态')
        })
      },
      // 显示登陆模态框
      showLoginModal() {
        $('#login').modal('show')
      },
      // 点击导航类的菜单节点
      handleSelect(key, keyPath) {
        switch (key) {
          case '1':
            this.$router.push({name: 'index'})
            break
          case '2-1':
            this.$router.push({name: 'tree'})
            break
          case '2-2':
            this.$router.push({name: 'all-orgs'})
            break
          case '2-3':
            this.$router.push({name: 'all-users'})
            break
          case '3':
            this.$router.push({name: 'userprofile-manager'})
            break
          case '4':
            this.$router.push({name: 'tools'})
            break
        }
      },
      // 获取全站通知
      getBoardMessage() {
        this.$http.get('http://em.gengwenhao.com:8000/board/', {
          headers: {
            'Authorization': 'JWT ' + cookie.getCookie('token'),
          }
        }).then(res => {
          if (res.data.count > this.boardMessageCount) {
            this.boardMessageCount = res.data.count

            let title = ''
            switch (res.data.results[0].type) {
              case 0:
                title = '收到全站公告'
                break
              case 1:
                title = '收到会议邀请'
                break
              case 2:
                title = '收到个人消息'
                break
            }

            this.$notify({
              title: title,
              message: res.data.results[0].content,
              type: 'success',
              dangerouslyUseHTMLString: true
            })
          }
        })
      }
    },
    // 定时刷新
    beforeMount() {
      //设置定时器，每3秒刷新一次
      setInterval(this.getBoardMessage, 1000)
    },
    created() {
      this.initMsgBoard()
    }
  }
</script>

<style scoped>
  #logout, #userinfo {
    height: 60px;
    line-height: 60px;
    float: right;
  }
</style>
