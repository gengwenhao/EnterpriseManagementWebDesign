<template>
  <div id="login-modal">
    <div id="login" class="ui base active modal">
      <i class="close icon"></i>
      <div class="header">登陆您的账号</div>
      <div class="content">
        <div class="ui form">
          <h4 class="ui dividing header">请详细核对您的信息</h4>
          <div class="field">
            <label>用户名</label>
            <input type="text" placeholder="用户名或邮箱">
          </div>
          <div class="field">
            <label>密码</label>
            <input type="password" placeholder="用户名或邮箱">
          </div>
        </div>
      </div>
      <div class="actions">
        <div class="ui black deny button">
          取消
        </div>
        <div class="ui positive right labeled icon button">
          登陆
          <i class="checkmark icon"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'login-modal',
    methods: {
      show() {
        $('#login').modal('show')
      },
      login() {

      }
    }
  }
</script>

<style scoped>

</style>
