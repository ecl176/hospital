<template>
  <div class='database-content'>
    <p class="head-title">
      <span>数据管理</span>
    </p>
    <div class="export-box">
      <a-upload
        name="file"
        :multiple="true"
        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        @change="handleChange"
      >
        <a-button type="primary">上传</a-button>
      </a-upload>
      <a-button type="primary" style="margin-left: 20px;">导出</a-button>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        
      };
    },
    mounted() {
    },
    methods: {
      
    }
  };
</script>
<style lang="scss" scoped>
  .database-content {
    padding-bottom: 20px;
    .head-title {
      height: 36px;
      line-height: 36px;
      border-bottom: 1px solid #eee;
      padding-left: 15px;
      font-size: 16px;
    }
    .export-box {
      padding-left: 20px;
      > span {
        float: left !important;
      }
    }
  }
</style>
