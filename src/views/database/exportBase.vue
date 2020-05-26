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
        <a-button type="primary" icon="upload">上传数据表格</a-button>
      </a-upload>
      <div class="datainfo">
        <p>{{exportFileInfo}}</p>
        <a-spin tip="上传中，请稍等..." v-show="dataIsLoading" style="text-align:center;margin: 15px 0 15px 30px;"/>
      </div>
      <a-upload
        name="file"
        :multiple="true"
        :beforeUpload="beforeUploadphoto"
        :customRequest = 'customRequestphoto'
        accept="image/*"
      >
        <a-button type="primary" icon="upload">上传病例图片</a-button>
      </a-upload>
      <div class="photoinfo">
        <a-spin tip="上传中，请稍等..." v-show="photoIsLoading" style="text-align:center;margin: 15px 0 15px 30px;"/>
      </div>
      <a-button type="primary" icon="download" style="margin-top: 15px;" :disabled="exportIsLoading" @click="hancleExport">导出</a-button>
      <div class="exportinfo">
        <a-spin tip="导出中，请稍等..." v-show="exportIsLoading" style="text-align:center;margin: 15px 0 15px 30px;"/>
      </div>
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
        allImageData: new FormData(),
        allFileNum: 0,
        formDatasNum: 0,
        modalVisible: false,
        isResetData: false,
        exportFileInfo: '',
        dataIsLoading: false,
        photoIsLoading: false,
        exportIsLoading: false
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
        self.dataIsLoading = true;
        self.$http.post('/database/import/data', formData)
        .then((res) => {
          const data = res.data;
          self.exportFileInfo = data.importInfo;
          self.dataIsLoading = false;
          self.$message.success('上传成功');
        }).catch(() => {
          self.dataIsLoading = false;
          self.$message.error('上传失败');
        });
      },
      beforeUploadphoto() {
        // const formData = new FormData();
        // formData.append('imageFiles', file.file);
        // this.allImageData.push(formData);
        this.formDatasNum += 1;
        // this.allImageData.append('imageFiles', file.file);
      },
      customRequestphoto(file) {
        const self = this;
        self.allFileNum += 1;
        self.allImageData.append('imageFiles', file.file);
        if(self.allFileNum == self.formDatasNum && self.allFileNum !== 0) {
          self.allFileNum = 0;
          self.formDatasNum = 0;
          self.photoIsLoading = true;
          const params = self.allImageData;
          self.$http.post('/database/import/image', params, {
            headers: {
              'Content-Type':'multipart/form-data'
            }
          })
          .then(() => {
            self.allImageData = null;
            self.allImageData = new FormData();
            self.photoIsLoading = false;
            self.$message.success('上传成功');
          }).catch(() => {
            debugger;
            self.allImageData = null;
            self.allImageData = new FormData();
            self.photoIsLoading = false;
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
        self.exportIsLoading = true;
        self.$http.post('/database/export', params, {
          responseType: 'blob'
        })
        .then((res) => {
          self.exportIsLoading = false;
          downloadFileFromResource(res);
          self.$message.success('导出成功');
        }).catch(() => {
          self.exportIsLoading = false;
          self.$message.error('请求失败');
        });
      },
      handleCloseDelMulModatl() {
        const self = this;
        self.modalVisible = false;
        const params = {
          "truncateDatabase": false
        };
        self.exportIsLoading = true;
        self.$http.post('/database/export', params, {
          responseType: 'blob'
        })
        .then((res) => {
          downloadFileFromResource(res);
          self.$message.success('导出成功');
          self.exportIsLoading = false;
        }).catch(() => {
          self.exportIsLoading = false;
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
      .datainfo {
      }
    }
  }
</style>
