<template>
<div class='patient-content'>
    <p class="head-title">
        <span>患者信息登记</span>
    </p>
    <div class="upload-box">
        <a-upload-dragger name="file" directory :beforeUpload="beforeUpload" :customRequest='customRequest' @change="handleUploadChange">
            <p class="ant-upload-drag-icon">
                <a-icon type="inbox" />
            </p>
            <p class="ant-upload-text">点击此区域进行上传</p>
        </a-upload-dragger>
    </div>
    <div class="form-box">
        <a-row :gutter="16">
            <a-col class="gutter-row" :span="8">
                <div class="gutter-box">
                    <label class="label">住院号</label>
                    <a-input placeholder="请输入住院号" v-model='hospitalNum' disabled style="color:'#333'" />
                </div>
            </a-col>
            <a-col class="gutter-row" :span="8">
                <div class="gutter-box">
                    <label class="label">主治医师</label>
                    <a-select style="width:100%;" @change="handleCaseChange" :value="currentCaseName" placeholder="请选择主治医生">
                        <a-select-option v-for="(item, index) in caseData" :key="index" :value="item">{{item}}</a-select-option>
                    </a-select>
                </div>
            </a-col>
            <a-col class="gutter-row" :span="8">
                <div class="gutter-box">
                    <label class="label">患者姓名</label>
                    <a-input placeholder="请输入患者姓名" v-model='patientName' />
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
                    <label class="label">患者年龄</label>
                    <a-input placeholder="请输入患者年龄" v-model='age' />
                </div>
            </a-col>
            <a-col class="gutter-row" :span="8">
                <div class="gutter-box">
                    <label class="label">诊断</label>
                    <a-select mode="tags" style="width: 100%" @change="handleZdbwChange" placeholder="请选择诊断部位" :defaultValue="zdData" :value="zdData">
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
                    <label class="label">手术名称</label>
                    <a-select mode="tags" style="width: 100%" @change="handleSsfsChange" placeholder="请选择手术名称" :value="ssfsData">
                        <a-select-option v-for="(item, index) in allSsfsData" :key="index" :value="item">
                            {{item}}
                        </a-select-option>
                    </a-select>
                </div>
            </a-col>
            <a-col class="gutter-row" :span="8">
                <div class="gutter-box">
                    <label class="label">治疗方式</label>
                    <a-select mode="tags" style="width: 100%" @change="handleZlfsChange" placeholder="请选择治疗方式" :defaultValue="zlfsData" :value="zlfsData">
                        <a-select-option v-for="(item, index) in allZlfsData" :key="index" :value="item">
                            {{item}}
                        </a-select-option>
                    </a-select>
                </div>
            </a-col>
            <a-col class="gutter-row" :span="8">
                <div class="gutter-box">
                    <label class="label">治疗结果</label>
                    <a-select mode="tags" style="width: 100%" @change="handleZljgChange" placeholder="请选择治疗结果" :defaultValue="zljgData" :value="zljgData">
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
                    <a-input placeholder="请输入联系电话" v-model="photoNum" type="number" />
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

                    <a-textarea v-model="remarks" placeholder="请添加备注" :autoSize="{ minRows: 2, maxRows: 5 }" />
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
            <a-button type="primary" v-show="personId !== ''" @click="handleAddFloder('PRE_OPERATIVE_IMAGE_TYPE')" class="add-floder">新增批次</a-button>
            <!-- <a-button type="primary" @click="handleEditFloder('before')" class="edit-floder">修改批次</a-button> -->
            <a-tabs v-model="preBath" defaultActiveKey="根目录" v-show="preImageTabs.length > 0">
                <a-tab-pane v-for="(items) in preImageTabs" :key="items" :tab="items">
                    <div class="upload-img-btn" v-show="personId !== ''">
                        <a-upload listType="picture-card" class="avatar-uploader" :showUploadList="false" accept="image/*" :customRequest="beforeImgUpload">
                            <div>
                                <a-icon type="plus" />
                                <div class="ant-upload-text">上传</div>
                            </div>
                        </a-upload>
                    </div>
                    <div class="items-list" v-for="(item, indexs) in preImageData" :key="item.id" v-show="item.bath === items">
                        <a-button class="del-btn" @click="handleDeleteImg(item.id,item.type,indexs)" type="primary">
                            <a-icon type="delete" />
                        </a-button>
                        <img :src="item.src" alt="" @click="handleShowImage(preImageData)">
                    </div>
                </a-tab-pane>
            </a-tabs>
        </div>
        <div class="photo-item">
            <label>术中</label>
            <a-button type="primary" class="add-floder" v-show="personId !== ''" @click="handleAddFloder('INTRA_OPERATIVE_IMAGE_TYPE')">新增批次</a-button>
            <!-- <a-button type="primary" @click="handleEditFloder('intra')" class="edit-floder">修改批次</a-button> -->
            <a-tabs v-model="intraBath" defaultActiveKey="根目录" @change="callback" v-show="intraImageTabs.length > 0">
                <a-tab-pane v-for="(items) in intraImageTabs" :key="items" :tab="items">
                    <div class="upload-img-btn" v-show="personId !== ''">
                        <a-upload listType="picture-card" class="avatar-uploader" :showUploadList="false" accept="image/*" :customRequest="intraImgUpload">
                            <div>
                                <a-icon type="plus" />
                                <div class="ant-upload-text">上传</div>
                            </div>
                        </a-upload>
                    </div>
                    <div class="items-list" v-for="(item, indexs) in intraImageData" :key="item.id" v-show="item.bath === items">
                        <a-button class="del-btn" @click="handleDeleteImg(item.id,item.type,indexs)" type="primary">
                            <a-icon type="delete" />
                        </a-button>
                        <img :src="item.src" alt="" @click="handleShowImage(intraImageData)">
                    </div>
                </a-tab-pane>
            </a-tabs>
        </div>
        <div class="photo-item">
            <label>术后</label>
            <a-button type="primary" class="add-floder" v-show="personId !== ''" @click="handleAddFloder('POST_OPERATIVE_IMAGE_TYPE')">新增批次</a-button>
            <!-- <a-button type="primary" @click="handleEditFloder('after')" class="edit-floder">修改批次</a-button> -->
            <a-tabs v-model="afterBath" defaultActiveKey="根目录" v-show="afterImageTabs.length > 0">
                <a-tab-pane v-for="(items) in afterImageTabs" :key="items" :tab="items">
                    <div class="upload-img-btn" v-show="personId !== ''">
                        <a-upload listType="picture-card" class="avatar-uploader" :showUploadList="false" accept="image/*" :customRequest="afterImgUpload">
                            <div>
                                <a-icon type="plus" />
                                <div class="ant-upload-text">上传</div>
                            </div>
                        </a-upload>
                    </div>
                    <div class="items-list" v-for="(item, indexs) in afterImageData" :key="item.id" v-show="item.bath === items">
                        <a-button class="del-btn" @click="handleDeleteImg(item.id,item.type,indexs)" type="primary">
                            <a-icon type="delete" />
                        </a-button>
                        <img :src="item.src" alt="" @click="handleShowImage(afterImageData)">
                    </div>
                </a-tab-pane>
            </a-tabs>
        </div>
    </div>
    <div class="btn-list">
        <a-button type="primary" @click="handleUpload" :disabled="isLoadingImg">确定</a-button>
        <a-button type="primary" @click="resetForm(true)" style="margin-left: 15px;" :disabled="isLoadingImg">取消</a-button>
    </div>
    <a-modal title="新增批次" :visible="addFloderVisible" :width='1000' @cancel="closeDialog" @ok="handleAddFloderData" :maskClosable='false' style="top: 20px;" :destroyOnClose="true">
        <div class="dialog-content">
            <p class="input-panel">
                <label>名称：</label>
                <a-input placeholder="请输入批次名称" v-model="dialogObj.name" :disabled="dialogObj.imgdata.length !== 0" style="width: 280px;" />
            </p>
            <div class="img-list">
                <div class="mask" v-show="dialogLoading">
                    <a-spin tip="图片加载中请稍等..." size="large" class="spin-icon">
                    </a-spin>
                </div>
                <a-row :gutter="16">
                    <a-col :span="8" v-for="(item, index) in dialogObj.imgdata" :key="index">
                        <div class="img-item" style="text-align:center;">
                            <a-button class="del-btn" @click="handleDeleteDialogImg(item.id,item.type,indexs)" type="primary">
                                <a-icon type="delete" />
                            </a-button>
                            <img :src="item.src" alt="" style="width: 200px;height:200px;">
                        </div>
                    </a-col>
                    <a-col :span="8">
                        <div class="upload-img-btn" style="margin-top: 45px;margin-left: 40px;">
                            <a-upload listType="picture-card" class="avatar-uploader" :showUploadList="false" accept="image/*" :customRequest="addDialogImage" :multiple="true">
                                <div>
                                    <a-icon type="plus" style="font-size: 34px;" />
                                    <div class="ant-upload-text">上传</div>
                                </div>
                            </a-upload>
                        </div>
                    </a-col>
                </a-row>
            </div>
        </div>
    </a-modal>
    <a-modal title="修改批次" :visible="editFloderVisible" :width='600' @cancel="closeEditDialog" @ok="handleEditFloderData" :maskClosable='false' style="top: 20px;" :destroyOnClose="true">
        <div class="edit-content">
            <ul style="list-style:none;margin-left: 30px;">
                <li v-for="(item, index) in editData" :key="index" style="margin-bottom: 10px;">
                    <a-input :value="item" style="color:'#333';width: 260px;" />
                    <a-button type="primary" style="margin-left: 15px;">删除</a-button>
                </li>
            </ul>
        </div>
    </a-modal>
    <viewer ref="viewer" :images="imagesList" v-show="false">
        <img v-for="(item, index) in imagesList" :src="item.src" :key="index">
    </viewer>
