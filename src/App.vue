<template>
  <div id="app">
    <div class='left-menu'>
      <a-menu
        :defaultSelectedKeys="defaultSelectedKeys"
        :defaultOpenKeys="defaultOpenKey"
        mode="inline"
        @click="handleTurnPage"
      >
        <a-sub-menu key="sub1">
          <span slot="title">
          <a-icon type="mail" /><span>患者信息管理</span></span>
          <a-menu-item key="addpatient">患者信息登记</a-menu-item>
          <a-menu-item key="searchpatient">患者信息查询</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="sub2">
          <span slot="title"><a-icon type="calendar" /><span>医生信息管理</span></span>
          <a-menu-item key="addcase">医生信息登记</a-menu-item>
          <a-menu-item key="searchcase">医生信息查询</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="sub3">
          <span slot="title"><a-icon type="appstore" /><span>数据库管理</span></span>
          <a-menu-item key="exportbase">数据管理</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="sub4">
          <span slot="title"><a-icon type="setting" /><span>系统设置</span></span>
          <a-menu-item key="dictionary">字典管理</a-menu-item>
        </a-sub-menu>
      </a-menu>
    </div>
    <div class="right-content">
    <a-locale-provider :locale="locale">
      <router-view/>
    </a-locale-provider>
    </div>
    <div class="top-mask"></div>
  </div>
  
</template>
<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
  export default {
    data() {
      return {
        locale: zhCN,
        defaultOpenKey: [],
        defaultSelectedKeys: []
      };
    },
    created() {
      const name = this.$route.name.split('_');
      this.defaultOpenKey = [name[1]];
      this.defaultSelectedKeys = [name[0]];
    },
    methods: {
      handleTurnPage: function(value) {
        const path = value.key;
        this.$router.push({
          path: path
        })
      }
    },
  };
</script>


<style lang="scss">
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
      -webkit-appearance: none;
  }
  input[type="number"]{
      -moz-appearance: textfield;
  }
  #app {
    font-family: "微软雅黑",Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    height: 100%;
  }
</style>
<style lang="scss" scoped>
#app {
  padding-left: 256px;
  .left-menu {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 256px;
    ul {
      height: 100%;
    }
  }
  .right-content {
    float: left;
    width: 100%;
    height: 100%;
  }
  .top-mask {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    // background-image: url(./assets/img/1.png);
    pointer-events: none;
    // z-index: 99999;
    // opacity: .7;
  }
}

</style>
