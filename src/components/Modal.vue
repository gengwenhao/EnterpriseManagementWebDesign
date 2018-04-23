<template>
  <div id="modal">
  <!-- 模态框 -->
  <div class="ui basic modal">
    <i class="close icon"></i>
    <div class="header">
      <slot name="header"></slot>
    </div>
    <div class="image content">
      <div class="image">
        <i class="archive icon"></i>
      </div>
      <div class="description">
        <slot name="description"></slot>
      </div>
    </div>
    <div class="actions">
      <div class="two fluid ui inverted buttons">
        <div class="ui cancel red basic inverted button">
          <i class="remove icon"></i>
          取消
        </div>
        <div class="ui ok green basic inverted button">
          <i class="checkmark icon"></i>
          确认
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
  export default {
    name: 'modal',
    data() {
      return {}
    },
    methods: {
      show() {
        $('.ui.basic.modal')
          .modal('show')
      }
    }
  }
</script>