</div>
</template>

<script>
// const allZdData = ['头部','脸部','腿部','胳膊'];//所有诊断数据
// const allSsfsData = ['开刀','切割'];//所有手术名称数据
// const allZlfsData = ['药物治疗','手术'];//所有治疗方式数据
// const allZljgData = ['好转','出院','安全康复']// 所有治疗结果数据
const conf = require('../../assets/common/config')
export default {
    data() {
        return {
            flag: true,
            personId: '',
            hospitalNum: '', //住院号
            allCaseData: [], //医生信息
            caseData: [], //所有医生信息
            currentCaseName: [],
            currentCaseId: "", // 默认医生信息
            allZdData: [], //诊断部位数据
            zdData: [], //当前选择诊断部位数据
            allSsfsData: [], //所有手术名称数据
            ssfsData: [], //当前选中手术名称
            allZlfsData: [], //所有治疗方式数据
            zlfsData: [], //当前选中治疗方式
            allZljgData: [], //所有治疗结果数据
            zljgData: [], //当前选中治疗结果
            patientName: '', //患者姓名
            sex: 0, // 患者性别
            age: '',
            photoNum: '', // 联系方式
            ryDate: '', // 入院日期
            ryDetailDate: '',
            remarks: '', // 备注
            fileList: [],
            floderName: '',
            patientId: '', //患者id
            preImageData: [], //术前图片文件对象
            intraImageData: [],
            afterImageData: [],
            preImageTabs: ['根目录'],
            intraImageTabs: ['根目录'],
            afterImageTabs: ['根目录'],
            allImageData: [],
            src: '',
            imgNumber: 0,
            isLoadingImg: false,
            addFloderVisible: false,
            dialogObj: {
                name: '',
                imgdata: [],
            },
            preBath: '根目录',
            intraBath: '根目录',
            afterBath: '根目录',
            activeType: '',
            dialogLoading: false,
            imagesList: [],
            editFloderVisible: false,
            editType: '',
            editData: [],
        };
    },
    mounted() {
        this.getCaseData(); // 获取所有医生信息
        this.getDiagnosisData(); //获取所有诊断数据
        this.getOperationData(); // 获取所有手术名称数据
        this.getTreatmentMethodData(); // 获取所有治疗方式数据
        this.getTreatmentOutcomeData();
    },
    beforeDestroy() {
        if (self.personId !== '') {
            this.deleteCaseInfo();
        }
    },
    methods: {
        // 获取所有医生信息
        getCaseData() {
            const self = this;
            self.$http.get('/swing/doctor/all').then((res) => {
                if (res.status === 200) {
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
            this.$http.get('/swing/dictionary/DIAGNOSIS_TYPE').then((res) => {
                if (res.status === 200) {
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
        //获取所有手术名称数据
        getOperationData() {
            const self = this;
            this.$http.get('/swing/dictionary/OPERATION_NAME_TYPE').then((res) => {
                if (res.status === 200) {
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
            this.$http.get('/swing/dictionary/TREATMENT_METHOD_TYPE').then((res) => {
                if (res.status === 200) {
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
            this.$http.get('/swing/dictionary/TREATMENT_OUTCOME_TYPE').then((res) => {
                if (res.status === 200) {
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
        handleUploadChange() {},
        async beforeUpload(file) {
            const self = this;
            if (self.floderName === '') {
                self.preImageData = [];
                self.intraImageData = [];
                self.afterImageData = [];
                self.allImageData = [];
                self.floderName = file.webkitRelativePath.split('/')[0].split(conf.folderNameSeparator);
                self.patientId = self.floderName[0];
                self.floderName = self.floderName.join(conf.folderNameSeparator);
                self.uploadPatientName(self.floderName);
            } else {
                if (self.personId !== '' && self.flag) {
                    console.log('123333');
                    self.flag = false;
                    const params = {
                        patientCaseIds: [self.personId]
                    };
                    self.$http.post('/swing/patientcase/multipleDelete', params)
                        .then(() => {
                            // self.tableData.splice(self.currentIndex, 1);
                            debugger;
                            self.$http.delete('/swing/image/' + self.hospitalNum + '/' + self.personId)
                                .then(() => {
                                    self.personId = '';
                                    self.hospitalNum = '';
                                    console.log('删除成功');
                                    // 上传
                                    self.preImageData = [];
                                    self.intraImageData = [];
                                    self.afterImageData = [];
                                    self.allImageData = [];
                                    self.floderName = file.webkitRelativePath.split('/')[0].split(conf.folderNameSeparator);
                                    self.patientId = self.floderName[0];
                                    self.floderName = self.floderName.join(conf.folderNameSeparator);
                                    self.uploadPatientName(self.floderName);
                                })
                        }).catch((err) => {
                            console.log(err);
                            self.$message.error('删除失败');
                        });
                }
            }
        },
        customRequest(file) {
            const self = this;
            if (file.file.name.indexOf('DS_Store') === -1) {
                self.allImageData.push(file);
                console.log(file.file.webkitRelativePath.split('/'));
            }
        },
        uploadAllImage() {
            const self = this;
            self.isLoadingImg = true;
            self.allImageData.forEach(async (file) => {
                const subName = file.file.webkitRelativePath.split('/')[1];
                const subfloderName = file.file.webkitRelativePath.split('/')[2];
                let type = '';
                let bath = '';
                switch (subName) {
                    case '术前':
                        type = 'PRE_OPERATIVE_IMAGE_TYPE';
                        if (subfloderName.indexOf('.') === -1) {
                            bath = subfloderName;
                            if (self.preImageTabs.indexOf(subfloderName) === -1) {
                                self.preImageTabs.push(subfloderName);
                            }
                        }
                        break;
                    case '术中':
                        type = 'INTRA_OPERATIVE_IMAGE_TYPE';
                        if (subfloderName.indexOf('.') === -1) {
                            bath = subfloderName;
                            if (self.intraImageTabs.indexOf(subfloderName) === -1) {
                                self.intraImageTabs.push(subfloderName);
                            }
                        }
                        break;
                    case '术后':
                        type = 'POST_OPERATIVE_IMAGE_TYPE';
                        if (subfloderName.indexOf('.') === -1) {
                            bath = subfloderName;
                            if (self.afterImageTabs.indexOf(subfloderName) === -1) {
                                self.afterImageTabs.push(subfloderName);
                            }
                        }
                        break;
                }
                const formData = new FormData();
                formData.append('image', file.file);
                formData.append('type', type);
                formData.append('caseNo', self.patientId);
                formData.append('caseId', self.personId);
                formData.append('bath', bath);

                self.$http.post('/swing/image', formData, )
                    .then((res) => {
                        const data = res.data;
                        self.src = 'data:image/png;base64,' + data.image;
                        const obj = {
                            src: 'data:image/png;base64,' + data.image,
                            type: data.imageType,
                            id: data.imageUid,
                            bath: data.bath,
                        };
                        if (data.imageType === "intraOperative") {
                            self.intraImageData.push(obj);
                        } else if (data.imageType === "preOperative") {
                            self.preImageData.push(obj);
                        } else if (data.imageType === "postOperative") {
                            self.afterImageData.push(obj);
                        }
                        self.clearImgData();
                    }).catch((err) => {
                        self.clearImgData();
                        console.log(err);
                    });
            });
        },
        //上传患者信息
        async uploadPatientName(floderName) {
            console.log(floderName);
            const self = this;
            const url = encodeURIComponent(floderName);
            await self.$http.put('/swing/patientcase/' + url)
                .then(function (res) {
                    if (res.status == 200) {
                        // self.floderName = '';
                        debugger;
                        self.personId = res.data.caseId;
                        self.hospitalNum = res.data.caseNo;
                        // const data = res.data;
                        // self.hospitalNum = data.caseNo;// 住院号
                        // self.patientId = data.caseNo; // id
                        // self.patientName = data.patientName; //姓名
                        // self.sex = data.patientGender === '男' ? 0 : 1;
                        // self.age = data.patientAge; // 年龄
                        // self.zdData = [];
                        // self.zdData.push(data.diagnosis);// 诊断
                        // self.ssfsData = [];
                        // self.ssfsData.push(data.operationName); // 手术名称
                        // 获取患者信息
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
        // 获取患者信息
        getPatientInfo() {
            const self = this;
            self.$http.get('/swing/patientcase/' + self.personId).then((res) => {
                if (res.status === 200) {
                    const data = res.data;
                    self.hospitalNum = data.caseNo; // 住院号
                    self.patientId = data.caseNo; // id
                    self.patientName = data.patientName; //姓名
                    self.sex = data.patientGender === '男' ? 0 : 1;
                    self.age = data.patientAge; // 年龄
                    self.photoNum = data.phoneNumber; //手机号
                    self.zdData = [];
                    data.diagnosis.forEach((item) => {
                        self.zdData.push(item.dictionaryValue); // 诊断
                    })
                    self.ssfsData = [];
                    data.operationName.forEach((item) => {
                        self.ssfsData.push(item.dictionaryValue); // 手术名称
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
                if (item.doctorName === index) {
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
        // 手术名称
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
                "treatmentOutcome": self.zljgData,
                "caseComment": self.remarks,
                "id": self.personId
            };
            // if(params.admissionDate === '') {
            //   self.$message.error('请输入入院日期');
            //   return false;
            // }
            // if(params.attendingDoctorId === '') {
            //   self.$message.error('请选择主治医生');
            //   return false;
            // }
            // if(params.diagnosis.length === 0) {
            //   self.$message.error('请选择诊断部位');
            //   return false;
            // }
            // if(params.operationName.length === 0) {
            //   self.$message.error('请选择手术名称');
            //   return false;
            // }
            if (params.patientName === '') {
                self.$message.error('请输入患者姓名');
                return false;
            }
            // if(params.phoneNumber === '') {
            //   self.$message.error('请输入患者联系电话');
            //   return false;
            // }
            // if(params.treatmentMethod.length === 0) {
            //   self.$message.error('请选择治疗方式');
            //   return false;
            // }
            // if(params.treatmentOutcome.length === 0) {
            //   self.$message.error('请选择治疗结果');
            //   return false;
            // }
            self.$http.post('/swing/patientcase/addition', params)
                .then(() => {
                    self.resetForm();
                    self.personId = '';
                    self.hospitalNum = ''; //住院号
                    self.$message.success('上传成功');
                    window.scrollTo(0, 0);
                    self.getDiagnosisData(); //获取所有诊断数据
                    self.getOperationData(); // 获取所有手术名称数据
                    self.getTreatmentMethodData(); // 获取所有治疗方式数据
                    self.getTreatmentOutcomeData();
                }).catch((err) => {
                    console.log(err);
                });
        },
        //清除上传文件夹上传图片数据
        clearImgData() {
            const self = this;
            self.imgNumber += 1;
            if (self.imgNumber === self.allImageData.length) {
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
            formData.append('caseId', self.personId);
            formData.append('bath', self.preBath);
            self.$http.post('/swing/image', formData)
                .then((res) => {
                    const data = res.data;
                    self.src = 'data:image/png;base64,' + data.image;
                    const obj = {
                        src: 'data:image/png;base64,' + data.image,
                        type: data.imageType,
                        id: data.imageUid,
                        bath: data.bath,
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
            formData.append('caseId', self.personId);
            formData.append('bath', self.intraBath);
            self.$http.post('/swing/image', formData)
                .then((res) => {
                    self.isLoadingImg = false;
                    const data = res.data;
                    self.src = 'data:image/png;base64,' + data.image;
                    const obj = {
                        src: 'data:image/png;base64,' + data.image,
                        type: data.imageType,
                        id: data.imageUid,
                        bath: data.bath,
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
            formData.append('caseId', self.personId);
            formData.append('bath', self.afterBath);
            self.$http.post('/swing/image', formData)
                .then((res) => {
                    self.isLoadingImg = false;
                    const data = res.data;
                    self.src = 'data:image/png;base64,' + data.image;
                    const obj = {
                        src: 'data:image/png;base64,' + data.image,
                        type: data.imageType,
                        id: data.imageUid,
                        bath: data.bath,
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
            self.$http.post('/swing/image/multipleDelete', params)
                .then(() => {
                    if (type === "intraOperative") {
                        self.intraImageData.splice(index, 1);
                    } else if (type === "preOperative") {
                        self.preImageData.splice(index, 1);
                    } else if (type === "postOperative") {
                        self.afterImageData.splice(index, 1);
                    }
                    self.$message.success('删除成功');
                }).catch((err) => {
                    console.log(err);
                    self.$message.error('删除失败');
                });
        },
        resetForm(flag) {
            this.currentCaseId = ""; // 默认医生信息
            this.currentCaseName = [];
            this.zdData = []; //当前选择诊断部位数据
            this.ssfsData = []; //当前选中手术名称
            this.zlfsData = []; //当前选中治疗方式
            this.zljgData = []; //当前选中治疗结果
            this.patientName = ''; //患者姓名
            this.sex = 0; // 患者性别
            this.age = '';
            this.photoNum = ''; // 联系方式
            this.ryDate = ''; // 入院日期
            this.ryDetailDate = '';
            this.remarks = ''; // 备注
            this.fileList = [];
            this.floderName = '';
            this.patientId = ''; //患者id
            this.preImageData = []; //术前图片文件对象
            this.intraImageData = [];
            this.afterImageData = [];
            this.allImageData = [];
            this.imgNumber = 0;
            this.isLoadingImg = false;
            this.preImageTabs = ['根目录'];
            this.intraImageTabs = ['根目录'];
            this.afterImageTabs = ['根目录'];
            this.dialogObj = {
                    name: '',
                    imgdata: [],
                },
                this.preBath = '根目录';
            this.intraBath = '根目录';
            this.afterBath = '根目录';
            if (flag) {
                // 删除人员信息
                if (this.personId !== '') {
                    this.deleteCaseInfo();
                }
            }
        },
        async closeDialog() {
            const self = this;
            if (self.dialogObj.imgdata.length > 0) {
                let arr = [];
                self.dialogObj.imgdata.forEach((list) => {
                    arr.push(list.id);
                });
                const params = {
                    uuids: arr
                };
                await self.$http.post('/swing/image/multipleDelete', params)
                    .then(() => {
                        // self.$message.success('删除成功');
                    }).catch((err) => {
                        console.log(err);
                        // self.$message.error('删除失败');
                    });
            }
            self.addFloderVisible = false;
            self.dialogObj.name = '';
            self.dialogObj.imgdata = [];
        },
        handleAddFloder(type) {
            if (this.personId === '') {
                this.$message.error('请先上传病例');
            } else {
                this.addFloderVisible = true;
                this.activeType = type;
            }
        },
        handleAddFloderData() {
            const self = this;
            if (self.dialogObj.name === '') {
                self.$message.error('请输入新增批次名称');
            } else if (self.dialogObj.imgdata.length === 0) {
                self.$message.error('请上传图片');
            } else {
                if (self.activeType === 'PRE_OPERATIVE_IMAGE_TYPE') {
                    self.preImageTabs.push(self.dialogObj.name);
                    self.preBath = self.dialogObj.name;
                    self.preImageData = self.preImageData.concat(self.dialogObj.imgdata);
                } else if (self.activeType === 'INTRA_OPERATIVE_IMAGE_TYPE') {
                    self.intraImageTabs.push(self.dialogObj.name);
                    self.intraBath = self.dialogObj.name;
                    self.intraImageData = self.intraImageData.concat(self.dialogObj.imgdata);
                } else {
                    self.afterImageTabs.push(self.dialogObj.name);
                    self.afterBath = self.dialogObj.name;
                    self.afterImageData = self.afterImageData.concat(self.dialogObj.imgdata);
                }
                self.$message.success('新增批次成功');
                self.addFloderVisible = false;
                self.dialogObj.name = '';
                self.dialogObj.imgdata = [];
            }
        },
        addDialogImage(file) {
            const self = this;
            const formData = new FormData();
            if (self.dialogObj.name === '') {
                this.$message.error('请输入批次名称');
            } else {
                self.dialogLoading = true;
                formData.append('image', file.file);
                formData.append('type', self.activeType);
                formData.append('caseNo', self.patientId);
                formData.append('caseId', self.personId);
                formData.append('bath', self.dialogObj.name);
                formData.append('isCreate', true);
                self.$http.post('/swing/image', formData)
                    .then((res) => {
                        const data = res.data;
                        self.src = 'data:image/png;base64,' + data.image;
                        const obj = {
                            src: 'data:image/png;base64,' + data.image,
                            type: data.imageType,
                            id: data.imageUid,
                            bath: data.bath
                        };
                        self.dialogObj.imgdata.push(obj);
                        self.dialogLoading = false;
                    }).catch((err) => {
                        console.log(err);
                        self.dialogLoading = false;
                        self.$message.error('批次重复，请重新输入批次');
                    });
            }
        },
        handleDeleteDialogImg(uuid, type, index) {
            const self = this;
            let arr = [];
            arr[0] = uuid;
            const params = {
                uuids: arr
            }
            self.$http.post('/swing/image/multipleDelete', params)
                .then(() => {
                    self.dialogObj.imgdata.splice(index, 1);
                    self.$message.success('删除成功');
                }).catch((err) => {
                    console.log(err);
                    self.$message.error('删除失败');
                });
        },
        handleShowImage(imgList) {
            this.imagesList = imgList;
            this.$refs.viewer.$viewer.show()
        },
        closeEditDialog() {
            this.editFloderVisible = false;
        },
        handleEditFloderData() {
            console.log('确定修改');
        },
        // 打开修改弹窗
        handleEditFloder(type) {
            this.editFloderVisible = true;
            this.editType = type;
            switch (this.editType) {
                case 'before':
                    this.editData = this.preImageTabs;
                    break;
                case 'intra':
                    this.editData = this.intraImageTabs;
                    break;
                case 'after':
                    this.editData = this.afterImageTabs;
                    break;
            }
            console.log(this.editData);
        },
        // 删除病人信息
        deleteCaseInfo() {
            var self = this;
            const params = {
                patientCaseIds: [self.personId]
            };
            self.$http.post('/swing/patientcase/multipleDelete', params)
                .then(() => {
                    // self.tableData.splice(self.currentIndex, 1);
                    self.$http.delete('/swing/image/' + self.hospitalNum + '/' + self.personId)
                        .then(() => {
                            self.personId = '';
                            self.hospitalNum = '';
                            console.log('删除成功')
                        })
                }).catch((err) => {
                    console.log(err);
                    self.$message.error('删除失败');
                });

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
            .anticon-plus {
                font-size: 36px;
            }
        }
    }
}
</style>
<style lang="scss" scoped>
.dialog-content {
    .input-panel {
        padding-left: 40px;
        margin-bottom: 16px;
    }

    .img-list {
        position: relative;

        .mask {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, .3);
            text-align: center;
            z-index: 9999;

            .spin-icon {
                top: 35%;
                position: relative;
            }

            .upload-explain {
                margin-top: 200px;
                color: #ddd;
                font-size: 20px;
            }
        }

        .img-item {
            text-align: center;

            img {
                width: 200px;
                height: 200px;
            }

            &:hover {
                .del-btn {
                    display: block;
                }
            }

            .del-btn {
                position: absolute;
                top: 10px;
                right: 70px;
                display: none;
                width: 20px !important;

                .anticon {
                    position: relative;
                    left: -7px;
                }
            }
        }
    }
}

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
            background-color: rgba(0, 0, 0, .3);
            text-align: center;
            z-index: 999;

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
            min-height: 200px;
            margin-top: 15px;
            overflow: hidden;
            position: relative;

            label {
                width: 100px;
                display: block;
                margin-left: -100px;
                text-align: center;
                float: left;
                position: relative;
                top: 80px;
                left: 0;
            }

            .upload-img-btn {
                float: left;
                width: 102px;
                height: 104px;
                margin-top: 45px;
            }

            .items-list {
                float: left;
                width: 200px;
                height: 200px;
                position: relative;
                margin-left: 15px;
                margin-top: 15px;
                cursor: pointer;

                img {
                    margin-left: 20px;
                    width: 200px;
                    height: 200px;
                }

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

                    .anticon {
                        position: relative;
                        left: -7px;
                    }
                }
            }

            .add-floder {
                position: absolute;
                right: 25px;
                top: 5px;
                cursor: pointer;
                z-index: 10;
            }

            .edit-floder {
                position: absolute;
                right: 125px;
                top: 5px;
                cursor: pointer;
                z-index: 10;
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
