<template>
  <div id="tools">
    <div class="ui message">
      <div class="header">该页面下您将享有功能 </div>
      <ul class="list">
        <li>您现在可以对全站范围内用户发起公告</li>
        <li>您可以给机构下所有用户发起通知</li>
        <li>您可以给指定用户发起消息</li>
      </ul>
    </div>

    <div class="ui dividing header">
      工具箱
    </div>

    <div class="ui segment">
      <div class="ui cards">
        <div class="card">
          <div class="content">
            <div class="header">公告 </div>
            <div class="meta">您可以对全站范围内用户发起公告 </div>
            <div class="description">用户会在进入页面第一时间收到通知 </div>
          </div>
          <div class="extra content">
            <div class="ui button fluid red">
              发起公告
            </div>
          </div>
        </div>
        <div class="card">
          <div class="content">
            <div class="header">群体通知 </div>
            <div class="meta">机构下所有用户发起通知 </div>
            <div class="description">对指定机构下所有用户发起, 非机构用户无法得到通知 </div>
          </div>
          <div class="extra content">
            <div class="ui button fluid blue">
              选择组织
            </div>
          </div>
        </div>
        <div class="card">
          <div class="content">
            <div class="header">机构下所有用户发起通知 </div>
            <div class="meta">Friends of Veronika </div>
            <div class="description">对全站用户发起通知 </div>
          </div>
          <div class="extra content">
            <div class="ui button fluid yellow">
              选择人员
            </div>
          </div>
        </div>
      </div>
    </div>

    <div>
      <el-collapse-transition>
        <div v-show="isShow">
          <div class="transition-box">

          </div>
        </div>
      </el-collapse-transition>
    </div>

  </div>
</template>

<script>
  import cookie from '../../static/js/cookie'
  import ElCollapseTransition from "element-ui/src/transitions/collapse-transition";

  export default {
    name: 'tools',
    components: {ElCollapseTransition},
    data() {
      return {
        isShow:false
      }
    },
    methods() {
    },
    created(){
      let token = cookie.getCookie('token')
      if (token) this.$store.commit('login')
    }
  }
</script>

<style scoped>
  #tools {
    padding: 23px;
  }

</style>
