<template>
  <div class='patient-content'>
    <p class="head-title">
      <span>医生信息登记</span>
    </p>
    <div class="form-box">
      <a-row :gutter="16">
        <a-col class="gutter-row" :span="8">
          <div class="gutter-box">
            <label class="label">医生姓名</label>
            <a-input placeholder="请输入医生姓名" v-model='caseName' />
          </div>
        </a-col>
        <a-col class="gutter-row" :span="8">
          <div class="gutter-box sex">
            <label class="label">性别</label>
            <a-radio-group v-model="sex">
              <a-radio :value="1">男</a-radio>
              <a-radio :value="2">女</a-radio>
            </a-radio-group>
          </div>
        </a-col>
        <a-col class="gutter-row" :span="8">
            <div class="gutter-box">
              <label class="label">职称</label>
              <a-select :defaultValue="currentCaseName" style="width:100%;" @change="handleCaseChange">
                <a-select-option v-for="(item, index) in caseData" :key="index"
                  >{{item}}</a-select-option
                >
              </a-select>
            </div>
          </a-col>
        <a-col class="gutter-row" :span="24">
          <div class="gutter-box">
            <label class="label remarks">备注</label>
            
            <a-textarea
              v-model="remarks"
              placeholder="请添加备注"
              :autoSize="{ minRows: 2, maxRows: 5 }"
            />
          </div>
        </a-col>
      </a-row>
    </div>
    <div class="btn-list">
      <a-button type="primary" @click="handleUpload">确定</a-button>
    </div>
  </div>
</template>
<script>
  const caseData = ['张医生','王医生','李医生'];
  const zdbwData = ['头部','脸部','腿部','胳膊']
  export default {
    data() {
      return {
        caseData: caseData,//所有医生信息
        currentCaseName: caseData[0], // 默认医生信息
        caseName: '',//病人姓名
        sex: 1,
        remarks: '' // 备注
      };
    },
    methods: {
      // 处理上传
      handleUploadChange: function() {

      },
      // 选择住院医师
      handleCaseChange: function() {

      },
      // 诊断部位选择
      handleZdbwChange: function(selectedItems) {
        this.zdbwText = selectedItems;
      },
      // 入院日期 
      onDateChange: function() {

      },
      // 点击确定
      handleUpload: function() {
        
      }
    },
  };
</script>
<style lang="scss">
  .form-box {
    .ant-row {
      margin: 0;
    }
  }
</style>
<style lang="scss" scoped>
.patient-content {
  padding-bottom: 20px;
  .head-title {
    height: 36px;
    line-height: 36px;
    border-bottom: 1px solid #eee;
    padding-left: 15px;
    font-size: 16px;
  }
  .upload-box {
    margin: 15px 15px 0 15px;
  }
  .form-box {
    margin: 0 15px 0 15px;
    .gutter-row {
      .gutter-box {
        padding-left: 100px;
        margin-top: 15px;
        &.sex {
          margin-top: 20px;
        }
        .label {
          display: inline-block;
          margin-left: -100px;
          padding-right: 15px;
          width: 100px;
          text-align: center;
          &.remarks {
            position: absolute;
            top: 23px;
          }
        }
      }
    }
  }
  .photo-box {
    margin: 0 15px;
    .photo-item {
      padding-left: 100px;
      margin-top: 15px;
      label {
        width: 100px;
        display: inline-block;
        margin-left: -100px;
        text-align: center;
      }
      img {
        margin-left: 20px;
      }
    }
  }
  .btn-list {
    margin-left: 140px;
    .ant-btn-primary {
      margin-top: 15px;
      width: 100px !important;
    }
  }
}

</style>
