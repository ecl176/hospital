<template>
  <div class='patient-content'>
    <p class="head-title">
      <span>病人信息登记</span>
    </p>
    <div class="upload-box">
      <a-upload-dragger
          name="file"
          :multiple="true"
          directory
          :beforeUpload="beforeUpload"
          :customRequest = 'customRequest'
          @change="handleUploadChange"
      >
          <p class="ant-upload-drag-icon">
          <a-icon type="inbox" />
          </p>
          <p class="ant-upload-text">点击或者将文件拖拽至此进行上传</p>
      </a-upload-dragger>
    </div>
    <div class="form-box">
      <a-row :gutter="16">
        <a-col class="gutter-row" :span="8">
          <div class="gutter-box">
            <label class="label">住院号</label>
            <a-input placeholder="请输入住院号" v-model='hospitalNum' disabled style="color:'#333'"/>
          </div>
        </a-col>
        <a-col class="gutter-row" :span="8">
          <div class="gutter-box">
            <label class="label">主治医师</label>
            <a-select style="width:100%;" @change="handleCaseChange" :value="currentCaseName" placeholder="请选择主治医生">
              <a-select-option v-for="(item, index) in caseData" :key="index" :value="item"
                >{{item}}</a-select-option
              >
            </a-select>
          </div>
        </a-col>
        <a-col class="gutter-row" :span="8">
          <div class="gutter-box">
            <label class="label">病人姓名</label>
            <a-input placeholder="请输入病人姓名" v-model='patientName' />
          </div>
        </a-col>
      </a-row>
      <a-row :gutter="16">
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
            <label class="label">病人年龄</label>
            <a-input placeholder="请输入病人年龄" v-model='age'/>
          </div>
        </a-col>
        <a-col class="gutter-row" :span="8">
          <div class="gutter-box">
            <label class="label">诊断</label>
            <a-select
              mode="tags"
              style="width: 100%"
              @change="handleZdbwChange"
              placeholder="请选择诊断部位"
              :defaultValue="zdData"
              :value="zdData"
              >
              <a-select-option v-for="(item, index) in allZdData" :key="index" :value="item">
                {{item}}
              </a-select-option>
            </a-select>
          </div>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col class="gutter-row" :span="8">
          <div class="gutter-box">
            <label class="label">手术方式</label>
            <a-select
              mode="tags"
              style="width: 100%"
              @change="handleSsfsChange"
              placeholder="请选择手术方式"
              :value="ssfsData"
              >
              <a-select-option v-for="(item, index) in allSsfsData" :key="index" :value="item">
                {{item}}
              </a-select-option>
            </a-select>
          </div>
        </a-col>
        <a-col class="gutter-row" :span="8">
          <div class="gutter-box">
            <label class="label">治疗方式</label>
            <a-select
              mode="tags"
              style="width: 100%"
              @change="handleZlfsChange"
              placeholder="请选择治疗方式"
              :defaultValue="zlfsData"
              :value="zlfsData"
              >
              <a-select-option v-for="(item, index) in allZlfsData" :key="index" :value="item">
                {{item}}
              </a-select-option>
            </a-select>
          </div>
        </a-col>
        <a-col class="gutter-row" :span="8">
          <div class="gutter-box">
            <label class="label">治疗结果</label>
            <a-select
              mode="tags"
              style="width: 100%"
              @change="handleZljgChange"
              placeholder="请选择治疗结果"
              :defaultValue="zljgData"
              :value="zljgData"
              >
              <a-select-option v-for="(item, index) in allZljgData" :key="index" :value="item">
                {{item}}
              </a-select-option>
            </a-select>
          </div>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col class="gutter-row" :span="8">
          <div class="gutter-box">
            <label class="label">联系电话</label>
            <a-input placeholder="请输入联系电话" v-model="photoNum" />
          </div>
        </a-col>
        <a-col class="gutter-row" :span="8">
          <div class="gutter-box">
            <label class="label">入院日期</label>
            <a-date-picker @change="onDateChange" v-model="ryDate" style="width:100%;" placeholder="请选择入院日期">
            </a-date-picker>
          </div>
        </a-col>
      </a-row>
      <a-row :gutter="16">
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
    <div class="photo-box">
      <div class="mask" v-show="isLoadingImg">
        <a-spin tip="图片上传中请稍等..." size="large" class="spin-icon">
        </a-spin>
      </div>
      <div class="photo-item">
        <label>术前</label>
        <div class="upload-img-btn">
          <a-upload
            listType="picture-card"
            class="avatar-uploader"
            :showUploadList="false"
            accept="image/*"
            :customRequest='beforeImgUpload'
          >
            <div>
              <a-icon type="plus" />
              <div class="ant-upload-text">上传</div>
            </div>
          </a-upload>
        </div>
        <div class="items-list" v-for="(item, index) in preImageData" :key="item.id">
          <a-button class="del-btn" @click="handleDeleteImg(item.id,item.type,index)" type="primary">
            <a-icon type="delete" />
          </a-button>
          <img :src="item.src" alt="">
        </div>
      </div>
      <div class="photo-item">
        <label>术中</label>
        <div class="upload-img-btn">
          <a-upload
            listType="picture-card"
            class="avatar-uploader"
            :showUploadList="false"
            accept="image/*"
            :customRequest="intraImgUpload"
          >
            <div>
              <a-icon type="plus" />
              <div class="ant-upload-text">上传</div>
            </div>
          </a-upload>
        </div>
        <div class="items-list" v-for="(item, index) in intraImageData" :key="item.id">
          <a-button class="del-btn" @click="handleDeleteImg(item.id,item.type,index)" type="primary">
            <a-icon type="delete" />
          </a-button>
          <img :src="item.src" alt="">
        </div>
      </div>
      <div class="photo-item">
        <label>术后</label>
        <div class="upload-img-btn">
          <a-upload
            listType="picture-card"
            class="avatar-uploader"
            :showUploadList="false"
            accept="image/*"
            :customRequest="afterImgUpload"
          >
            <div>
              <a-icon type="plus" />
              <div class="ant-upload-text">上传</div>
            </div>
          </a-upload>
        </div>
        <div class="items-list" v-for="(item, index) in afterImageData" :key="item.id">
          <a-button class="del-btn" @click="handleDeleteImg(item.id,item.type,index)" type="primary">
            <a-icon type="delete" />
          </a-button>
          <img :src="item.src" alt="">
        </div>
      </div>
    </div>
    <div class="btn-list">
      <a-button type="primary" @click="handleUpload">确定</a-button>
      <a-button type="primary" @click="resetForm" style="margin-left: 15px;">重置</a-button>
    </div>
  </div>
