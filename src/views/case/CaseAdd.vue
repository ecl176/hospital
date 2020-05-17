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
              <a-radio :value="0">男</a-radio>
              <a-radio :value="1">女</a-radio>
            </a-radio-group>
          </div>
        </a-col>
        <a-col class="gutter-row" :span="8">
            <div class="gutter-box">
              <label class="label">职称</label>
              <a-select style="width:100%;" @change="handleCaseChange" :value="currentCaseType" placeholder="请选择职称">
                <a-select-option v-for="(item, index) in allCaseData" :key="index" :value="item"
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
      <a-button type="primary" @click="resetForm" style="margin-left: 15px;">重置</a-button>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        allCaseData: [],//所有职称信息
        currentCaseType: [], // 职称信息
        caseName: '',//医生姓名
        sex: 0,
        remarks: '' // 备注
      };
    },
    mounted() {
      this.getCaseData();
    },
    methods: {
      //获取职称信息
      getCaseData() {
        const self = this;
        self.$http.get('/dictionary/TITLE_TYPE').then((res) => {
          if(res.status === 200) {
            const data = res.data;
            data.forEach((item) => {
              self.allCaseData.push(item.value);
            });
          }
        }).catch(() => {
          self.$message.error('请求失败');
        });
      },
      // 选择住院医师
      handleCaseChange(item) {
        this.currentCaseType = [];
        this.currentCaseType.push(item);
      },
      // 点击确定
      handleUpload() {
        const self = this;
        const params = {
          doctorGender: self.sex == 0 ? '男' : '女',
          doctorName: self.caseName,
          titleType: self.currentCaseType[0]
        }
        if (self.caseName === '') {
          self.$message.error('请输入医生姓名');
          return false;
        }
        if (self.currentCaseType.length === 0) {
          self.$message.error('请选择医生职称');
          return false;
        }
        self.$http.post('/doctor/addition', params)
        .then((res) => {
          self.$message.success('添加成功');
          self.resetForm();
        }).catch(() => {
          self.$message.error('请求失败');
        });
      },
      resetForm() {
        this.currentCaseType = [];
        this.caseName = '';
        this.remarks = '';
        this.sex = 0;
      }
    }
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
    margin-left: 115px;
    .ant-btn-primary {
      margin-top: 15px;
      width: 100px !important;
    }
  }
}

</style>
