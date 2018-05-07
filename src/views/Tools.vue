<template>
  <div id="tools">
    <div class="ui message">
      <div class="header">该页面下您将享有功能</div>
      <ul class="list">
        <li>您可以在历史记录中查看所有类型的通知</li>
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
            <div class="header">历史记录</div>
            <div class="meta">这个面板存放了您的所有历史通知</div>
            <div class="description">查看历史记录</div>
          </div>
          <div class="extra content">
            <div @click="showMsgBoard" class="ui button inverted fluid blue">
              查看
            </div>
            <div class="floating ui teal label">{{ msgCount }}</div>
          </div>
        </div>
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


    <div id="msg" v-show="isShowMsg">

      <div class="ui items" v-for="msg in msgList">
        <div class="ui yellow message">
          <i class="star icon"></i>
          <span>{{ msg.add_time|strfTime }}</span>
          <div v-html="msg.content"></div>
        </div>
      </div>

      <el-col id="id-msg-pagination">
        <el-pagination
          id="pagination"
          @current-change="pageChange"
          small
          layout="prev, pager, next"
          :page-size="4"
          :total="msgCount"
        >
        </el-pagination>
      </el-col>
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
    filters: {
      strfTime: function (value) {
        return value.split('.')[0].replace('T', ' ')
      }
    },
    watch: {
      filterText(val) {
        this.$refs.tree2.filter(val);
      }
    },
    components: {ElCollapseTransition},
    data() {
      return {
        isShowMsg: false,
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
        curBoardType: 0,
        msgCount: 0,
        msgList: []
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
        this.isShowMsg = false
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

        this.updateMsgBoard(1)
      },
      // 显示MsgBoard
      showMsgBoard() {
        this.updateMsgBoard(1)
        this.closeBoard()
        this.isShowMsg = true
      },
      // 更新历史记录
      updateMsgBoard(page) {
        api.getBoardMessage(page).then(res => {
          this.msgCount = res.data.count
          this.msgList = res.data.results
        })
      },
      // 分页器
      pageChange(page) {
        this.updateMsgBoard(page)
      }
    },
    created() {
      let token = cookie.getCookie('token')
      if (token) this.$store.commit('login')

      api.getBoardMessage().then(res => {
        this.msgCount = res.data.count
        this.msgList = res.data.results
      })

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