</template>
<script>
  // const allZdData = ['头部','脸部','腿部','胳膊'];//所有诊断数据
  // const allSsfsData = ['开刀','切割'];//所有手术方式数据
  // const allZlfsData = ['药物治疗','手术'];//所有治疗方式数据
  // const allZljgData = ['好转','出院','安全康复']// 所有治疗结果数据
  const conf = require('../../assets/common/config')
  export default {
    data() {
      return {
        hospitalNum: '', //住院号
        allCaseData: [],//医生信息
        caseData: [],//所有医生信息
        currentCaseName: [],
        currentCaseId: "", // 默认医生信息
        allZdData: [],//诊断部位数据
        zdData: [],//当前选择诊断部位数据
        allSsfsData: [],//所有手术方式数据
        ssfsData: [],//当前选中手术方式
        allZlfsData: [],//所有治疗方式数据
        zlfsData:[],//当前选中治疗方式
        allZljgData: [],//所有治疗结果数据
        zljgData: [],//当前选中治疗结果
        patientName: '',//病人姓名
        sex: 0, // 病人性别
        age: '',
        photoNum: '', // 联系方式
        ryDate: '', // 入院日期
        ryDetailDate: '',
        remarks: '', // 备注
        fileList: [],
        floderName: '',
        patientId: '',//病人id
        preImageData: [],//术前图片文件对象
        intraImageData: [],
        afterImageData: [],
        allImageData: [],
        src: '',
        imgNumber: 0,
        isLoadingImg: false
      };
    },
    mounted() {
      this.getCaseData(); // 获取所有医生信息
      this.getDiagnosisData();//获取所有诊断数据
      this.getOperationData();// 获取所有手术方式数据
      this.getTreatmentMethodData();// 获取所有治疗方式数据
      this.getTreatmentOutcomeData();
    },
    methods: {
      // 获取所有医生信息
      getCaseData() {
        const self = this;
        self.$http.get('/doctor/all').then((res) => {
          if(res.status === 200) {
            const data = res.data;
            data.forEach((item) => {
              self.caseData.push(item.doctorName);
            });
            self.allCaseData = data;
          }
        }).catch(() => {
          self.$message.error('请求失败');
        });
      },
      // 获取所有诊断数据
      getDiagnosisData() {
        const self = this;
        this.$http.get('/dictionary/DIAGNOSIS_TYPE').then((res) => {
          if(res.status === 200) {
            const data = res.data;
            self.allZdData = [];
            data.forEach((item) => {
              self.allZdData.push(item.value);
            });
          }
        }).catch(() => {
          self.$message.error('请求失败');
        });
      },
      //获取所有手术方式数据
      getOperationData() {
        const self = this;
        this.$http.get('/dictionary/OPERATION_NAME_TYPE').then((res) => {
          if(res.status === 200) {
            const data = res.data;
            self.allSsfsData = [];
            data.forEach((item) => {
              self.allSsfsData.push(item.value);
            });
          }
        }).catch(() => {
          self.$message.error('请求失败');
        });
      },
      // 获取所有治疗方式数据
      getTreatmentMethodData() {
        const self = this;
        this.$http.get('/dictionary/TREATMENT_METHOD_TYPE').then((res) => {
          if(res.status === 200) {
            const data = res.data;
            self.allZlfsData = [];
            data.forEach((item) => {
              self.allZlfsData.push(item.value);
            });
          }
        }).catch(() => {
          self.$message.error('请求失败');
        });
      },
      //获取所有治疗结果数据
      getTreatmentOutcomeData() {
        const self = this;
        this.$http.get('/dictionary/TREATMENT_OUTCOME_TYPE').then((res) => {
          if(res.status === 200) {
            const data = res.data;
            self.allZljgData = [];
            data.forEach((item) => {
              self.allZljgData.push(item.value);
            });
          }
        }).catch(() => {
          self.$message.error('请求失败');
        });
      },
      // 处理上传
      handleUploadChange () {
      },
      beforeUpload (file) {
        const self = this;
        if(self.floderName === '') {
          self.preImageData = [];
          self.intraImageData = [];
          self.afterImageData = [];
          self.allImageData = [];
          self.floderName = file.webkitRelativePath.split('/')[0].split(conf.folderNameSeparator);
          self.patientId = self.floderName[0];
          self.floderName.forEach((item, index) => {
            self.floderName[index] = item.trim().replace('岁','');
          });
          self.floderName = self.floderName.join(conf.folderNameSeparator);
          self.uploadPatientName(self.floderName);
        }
      },
      customRequest(file) {
        const self = this;
        if(file.file.name.indexOf('DS_Store') === -1) {
          self.allImageData.push(file);
        }
      },
      uploadAllImage () {
        const self = this;
        self.isLoadingImg = true;
        self.allImageData.forEach(async (file) => {
          const subName = file.file.webkitRelativePath.split('/')[1];
          let type = '';
          switch(subName) {
            case '术前':
              type = 'PRE_OPERATIVE_IMAGE_TYPE';
              break;
            case '术中':
              type = 'INTRA_OPERATIVE_IMAGE_TYPE';
              break;
            case '术后':
              type = 'POST_OPERATIVE_IMAGE_TYPE';
              break;
          }
          const formData = new FormData();
          formData.append('image', file.file);
          formData.append('type', type);
          formData.append('caseNo', self.patientId);
       
          self.$http.post('/image', formData,)
          .then((res) => {
            const data = res.data;
            self.src = 'data:image/png;base64,' + data.image;
            const obj = {
              src: 'data:image/png;base64,' + data.image,
              type: data.imageType,
              id: data.imageUid
            };
            if(data.imageType === "intraOperative") {
              self.intraImageData.push(obj);
            } else if(data.imageType === "preOperative") {
              self.preImageData.push(obj);
            } else if(data.imageType === "postOperative") {
              self.afterImageData.push(obj);
            }
            self.clearImgData();
          }).catch((err) => {
            self.clearImgData();
            console.log(err);
          });
        });
      },
      //上传病人信息
      async uploadPatientName (floderName) {
        console.log(floderName);
        const self = this;
        await self.$http.put('/patientcase/' + floderName)
        .then(function(res) {
          if(res.status == 200) {
            self.floderName = '';
            // const data = res.data;
            // self.hospitalNum = data.caseNo;// 住院号
            // self.patientId = data.caseNo; // id
            // self.patientName = data.patientName; //姓名
            // self.sex = data.patientGender === '男' ? 0 : 1;
            // self.age = data.patientAge; // 年龄
            // self.zdData = [];
            // self.zdData.push(data.diagnosis);// 诊断
            // self.ssfsData = [];
            // self.ssfsData.push(data.operationName); // 手术方式
            // 获取病人信息
            self.getPatientInfo();
          }
        }).catch((err) => {
          self.floderName = '';
          if (err.response) {
            self.$message.error(err.response.data.message);
          } else {
            self.$message.error('上传文件夹命名不规范，请重新上传');
          }
        });
      },
      // 获取病人信息
      getPatientInfo() {
        const self = this;
        self.$http.get('/patientcase/' + self.patientId).then((res) => {
          if(res.status === 200) {
            const data = res.data;
            self.hospitalNum = data.caseNo;// 住院号
            self.patientId = data.caseNo; // id
            self.patientName = data.patientName; //姓名
            self.sex = data.patientGender === '男' ? 0 : 1;
            self.age = data.patientAge; // 年龄
            self.zdData = [];
            data.diagnosis.forEach((item) => {
              self.zdData.push(item.dictionaryValue);// 诊断
            })
            self.ssfsData = [];
            data.operationName.forEach((item) => {
              self.ssfsData.push(item.dictionaryValue); // 手术方式
            })
            self.uploadAllImage();
          }
        }).catch(() => {
          self.$message.error('请求失败');
        });
      },
      // 选择主治医师
      handleCaseChange(index) {
        const self = this;
        // self.currentCaseId = self.allCaseData[index].doctorId;
        self.allCaseData.forEach((item) => {
          if(item.doctorName === index) {
            self.currentCaseId = item.doctorId;
          }
        })
        self.currentCaseName = [];
        // self.currentCaseName.push(self.allCaseData[index].doctorName);
        self.currentCaseName.push(index);
      },
      // 诊断部位选择
      handleZdbwChange(selectedItems) {
        this.zdData = selectedItems;
      },
      // 手术方式
      handleSsfsChange(item) {
        const self = this;
        self.ssfsData = item;
      },
      // 治疗方式
      handleZlfsChange(item) {
        this.zlfsData = item;
      },
      //治疗结果
      handleZljgChange(item) {
        this.zljgData = item;
      },
      // 入院日期 
      onDateChange(item, datestring) {
        this.ryDate = item;
        this.ryDetailDate = datestring;
      },
      // 点击确定
      handleUpload() {
        const self = this;
        // 上传信息
        const params = {
          "admissionDate": self.ryDetailDate,
          "attendingDoctorId": self.currentCaseId,
          "caseNo": self.patientId,
          "diagnosis": self.zdData,
          "operationName": self.ssfsData,
          "patientAge": self.age,
          "patientGender": self.sex == 0 ? '男' : '女',
          "patientName": self.patientName,
          "phoneNumber": self.photoNum,
          "treatmentMethod": self.zlfsData,
          "treatmentOutcome": self.zljgData
        };
        if(params.admissionDate === '') {
          self.$message.error('请输入入院日期');
          return false;
        }
        if(params.attendingDoctorId === '') {
          self.$message.error('请选择主治医生');
          return false;
        }
        if(params.diagnosis.length === 0) {
          self.$message.error('请选择诊断部位');
          return false;
        }
        if(params.operationName.length === 0) {
          self.$message.error('请选择手术方式');
          return false;
        }
        if(params.patientName === '') {
          self.$message.error('请输入病人姓名');
          return false;
        }
        if(params.phoneNumber === '') {
          self.$message.error('请输入病人联系电话');
          return false;
        }
        if(params.treatmentMethod.length === 0) {
          self.$message.error('请选择治疗方式');
          return false;
        }
        if(params.treatmentOutcome.length === 0) {
          self.$message.error('请选择治疗结果');
          return false;
        }
        self.$http.post('/patientcase/addition', params)
        .then(() => {
          self.resetForm();
          self.$message.success('上传成功');
          window.scrollTo(0, 0);
          self.getDiagnosisData();//获取所有诊断数据
          self.getOperationData();// 获取所有手术方式数据
          self.getTreatmentMethodData();// 获取所有治疗方式数据
          self.getTreatmentOutcomeData();
        }).catch((err) => {
          console.log(err);
        });
      },
      //清除上传文件夹上传图片数据
      clearImgData() {
        const self = this;
        self.imgNumber += 1;
        if(self.imgNumber === self.allImageData.length) {
          self.allImageData = [];
          self.imgNumber = 0;
          self.isLoadingImg = false;
        }
      },
      //术前照片上传
      beforeImgUpload(file) {
        const self = this;
        self.isLoadingImg = true;
        const formData = new FormData();
        formData.append('image', file.file);
        formData.append('type', 'PRE_OPERATIVE_IMAGE_TYPE');
        formData.append('caseNo', self.patientId);
        self.$http.post('/image', formData)
        .then((res) => {
          const data = res.data;
          self.src = 'data:image/png;base64,' + data.image;
          const obj = {
            src: 'data:image/png;base64,' + data.image,
            type: data.imageType,
            id: data.imageUid
          };
          self.preImageData.push(obj);
          self.isLoadingImg = false;
        }).catch((err) => {
          console.log(err);
        });
      },
      intraImgUpload(file) {
        const self = this;
        self.isLoadingImg = true;
        const formData = new FormData();
        formData.append('image', file.file);
        formData.append('type', 'INTRA_OPERATIVE_IMAGE_TYPE');
        formData.append('caseNo', self.patientId);
        self.$http.post('/image', formData)
        .then((res) => {
          self.isLoadingImg = false;
          const data = res.data;
          self.src = 'data:image/png;base64,' + data.image;
          const obj = {
            src: 'data:image/png;base64,' + data.image,
            type: data.imageType,
            id: data.imageUid
          };
          self.intraImageData.push(obj);
        }).catch((err) => {
          console.log(err);
        });
      },
      afterImgUpload(file) {
        const self = this;
        self.isLoadingImg = true;
        const formData = new FormData();
        formData.append('image', file.file);
        formData.append('type', 'POST_OPERATIVE_IMAGE_TYPE');
        formData.append('caseNo', self.patientId);
        self.$http.post('/image', formData)
        .then((res) => {
          self.isLoadingImg = false;
          const data = res.data;
          self.src = 'data:image/png;base64,' + data.image;
          const obj = {
            src: 'data:image/png;base64,' + data.image,
            type: data.imageType,
            id: data.imageUid
          };
          self.afterImageData.push(obj);

        }).catch((err) => {
          console.log(err);
        });
      },
      //删除图片
      handleDeleteImg(uuid, type, index) {
        const self = this;
        let arr = [];
        arr[0] = uuid;
        const params = {
          uuids: arr
        }
        self.$http.post('/image/multipleDelete', params)
        .then(() => {
          if(type === "intraOperative") {
            self.intraImageData.splice(index, 1);
          } else if(type === "preOperative") {
            self.preImageData.splice(index, 1);
          } else if(type === "postOperative") {
            self.afterImageData.splice(index, 1);
          }
          self.$message.success('删除成功');
        }).catch((err) => {
          console.log(err);
          self.$message.error('删除失败');
        });
      },
      resetForm() {
        this.hospitalNum = ''; //住院号
        this.currentCaseId = ""; // 默认医生信息
        this.currentCaseName = [];
        this.zdData =  [];//当前选择诊断部位数据
        this.ssfsData =  [];//当前选中手术方式
        this.zlfsData = [];//当前选中治疗方式
        this.zljgData =  [];//当前选中治疗结果
        this.patientName =  '';//病人姓名
        this.sex =  0; // 病人性别
        this.age =  '';
        this.photoNum =  ''; // 联系方式
        this.ryDate =  ''; // 入院日期
        this.ryDetailDate = '';
        this.remarks =  ''; // 备注
        this.fileList =  [];
        this.floderName =  '';
        this.patientId =  '';//病人id
        this.preImageData =  [];//术前图片文件对象
        this.intraImageData =  [];
        this.afterImageData =  [];
        this.allImageData =  [];
        this.imgNumber =  0;
        this.isLoadingImg = false;
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
  .upload-box {
    .ant-upload-list {
      display: none !important;
    }
  }
  .photo-box {
    .photo-item {
      .ant-upload {
        margin-top: 45px;
        .anticon-plus{
          font-size: 36px;
        }
      }
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
    position: relative;
    .mask {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background-color: rgba(0,0,0,.3);
      text-align: center;
      z-index: 9999;
      .spin-icon {
        top: 45%;
        position: relative;
      }
      .upload-explain {
        margin-top: 200px;
        color: #ddd;
        font-size: 20px;
      }
    }
    .photo-item {
      padding-left: 100px;
      margin-top: 15px;
      min-height: 200px;
      overflow: hidden;
      label {
        width: 100px;
        display: block;
        margin-left: -100px;
        text-align: center;
        float: left;
        position: relative;
        top: 80px;
        left: -10px;
      }
      img {
        margin-left: 20px;
        width: 200px;
        height: 200px;
      }
      .upload-img-btn {
        float: left;
        width: 102px;
        height: 102px;
      }
      .items-list {
        float: left;
        width: 200px;
        height: 200px;
        position: relative;
        margin-left: 15px;
        cursor: pointer;
        &:hover {
          .del-btn {
            display: block;
          }
        }
        .del-btn {
          position: absolute;
          top: 10px;
          right: 0;
          display: none;
          width: 20px !important;
          .anticon{
            position: relative;
            left: -7px;
          }
        }
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
