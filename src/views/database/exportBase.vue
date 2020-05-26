<template>
  <div class='database-content'>
    <p class="head-title">
      <span>数据管理</span>
    </p>
    <div class="export-box">
      <a-upload
        name="file"
        :multiple="false"
        :customRequest = 'customRequest'
        accept=".xlsx, .xls"
      >
        <a-button type="primary">上传数据表</a-button>
      </a-upload>
      <div>
        <p>{{exportFileInfo}}</p>
      </div>
      <a-upload
        name="file"
        :multiple="true"
        :beforeUpload="beforeUploadphoto"
        :customRequest = 'customRequestphoto'
        accept="image/*"
      >
        <a-button type="primary">上传病例图片</a-button>
      </a-upload>
      <a-button type="primary" style="margin-left: 20px;" @click="hancleExport">导出</a-button>
      <a-modal
        v-model="modalVisible"
        title=""
        @ok="handleExportInfo"
        @cancel="handleCloseDelMulModatl"
        okText="是"
        cancelText="否"
        closable=false
        >
        <p style="font-size:16px;margin: 10px 0 0; color: red;">重要提示</p>
        <p style="font-size:16px;margin: 10px 0 0;">您导出后希望清空数据库、照片数据库吗？如果确定请选择是，否则选择否。</p>
      </a-modal>
    </div>
  </div>
</template>
<script>
import { downloadFileFromResource } from '@/utils/file'
  export default {
    data() {
      return {
        allImageData:[],
        allFileNum: 0,
        modalVisible: false,
        isResetData: false,
        exportFileInfo: ''
      };
    },
    mounted() {
    },
    methods: {
      hancleExport() {
        const self = this;
        self.modalVisible = true;
      },
      customRequest(file) {
        const self = this;
        const formData = new FormData();
        formData.append('dataFile', file.file);
        self.$http.post('/database/import/data', formData)
        .then((res) => {
          const data = res.data;
          self.exportFileInfo = data.importInfo;
        }).catch(() => {
          self.$message.error('上传失败');
        });
      },
      beforeUploadphoto(file) {
        const formData = new FormData();
        formData.append('imageFiles', file.file);
        this.allImageData.push(formData);
      },
      customRequestphoto() {
        const self = this;
        self.allFileNum += 1;
        if(self.allFileNum == self.allImageData.length) {
          self.allFileNum = 0;
          const params = self.allImageData;
          self.$http.post('/database/import/image', params)
          .then((res) => {
            debugger;
            self.allImageData = [];
          }).catch(() => {
            self.allImageData = [];
            self.$message.error('上传失败');
          });
        }
      },
      handleExportInfo() {
        const self = this;
        self.modalVisible = false;
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
      handleCloseDelMulModatl() {
        const self = this;
        self.modalVisible = false;
        const params = {
          "truncateDatabase": false
        };
        self.$http.post('/database/export', params, {
          responseType: 'blob'
        })
        .then((res) => {
          downloadFileFromResource(res)
        }).catch(() => {
          self.$message.error('请求失败');
        });
      }
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
    }
  }
</style>
