<template>
  <div id="app">
    <div class='left-menu'>
      <a-menu
        :defaultSelectedKeys="['1']"
        :defaultOpenKeys="['sub1']"
        mode="inline"
        @click="handleTurnPage"
      >
        <a-sub-menu key="1">
          <span slot="title">
          <a-icon type="mail" /><span>病人信息管理</span></span>
          <a-menu-item key="addpatient">病人信息登记</a-menu-item>
          <a-menu-item key="searchpatient">病人信息查询</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="sub2">
          <span slot="title"><a-icon type="appstore" /><span>医生信息管理</span></span>
          <a-menu-item key="addcase">医生信息登记</a-menu-item>
          <a-menu-item key="searchcase">医生信息查询</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="sub3">
          <span slot="title"><a-icon type="appstore" /><span>数据库管理</span></span>
          <a-menu-item key="9">导出数据</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="sub4">
          <span slot="title"><a-icon type="appstore" /><span>系统设置</span></span>
          <a-menu-item key="9">修改密码</a-menu-item>
          <a-menu-item key="10">字典管理</a-menu-item>
        </a-sub-menu>
      </a-menu>
    </div>
    <div class="right-content">
    <a-locale-provider :locale="locale">
      <router-view/>
    </a-locale-provider>
    </div>
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
      };
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
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
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
  }
}

</style>
