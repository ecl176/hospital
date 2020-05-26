<template>
  <div class='database-content'>
    <p class="head-title">
      <span>数据管理</span>
    </p>
    <div class="export-box">
      <!-- <a-button type="primary" icon="download" style="margin-top: 15px;" :disabled="exportIsLoading" @click="hancleExport">导出</a-button> -->
      <div class="btn-icon" @click="hancleExport" style="margin-bottom: 15px;">
        <p class="ant-upload-drag-icon">
          <a-icon type="download" style="color: #40a9ff;font-size: 48px;"/>
        </p>
        <p class="ant-upload-text" style="margin-bottom: 0;">
          导出excel数据以及照片
        </p>
      </div>
      <div class="exportinfo">
        <a-spin tip="导出中，请稍等..." v-show="exportIsLoading" style="text-align:center;"/>
      </div>
      <a-upload
        name="file"
        :multiple="false"
        :customRequest = 'customRequest'
        accept=".xlsx, .xls"
      >
        <!-- <a-button type="primary" icon="upload">上传数据表格</a-button> -->
        <div class="btn-icon">
          <p class="ant-upload-drag-icon">
            <a-icon type="inbox" style="color: #40a9ff;font-size: 48px;"/>
          </p>
          <p class="ant-upload-text">
            点击上传excel数据
          </p>
        </div>
      </a-upload>
      <div class="datainfo">
        <p v-for="(item, index) in exportFileInfo.split(';')" :key="index">
          {{item}}
        </p>
        <a-spin tip="上传中，请稍等..." v-show="dataIsLoading" style="text-align:center;"/>
      </div>
      <a-upload
        name="file"
        :multiple="true"
        :beforeUpload="beforeUploadphoto"
        :customRequest = 'customRequestphoto'
        accept="image/*"
      >
        <!-- <a-button type="primary" icon="upload">上传病例图片</a-button> -->
        <div class="btn-icon">
          <p class="ant-upload-drag-icon">
            <a-icon type="inbox" style="color: #40a9ff;font-size: 48px;"/>
          </p>
          <p class="ant-upload-text">
            上传病例图片
          </p>
        </div>
      </a-upload>
      <div class="photoinfo">
        <p v-for="(item, index) in imageSuccessInfo" :key="index">
          {{item}}
        </p>
        <a-spin tip="上传中，请稍等..." v-show="photoIsLoading" style="text-align:center;"/>
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
        exportIsLoading: false,
        imageSuccessInfo: []
      };
    },
    mounted() {
    },
    methods: {
      hancleExport() {
        const self = this;
        if(!self.exportIsLoading) {
          self.modalVisible = true;
        }
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
          .then((res) => {
            self.allImageData = null;
            self.allImageData = new FormData();
            self.photoIsLoading = false;
            self.$message.success('上传成功');
            self.imageSuccessInfo.push(res.data.importInfo);
          }).catch(() => {
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
    .ant-upload {
      width: 100%;
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
      padding-right: 20px;
      .exportinfo {
        .ant-spin {
          width: 100%;
          margin-bottom: 15px;
        }
      }
      .datainfo {
        padding-top: 15px;
        padding-left: 15px;
        .ant-spin {
          width: 100%;
          margin-bottom: 15px;
        }
      }
      .photoinfo {
        padding-top: 15px;
        padding-left: 15px;
        .ant-spin {
          width: 100%;
        }
      }
      .btn-icon {
        position: relative;
        width: 100%;
        height: 100%;
        text-align: center;
        background: #fafafa;
        border: 1px dashed #d9d9d9;
        border-radius: 4px;
        cursor: pointer;
        padding: 15px 0;
        .ant-upload-text {
          margin-top: 10px;
        }
      }
    }
  }
</style>
