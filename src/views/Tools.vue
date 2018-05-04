<template>
  <div id="tools">
    <div class="ui message">
      <div class="header">该页面下您将享有功能</div>
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
            <div class="header">公告</div>
            <div class="meta">您可以对全站范围内用户发起公告</div>
            <div class="description">全站用户会在进入页面第一时间收到通知</div>
          </div>
          <div class="extra content">
            <div @click="showBoard" class="ui button fluid red">
              发起公告
            </div>
          </div>
        </div>
        <div class="card">
          <div class="content">
            <div class="header">会议通知</div>
            <div class="meta">机构下所有用户发起会议通知</div>
            <div class="description">对指定机构下所有用户发起, 非机构用户无法得到通知</div>
          </div>
          <div class="extra content">
            <div class="ui button fluid blue">
              选择组织
            </div>
          </div>
        </div>
        <div class="card">
          <div class="content">
            <div class="header">用户通知</div>
            <div class="meta">选择指定的用户, 他将收到及时的消息</div>
            <div class="description">选择用户发起通知</div>
          </div>
          <div class="extra content">
            <div class="ui button fluid yellow">
              选择人员
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-show="isShowEditor" id="id-editor-panel">
      <div ref="editor" style="text-align:left"></div>
      <button @click="sendBoard" id="id-submit-editor" class="ui button grey" v-text="submitContent"></button>
    </div>

  </div>
</template>

<script>
  import cookie from '../../static/js/cookie'
  import ElCollapseTransition from "element-ui/src/transitions/collapse-transition"
  import E from 'wangeditor'

  export default {
    name: 'tools',
    components: {ElCollapseTransition},
    data() {
      return {
        editorContent: '',
        isShowEditor: false,
        submitContent: '',
        editorObj: null
      }
    },
    methods: {
      // 关闭公告
      closeBoard() {
        this.editorContent = ''
        this.editorObj.txt.html('')
        this.isShowEditor = false
      },
      // 显示公告
      showBoard() {
        this.isShowEditor = true
        this.submitContent = '发送公告给全站用户'
      },
      // 发送公告
      sendBoard() {
        if (this.editorContent)
          this.postBoardContent(0, null)
        else
          this.$message('请输入内容')
      },
      // 网络发送
      postBoardContent(type, targetId) {
        this.$http.post('http://e.gengwenhao.com:8000/board/', {
          "content": this.editorContent,
          "type": type,
          "target_id": targetId
        }, {
          headers: {
            'Authorization': 'JWT ' + cookie.getCookie('token'),
          }
        })
          .then(res => {
            this.$message('发送成功')
            this.closeBoard()
          }, err => {
            this.$message('发送失败')
          })
      }
    },
    created() {
      let token = cookie.getCookie('token')
      if (token) this.$store.commit('login')
    },
    mounted() {
      let editor = new E(this.$refs.editor)
      editor.customConfig.onchange = (html) => {
        this.editorContent = html
      }
      editor.create()
      this.editorObj = editor
    }
  }
</script>

<style scoped>
  #tools {
    padding: 23px;
  }

  #id-submit-editor {
    margin-top: 12px;
  }

</style>
