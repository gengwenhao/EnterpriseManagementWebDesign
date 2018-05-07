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
            <div @click="showOrgBoard" class="ui button fluid blue">
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
            <div @click="showUserBoard" class="ui button fluid yellow">
              选择人员
            </div>
          </div>
        </div>
      </div>
    </div>

    <el-input
      v-if="isShowUserIdInput"
      class="userid-input"
      placeholder="输入用户ID"
      v-model="userId">
    </el-input>

    <div v-if="isShowOrgTree" class="custom-tree-container">
      <el-input
        placeholder="输入关键字进行过滤"
        v-model="filterText">
      </el-input>

      <el-tree
        class="filter-tree"
        show-checkbox
        :data="orgList"
        :props="defaultProps"
        default-expand-all
        :filter-node-method="filterNode"
        ref="tree">
      </el-tree>
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
  import * as api from '../api/api'

  export default {
    name: 'tools',
    watch: {
      filterText(val) {
        this.$refs.tree2.filter(val);
      }
    },
    components: {ElCollapseTransition},
    data() {
      return {
        userId: '',
        editorContent: '',
        isShowEditor: false,
        isShowOrgTree: false,
        isShowUserIdInput: false,
        submitContent: '',
        editorObj: null,
        orgList: [],
        filterText: '',
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        curBoardType: 0
      }
    },
    methods: {
      // 过滤节点
      filterNode(value, data) {
        if (!value) return true
        return data.name.indexOf(value) !== -1
      },
      // 关闭面板
      closeBoard() {
        this.editorContent = ''
        this.editorObj.txt.html('')
        this.isShowEditor = false
        this.isShowOrgTree = false
        this.isShowUserIdInput = false
      },
      // 显示公告发起面板
      showBoard() {
        this.closeBoard()
        this.isShowEditor = true
        this.submitContent = '发送公告给全站用户'
        this.curBoardType = 1
      },
      // 显示会议通知发起面板
      showOrgBoard() {
        this.closeBoard()
        this.isShowOrgTree = true
        this.isShowEditor = true
        this.submitContent = '会议通知'
        this.curBoardType = 2
      },
      // 显示用户通知发起面板
      showUserBoard() {
        this.closeBoard()
        this.isShowEditor = true
        this.isShowUserIdInput = true
        this.submitContent = '发送消息到用户'
        this.curBoardType = 3
      },
      // 发送
      sendBoard() {
        if (this.editorContent)
          switch (this.curBoardType) {
            case 1:
              this.postBoardContent(0, null)
              break
            case 2:
              let orgList = this.$refs.tree.getCheckedNodes()
              orgList.forEach(item => {
                this.postBoardContent(1, item.id)
              })
              break
            case 3:
              if (this.userId)
                this.postBoardContent(2, this.userId)
              else
                this.$message('输入用户ID')
              break
            default:
              break
          }
        else
          this.$message('请输入内容')
      },
      // 将内容发送给后端
      postBoardContent(type, targetId) {
        api.postBoardContent(this.editorContent, type, targetId)
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

      api.getOrgProfile().then(res => {
        this.orgList = res.data.results
      })
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
  #id-submit-editor {
    margin-top: 12px;
  }

  #tools, .custom-tree-container, .userid-input {
    padding: 23px;
  }
</style>
