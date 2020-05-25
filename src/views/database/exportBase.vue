<template>
  <div class='database-content'>
    <p class="head-title">
      <span>数据管理</span>
    </p>
    <div class="export-box">
      <a-upload
        name="file"
        :multiple="true"
        :beforeUpload="beforeUpload"
        :customRequest = 'customRequest'
        accept="image/*, .xlsx, .xls"
      >
        <a-button type="primary">上传</a-button>
      </a-upload>
      <a-button type="primary" style="margin-left: 20px;" @click="hancleExport">导出</a-button>
    </div>
  </div>
</template>
<script>
import { downloadFileFromResource } from '@/utils/file'
  export default {
    data() {
      return {
        allImageData:[],
        fileData: [],
        allFileNum: 0
      };
    },
    mounted() {
    },
    methods: {
      hancleExport() {
        const self = this;
        const params = {
          "truncateDatabase": true
        };
        self.$http.post('/database/export', params, {
          responseType: 'blob'
        })
        .then((res) => {
          downloadFileFromResource(res)
        }).catch(() => {
          self.$message.error('请求失败');
        });
      },
      beforeUpload(file) {
        const formData = new FormData();
        formData.append('file', file.file);
        if(file.type.indexOf('image') !== -1) {
          this.allImageData.push(formData);
        } else {
          this.fileData = [];
          this.fileData.push(formData);
        }
      },
      customRequest() {
        const self = this;
        self.allFileNum += 1;
        if(self.allFileNum == self.allImageData.length + self.fileData.length) {
          self.allFileNum = 0;
          if(self.allImageData.length > 0) {
            const params = self.allImageData;
            self.$http.post('/database/import/image', params)
            .then((res) => {
              debugger;
            }).catch(() => {
              self.allImageData = [];
              self.$message.error('上传失败');
            });
          }
          if(self.fileData.length > 0) {
            const params = self.fileData[0];
            self.$http.post('/database/import/data', params)
            .then((res) => {
              debugger;
            }).catch(() => {
              self.fileData = [];
              self.$message.error('上传失败');
            });
          }
        }
      },

    }
  };
</script>
<style lang="scss">
  .export-box {
    .ant-upload-list {
      display: none !important;
    }
  }
</style>
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
