<script lang="ts">
import {eventEmitter} from "./model/EventEmitter";

/**
 * Drawer 的内容是懒渲染的，即在第一次被打开之前，传入的默认 slot 不会被渲染到 DOM 上。
 */
export default {
  components: {},
  data() {
    return {
      drawer: false,
      debug_panel_show: __DEV__,
    }
  },
  methods: {},
  created() {
    eventEmitter.on('主面板开关', () => {
      this.drawer = !this.drawer;
    })
    document.addEventListener('keydown', (event) => {
      eventEmitter.send('event-keydownEvent', event);
      if (event.key === '`') {
        this.drawer = !this.drawer;
      }
    });
    eventEmitter.on('el-notify', (options: any) => {
      if (!options['position']) {
        options.position = 'bottom-right';
      }
      this.$notify(options)
    })
    eventEmitter.on('el-msg', (...options: any) => {
      this.$message.apply(this, options)
    })
    eventEmitter.on('el-alert', (...options: any) => {
      this.$alert.apply(this, options);
    })
    eventEmitter.handler('el-confirm', (...options: any) => {
      return this.$confirm.apply(this, options)
    })
    eventEmitter.handler('el-prompt', (...options: any) => {
      return this.$prompt.apply(this, options)
    })
  }
}
</script>

<template>
  <div>
    <el-drawer :modal="false"
               :visible.sync="drawer"
               :with-header="false"
               direction="rtl"
               size="40%"
               style="position: fixed">
      <el-tabs type="border-card">
        <el-tab-pane label="默认面板">
          <el-button type="success">测试</el-button>
        </el-tab-pane>
      </el-tabs>
    </el-drawer>
  </div>
</template>
