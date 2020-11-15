<template>
<div class='patient-content'>
    <p class="head-title">
        <span>患者信息查询</span>
    </p>
    <div class="form-box">
        <a-row :gutter="16">
            <a-col class="gutter-row" :span="8">
                <div class="gutter-box">
                    <label class="label">住院号</label>
                    <a-input placeholder="请输入住院号" v-model='searchObj.hospitalNum' />
                </div>
            </a-col>
            <a-col class="gutter-row" :span="8">
                <div class="gutter-box">
                    <label class="label">主治医师</label>
                    <a-select style="width:100%;" @change="handleSearchCaseChange" :value="searchObj.currentCaseName" placeholder="请选择主治医生">
                        <a-select-option v-for="(item, index) in caseData" :key="index" :value="item">{{item}}</a-select-option>
                    </a-select>
                </div>
            </a-col>
            <a-col class="gutter-row" :span="8">
                <div class="gutter-box">
                    <label class="label">患者姓名</label>
                    <a-input placeholder="请输入患者姓名" v-model='searchObj.patientName' />
                </div>
            </a-col>
        </a-row>
        <a-row :gutter="16">
            <a-col class="gutter-row" :span="8">
                <div class="gutter-box sex">
                    <label class="label">性别</label>
                    <a-radio-group v-model="searchObj.sex">
                        <a-radio :value="0">男</a-radio>
                        <a-radio :value="1">女</a-radio>
                    </a-radio-group>
                </div>
            </a-col>
            <a-col class="gutter-row" :span="8">
                <div class="gutter-box">
                    <label class="label">患者起始年龄</label>
                    <a-input placeholder="请输入患者年龄" v-model='searchObj.startage' />
                </div>
            </a-col>
            <a-col class="gutter-row" :span="8">
                <div class="gutter-box">
                    <label class="label">诊断</label>
                    <a-select mode="tags" style="width: 100%" @change="handleSearchZdbwChange" placeholder="请选择诊断部位" :defaultValue="searchObj.zdData" :value="searchObj.zdData">
                        <a-select-option v-for="(item, index) in allZdData" :key="index" :value="item">
                            {{item}}
                        </a-select-option>
                    </a-select>
                </div>
            </a-col>
            <!-- <a-col class="gutter-row" :span="8">
          <div class="gutter-box">
            <label class="label">患者终止年龄</label>
            <a-input placeholder="请输入患者年龄" v-model='searchObj.endage'/>
          </div>
        </a-col>
        -->
        </a-row>
        <a-row :gutter="16">
            <a-col class="gutter-row" :span="8">
                <div class="gutter-box">
                    <label class="label">手术名称</label>
                    <a-select mode="tags" style="width: 100%" @change="handleSearchSsfsChange" placeholder="请选择手术名称" :value="searchObj.ssfsData">
                        <a-select-option v-for="(item, index) in allSsfsData" :key="index" :value="item">
                            {{item}}
                        </a-select-option>
                    </a-select>
                </div>
            </a-col>
            <a-col class="gutter-row" :span="8">
                <div class="gutter-box">
                    <label class="label">治疗方式</label>
                    <a-select mode="tags" style="width: 100%" @change="handleSearchZlfsChange" placeholder="请选择治疗方式" :defaultValue="searchObj.zlfsData" :value="searchObj.zlfsData">
                        <a-select-option v-for="(item, index) in allZlfsData" :key="index" :value="item">
                            {{item}}
                        </a-select-option>
                    </a-select>
                </div>
            </a-col>
            <a-col class="gutter-row" :span="8">
                <div class="gutter-box">
                    <label class="label">治疗结果</label>
                    <a-select mode="tags" style="width: 100%" @change="handleSearchZljgChange" placeholder="请选择治疗结果" :defaultValue="searchObj.zljgData" :value="searchObj.zljgData">
                        <a-select-option v-for="(item, index) in allZljgData" :key="index" :value="item">
                            {{item}}
                        </a-select-option>
                    </a-select>
                </div>
            </a-col>
        </a-row>
        <a-row :gutter='16'>
            <a-col class="gutter-row" :span="8">
                <div class="gutter-box">
                    <label class="label">入院起始日期</label>
                    <a-date-picker @change="onSearchDateChange" v-model="searchObj.ryStartDate" style="width:100%;" placeholder="请选择入院日期">
                    </a-date-picker>
                </div>
            </a-col>
            <a-col class="gutter-row" :span="8">
                <div class="gutter-box">
                    <label class="label">入院终止日期</label>
                    <a-date-picker @change="onSearchEndDateChange" v-model="searchObj.ryEndDate" style="width:100%;" placeholder="请选择入院日期">
                    </a-date-picker>
                </div>
            </a-col>
        </a-row>
    </div>
    <div class="btn-list">
        <a-button type="primary" @click="handleSearch">查找</a-button>
        <a-button type="primary" @click="resetForm" style="margin-left: 15px;">重置</a-button>
    </div>
    <div class="table-btns">
        <a-button type="primary" @click="handleMultDelete" :disabled="allCurrentCaseId.length === 0 || !!isExporting">删除</a-button>
        <a-button type="primary" @click="handleExport" :loading="!!isExporting">导出</a-button>
        <a-button type="primary" v-print="printObj" @click="handlePrint">打印</a-button>
    </div>
    <div class="table-box">
        <a-table :columns="columns" :dataSource="tableData" bordered :pagination='false' size="middle" :rowSelection="rowSelection" :scroll="{ x: 1600 }">
            <div slot="opts" slot-scope="opts, record" class="opt-btns">
                <a-button type="primary" style="cursor:pointer;" v-for="item in opts" :key="item.text" size="small" @click="hancleOpt(record, item.type)">{{item.text}}</a-button>
            </div>
        </a-table>
    </div>
    <div class="page-box" v-show="pager.total !== 0">
        <span>总共{{pager.total}}条数据</span>
        <div class="page-label">
            <a-pagination show-size-changer v-model="pager.pageNo" :page-size.sync="pager.pageSize" :pageSizeOptions=pageSizeOption :total="pager.total" @change="onPageChange" @showSizeChange="onShowSizeChange" />
        </div>
    </div>
    <div id="printMe" v-show="printIsShow">
        <table border="1">
            <tr>
                <th>住院号</th>
                <th>入院日期</th>
                <th>患者姓名</th>
                <th>患者年龄</th>
                <th>患者性别</th>
                <th>联系电话</th>
                <th>主治医生</th>
                <th>诊断部位</th>
                <th>手术名称</th>
                <th>治疗方式</th>
                <th>治疗结果</th>
            </tr>
            <template v-if="printData.length === 0">
                <div>
                    <tr v-for="(item,index) in tableData" :key="index">
                        <td>{{item.caseNo}}</td>
                        <td>{{item.admissionDate}}</td>
                        <td>{{item.patientName}}</td>
                        <td>{{item.patientAge}}</td>
                        <td>{{item.patientGender}}</td>
                        <td>{{item.phoneNumber}}</td>
                        <td>{{item.doctor}}</td>
                        <td>{{item.diagnosis}}</td>
                        <td>{{item.operationName}}</td>
                        <td>{{item.treatmentMethod}}</td>
                        <td>{{item.treatmentOutcome}}</td>
                    </tr>
                </div>
            </template>
            <template v-if="printData.length > 0">
                <div>
                    <tr v-for="(item,index) in printData" :key="index">
                        <td>{{item.caseNo}}</td>
                        <td>{{item.admissionDate}}</td>
                        <td>{{item.patientName}}</td>
                        <td>{{item.patientAge}}</td>
                        <td>{{item.patientGender}}</td>
                        <td>{{item.phoneNumber}}</td>
                        <td>{{item.doctor}}</td>
                        <td>{{item.diagnosis}}</td>
                        <td>{{item.operationName}}</td>
                        <td>{{item.treatmentMethod}}</td>
                        <td>{{item.treatmentOutcome}}</td>
                    </tr>
                </div>
            </template>
        </table>
        <div :class="{ active: printIsShow }"></div>
    </div>
    <a-modal title="查看患者信息" :visible="checkPatientInfoVisible" :footer="null" :width='1000' @cancel="closeInfoModal" :maskClosable='false' style="top: 20px;">
        <table class="info-table">
            <tr>
                <td>住院号</td>
                <td>{{checkObj.caseNo}}</td>
                <td>主治医师</td>
                <td>{{checkObj.doctor}}</td>
                <td>诊断</td>
                <td>{{checkObj.diagnosis}}</td>
            </tr>
            <tr>
                <td>患者姓名</td>
                <td>{{checkObj.patientName}}</td>
                <td>性别</td>
                <td>{{checkObj.patientGender}}</td>
                <td>年龄</td>
                <td>{{checkObj.patientAge}}</td>
            </tr>
            <tr>
                <td>治疗方式</td>
                <td>{{checkObj.treatmentMethod}}</td>
                <td>治疗结果</td>
                <td>{{checkObj.treatmentOutcome}}</td>
                <td>手术名称</td>
                <td>{{checkObj.operationName}}</td>
            </tr>
            <tr>
                <td>入院日期</td>
                <td>{{checkObj.admissionDate}}</td>
                <td>备注</td>
                <td colspan="3" style="text-align: left; padding-left: 10px;">{{checkObj.caseComment}}</td>
            </tr>
        </table>
        <div class="check-modal-photo-box">
            <div class="mask" v-show="isLoadingImg">
                <a-spin tip="图片加载中请稍等..." size="large" class="spin-icon">
                </a-spin>
            </div>
            <div class="photo-item">
                <label>术前</label>
                <a-tabs defaultActiveKey='根目录'>
                    <a-tab-pane v-for="(items) in preImageTabs" :key="items" :tab="items">
                        <div class="items-list" v-for="(item) in checkPreImageData" :key="item.id" v-show="item.bath === items">
                            <img :src="item.src" alt="" @click="handleShowImage(checkPreImageData)">
                        </div>
                    </a-tab-pane>
                </a-tabs>
            </div>
            <div class="photo-item">
                <label>术中</label>
                <a-tabs defaultActiveKey='根目录'>
                    <a-tab-pane v-for="(items) in intraImageTabs" :key="items" :tab="items">
                        <div class="items-list" v-for="(item) in checkIntraImageData" :key="item.id" v-show="item.bath === items">
                            <img :src="item.src" alt="" @click="handleShowImage(checkIntraImageData)">
                        </div>
                    </a-tab-pane>
                </a-tabs>
            </div>
            <div class="photo-item">
                <label>术后</label>
                <a-tabs defaultActiveKey='根目录'>
                    <a-tab-pane v-for="(items) in afterImageTabs" :key="items" :tab="items">
                        <div class="items-list" v-for="(item) in checkAfterImageData" :key="item.id" v-show="item.bath === items">
                            <img :src="item.src" alt="" @click="handleShowImage(checkAfterImageData)">
                        </div>
                    </a-tab-pane>
                </a-tabs>
            </div>
        </div>
    </a-modal>
    <a-modal v-model="delModalVisible" title="" @ok="handleDelInfo" @cancel="handleCloseDelModatl">
        <p style="text-align:center;font-size:16px;margin: 10px 0 0">确定删除当前患者信息吗</p>
    </a-modal>
    <a-modal v-model="delMulModalVisible" title="" @ok="handleMulDelInfo" @cancel="handleCloseDelMulModatl">
        <p style="text-align:center;font-size:16px;margin: 10px 0 0">确定删除所选患者信息吗</p>
    </a-modal>
    <a-modal v-model="editModalVisible" title="编辑患者信息" @ok="handleEditInfo" @cancel="handleCloseEditModal" :width='1000' :maskClosable='false' style="top: 20px;">
        <div class="edit-info-box">
            <div class="form-box">
                <a-row :gutter="16">
                    <a-col class="gutter-row" :span="8">
                        <div class="gutter-box">
                            <label class="label">住院号</label>
                            <a-input placeholder="请输入住院号" v-model='editObj.hospitalNum' disabled style="color:'#333'" />
                        </div>
                    </a-col>
                    <a-col class="gutter-row" :span="8">
                        <div class="gutter-box">
                            <label class="label">主治医师</label>
                            <a-select style="width:100%;" @change="handleEditCaseChange" :value="editObj.currentCaseName" placeholder="请选择主治医生">
                                <a-select-option v-for="(item, index) in caseData" :key="index">{{item}}</a-select-option>
                            </a-select>
                        </div>
                    </a-col>
                    <a-col class="gutter-row" :span="8">
                        <div class="gutter-box">
                            <label class="label">患者姓名</label>
                            <a-input placeholder="请输入患者姓名" v-model='editObj.patientName' />
                        </div>
                    </a-col>
                </a-row>
                <a-row :gutter="16">
                    <a-col class="gutter-row" :span="8">
                        <div class="gutter-box sex">
                            <label class="label">性别</label>
                            <a-radio-group v-model="editObj.sex">
                                <a-radio :value="0">男</a-radio>
                                <a-radio :value="1">女</a-radio>
                            </a-radio-group>
                        </div>
                    </a-col>
                    <a-col class="gutter-row" :span="8">
                        <div class="gutter-box">
                            <label class="label">患者年龄</label>
                            <a-input placeholder="请输入患者年龄" v-model='editObj.age' />
                        </div>
                    </a-col>
                    <a-col class="gutter-row" :span="8">
                        <div class="gutter-box">
                            <label class="label">诊断</label>
                            <a-select mode="tags" style="width: 100%" @change="handleEditZdbwChange" placeholder="请选择诊断部位" :defaultValue="editObj.zdData" :value="editObj.zdData">
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
                            <a-select mode="tags" style="width: 100%" @change="handleEditSsfsChange" placeholder="请选择手术名称" :value="editObj.ssfsData">
                                <a-select-option v-for="(item, index) in allSsfsData" :key="index" :value="item">
                                    {{item}}
                                </a-select-option>
                            </a-select>
                        </div>
                    </a-col>
                    <a-col class="gutter-row" :span="8">
                        <div class="gutter-box">
                            <label class="label">治疗方式</label>
                            <a-select mode="tags" style="width: 100%" @change="handleEditZlfsChange" placeholder="请选择治疗方式" :defaultValue="editObj.zlfsData" :value="editObj.zlfsData">
                                <a-select-option v-for="(item, index) in allZlfsData" :key="index" :value="item">
                                    {{item}}
                                </a-select-option>
                            </a-select>
                        </div>
                    </a-col>
                    <a-col class="gutter-row" :span="8">
                        <div class="gutter-box">
                            <label class="label">治疗结果</label>
                            <a-select mode="tags" style="width: 100%" @change="handleEditZljgChange" placeholder="请选择治疗结果" :defaultValue="editObj.zljgData" :value="editObj.zljgData">
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
                            <a-input placeholder="请输入联系电话" v-model="editObj.photoNum" type="number" />
                        </div>
                    </a-col>
                    <a-col class="gutter-row" :span="8">
                        <div class="gutter-box">
                            <label class="label">入院日期</label>
                            <a-date-picker @change="onEditDateChange" v-model="editObj.ryDate" style="width:100%;" placeholder="请选择入院日期">
                            </a-date-picker>
                        </div>
                    </a-col>
                </a-row>
                <a-row :span="16">
                    <a-col class="gutter-row" :span="24">
                        <div class="gutter-box">
                            <label class="label remarks">备注</label>
                            <a-textarea v-model="editObj.remarks" placeholder="请添加备注" :autoSize="{ minRows: 2, maxRows: 5 }" />
                        </div>
                    </a-col>
                </a-row>
            </div>
            <div class="photo-box">
                <div class="mask" v-show="editObj.isLoadingImg">
                    <a-spin tip="图片上传中请稍等..." size="large" class="spin-icon">
                    </a-spin>
                </div>
                <div class="mask" v-show="isLoadingImg">
                    <a-spin tip="图片加载中请稍等..." size="large" class="spin-icon">
                    </a-spin>
                </div>
                <div class="photo-item">
                    <label>术前</label>
                    <a-button type="primary" @click="handleAddFloder('PRE_OPERATIVE_IMAGE_TYPE')" class="add-floder">新增批次</a-button>
                    <!-- <div class="upload-img-btn">
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
            <div class="items-list" v-for="(item, index) in editObj.preImageData" :key="item.id">
              <a-button class="del-btn" @click="handleDeleteImg(item.id,item.type,index)" type="primary">
                <a-icon type="delete" />
              </a-button>
              <img :src="item.src" alt="">
            </div> -->
                    <a-tabs v-model="preBath" v-show="preImageTabs.length > 0">
                        <a-tab-pane v-for="(items) in preImageTabs" :key="items" :tab="items" class="img-list-box">
                            <div class="upload-img-btn">
                                <a-upload listType="picture-card" class="avatar-uploader" :showUploadList="false" accept="image/*" :customRequest="beforeImgUpload" :multiple="true">
                                    <div>
                                        <a-icon type="plus" />
                                        <div class="ant-upload-text">上传</div>
                                    </div>
                                </a-upload>
                            </div>
                            <div class="items-list" v-for="(item, indexs) in editObj.preImageData" :key="item.id" v-show="item.bath === items">
                                <a-button class="del-btn" @click="handleDeleteImg(item.id,item.type,indexs)" type="primary">
                                    <a-icon type="delete" />
                                </a-button>
                                <img :src="item.src" alt="" @click="handleShowImage(editObj.preImageData)">
                            </div>
                        </a-tab-pane>
                    </a-tabs>
                </div>
                <div class="photo-item">
                    <label>术中</label>
                    <!-- <div class="upload-img-btn">
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
            <div class="items-list" v-for="(item, index) in editObj.intraImageData" :key="item.id">
              <a-button class="del-btn" @click="handleDeleteImg(item.id,item.type,index)" type="primary">
                <a-icon type="delete" />
              </a-button>
              <img :src="item.src" alt="">
            </div> -->
                    <a-button type="primary" class="add-floder" @click="handleAddFloder('INTRA_OPERATIVE_IMAGE_TYPE')">新增批次</a-button>
                    <a-tabs v-model="intraBath" v-show="intraImageTabs.length > 0">
                        <a-tab-pane v-for="(items) in intraImageTabs" :key="items" :tab="items" class="img-list-box">
                            <div class="upload-img-btn">
                                <a-upload listType="picture-card" class="avatar-uploader" :showUploadList="false" accept="image/*" :customRequest="intraImgUpload" :multiple="true">
                                    <div>
                                        <a-icon type="plus" />
                                        <div class="ant-upload-text">上传</div>
                                    </div>
                                </a-upload>
                            </div>
                            <div class="items-list" v-for="(item, indexs) in editObj.intraImageData" :key="item.id" v-show="item.bath === items">
                                <a-button class="del-btn" @click="handleDeleteImg(item.id,item.type,indexs)" type="primary">
                                    <a-icon type="delete" />
                                </a-button>
                                <img :src="item.src" alt="" @click="handleShowImage(editObj.intraImageData)">
                            </div>
                        </a-tab-pane>
                    </a-tabs>
                </div>
                <div class="photo-item">
                    <label>术后</label>
                    <!--
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
            <div class="items-list" v-for="(item, index) in editObj.afterImageData" :key="item.id">
              <a-button class="del-btn" @click="handleDeleteImg(item.id,item.type,index)" type="primary">
                <a-icon type="delete" />
              </a-button>
              <img :src="item.src" alt="">
            </div>
            -->
                    <a-tabs v-model="afterBath" v-show="afterImageTabs.length > 0">
                        <a-tab-pane v-for="(items) in afterImageTabs" :key="items" :tab="items" class="img-list-box">
                            <div class="upload-img-btn">
                                <a-upload listType="picture-card" class="avatar-uploader" :showUploadList="false" accept="image/*" :customRequest="afterImgUpload" :multiple="true">
                                    <div>
                                        <a-icon type="plus" />
                                        <div class="ant-upload-text">上传</div>
                                    </div>
                                </a-upload>
                            </div>
                            <div class="items-list" v-for="(item, indexs) in editObj.afterImageData" :key="item.id" v-show="item.bath === items">
                                <a-button class="del-btn" @click="handleDeleteImg(item.id,item.type,indexs)" type="primary">
                                    <a-icon type="delete" />
                                </a-button>
                                <img :src="item.src" alt="" @click="handleShowImage(editObj.afterImageData)">
                            </div>
                        </a-tab-pane>
                    </a-tabs>
                </div>
            </div>
        </div>
    </a-modal>
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
                            <img :src="item.src" alt="" style="width: 200px;height:200px;" @click="handleShowImage(dialogObj.imgdata)">
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
    <viewer ref="viewer" :images="imagesList" v-show="false">
        <img v-for="(item, index) in imagesList" :src="item.src" :key="index">
    </viewer>
</div>
</template>

<script>
import moment from 'moment';
import {
    downloadFileFromResource
} from '@/utils/file'
const columns = [{
        title: '住院号',
        dataIndex: 'caseNo',
        align: 'center',
    },
    {
        title: '入院日期',
        dataIndex: 'admissionDate',
        align: 'center'
    },
    {
        title: '患者姓名',
        dataIndex: 'patientName',
        align: 'center'
    },
    {
        title: '患者年龄',
        dataIndex: 'patientAge',
        align: 'center'
    },
    {
        title: '患者性别',
        dataIndex: 'patientGender',
        align: 'center'
    },
    {
        title: '联系电话',
        dataIndex: 'phoneNumber',
        align: 'center'
    },
    {
        title: '主治医师',
        dataIndex: 'doctor',
        align: 'center'
    },
    {
        title: '诊断部位',
        dataIndex: 'diagnosis',
        align: 'center'
    },
    {
        title: '手术名称',
        dataIndex: 'operationName',
        align: 'center'
    },
    {
        title: '治疗方式',
        dataIndex: 'treatmentMethod',
        align: 'center'
    },
    {
        title: '治疗结果',
        dataIndex: 'treatmentOutcome',
        align: 'center'
    },
    {
        title: '操作',
        dataIndex: 'opts',
        align: 'center',
        scopedSlots: {
            customRender: 'opts'
        },
        width: 200,
        fixed: 'right',
    }
];
export default {
    data() {
        return {
            pageSizeOption: ['10', '20', '50', '100'],
            isExporting: false,
            printObj: {
                id: 'printMe',
                popTitle: '患者信息打印'
            },
            printIsShow: false,
            currentCaseId: '',
            currentCaseIds: '',
            currentIndex: 0,
            allCurrentCaseId: [],
            allCurrentCaseIds: [],
            tableCurrentIndex: 0,
            isLoadingImg: false,
            allCaseData: [], //医生信息
            caseData: [],
            allZdData: [], //诊断部位数据
            allSsfsData: [], //所有手术名称数据
            allZlfsData: [], //所有治疗方式数据
            allZljgData: [], //所有治疗结果数据
            columns: columns, // 表格头
            tableData: [], // 表格数据
            printData: [], // 打印数据
            checkPatientInfoVisible: false, //查看患者信息弹窗
            checkPreImageData: [], //弹窗患者术前照片
            checkIntraImageData: [], //弹窗患者术中照片
            checkAfterImageData: [], //弹窗患者术后照片
            delModalVisible: false,
            editModalVisible: false,
            delMulModalVisible: false,
            searchObj: {
                hospitalNum: '',
                currentCaseName: [], //主治医师
                patientName: '', // 患者姓名
                startage: '',
                endage: '',
                zdData: [], //诊断部位
                zlfsData: [],
                zljgData: [],
                ssfsData: [],
                ryStartDate: '',
                ryStartDetailDate: '',
                ryEndDate: '',
                ryEndDetailDate: '',
                sex: 3,
                currentCaseId: [],
            },
            checkObj: {

            },
            editObj: {
                id: '',
                hospitalNum: '', //住院号
                currentCaseName: [],
                currentCaseId: "", // 默认医生信息
                zdData: [], //当前选择诊断部位数据
                ssfsData: [], //当前选中手术名称
                zlfsData: [], //当前选中治疗方式
                zljgData: [], //当前选中治疗结果
                patientName: '', //患者姓名
                sex: 0, // 患者性别
                age: '',
                photoNum: '', // 联系方式
                ryDate: '', // 入院日期
                ryDetailDate: '',
                remarks: '', // 备注
                preImageData: [], //术前图片文件对象
                intraImageData: [],
                afterImageData: [],
                src: '',
                isLoadingImg: false
            },
            pager: {
                pageNo: 1,
                pageSize: 20,
                total: 0
            },
            preImageTabs: ['根目录'],
            intraImageTabs: ['根目录'],
            afterImageTabs: ['根目录'],
            addFloderVisible: false,
            dialogObj: {
                name: '',
                imgdata: [],
            },
            activeType: '',
            preBath: '根目录',
            intraBath: '根目录',
            afterBath: '根目录',
            dialogLoading: false,
            patientId: '',
            imagesList: [],
        };
    },
    mounted() {
        this.getCaseData(); // 获取所有医生信息
        this.getDiagnosisData(); //获取所有诊断数据
        this.getOperationData(); // 获取所有手术名称数据
        this.getTreatmentMethodData(); // 获取所有治疗方式数据
        this.getTreatmentOutcomeData();
        this.handleSearch();
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
        // 查找区域数据处理
        // 主治医师
        handleSearchCaseChange(index) {
            // self.searchObj.currentCaseId = self.allCaseData[index].doctorId;
            // self.searchObj.currentCaseName = [];
            // self.searchObj.currentCaseName.push(self.allCaseData[index].doctorName);
            const self = this;
            self.allCaseData.forEach((item) => {
                if (item.doctorName === index) {
                    self.searchObj.currentCaseId = [];
                    self.searchObj.currentCaseId.push(item.doctorId);
                }
            })
            self.searchObj.currentCaseName = [];
            // self.currentCaseName.push(self.allCaseData[index].doctorName);
            self.searchObj.currentCaseName.push(index);
        },
        // 诊断部位
        handleSearchZdbwChange(selectedItems) {
            this.searchObj.zdData = selectedItems;
        },
        // 手术名称
        handleSearchSsfsChange(item) {
            this.searchObj.ssfsData = item;
        },
        // 治疗方式
        handleSearchZlfsChange(item) {
            this.searchObj.zlfsData = item;
        },
        // 治疗结果
        handleSearchZljgChange(item) {
            this.searchObj.zljgData = item;
        },
        // 入院日期
        onSearchDateChange(item, datestring) {
            this.searchObj.ryStartDate = item;
            this.searchObj.ryStartDetailDate = datestring;
        },
        onSearchEndDateChange(item, datestring) {
            this.searchObj.ryEndDate = item;
            this.searchObj.ryEndDetailDate = datestring;
        },
        // 点击查找
        handleSearch() {
            const self = this;
            let searchParams = {
                "caseNo": self.searchObj.hospitalNum,
                "diagnosis": self.searchObj.zdData,
                "doctorIds": self.searchObj.currentCaseId,
                "endAdmissionDate": self.searchObj.ryEndDetailDate,
                "maxPatientAge": self.searchObj.endage,
                "minPatientAge": self.searchObj.startage,
                "operationName": self.searchObj.ssfsData,
                "patientGender": self.searchObj.sex == 0 ? '男' : '女',
                "patientName": self.searchObj.patientName,
                "phoneNumber": "",
                "startAdmissionDate": self.searchObj.ryStartDetailDate,
                "treatmentMethod": self.searchObj.zlfsData,
                "treatmentOutcome": self.searchObj.zljgData
            };
            if (self.searchObj.sex === 3) {
                searchParams.patientGender = '';
            }
            const pageNo = self.pager.pageNo - 1;
            const url = '/swing/patientcase?page=' + pageNo + '&size=' + self.pager.pageSize + '&sort=caseNo,desc';
            self.$http.post(url, searchParams)
                .then((res) => {
                    const data = res.data.list;
                    data.forEach((item) => {
                        item.key = item.id;
                        item.doctor = item.doctor ? item.doctor.doctorName : '';
                        let diagnosisdata = [];
                        item.diagnosis.forEach((list) => {
                            diagnosisdata.push(list.dictionaryValue);
                        });
                        item.diagnosis = diagnosisdata.join();
                        item.caseComment = item.caseComment ? item.caseComment : "";
                        let operationNamedata = [];
                        item.operationName.forEach((list) => {
                            operationNamedata.push(list.dictionaryValue);
                        });
                        item.operationName = operationNamedata.join();

                        let treatmentMethodData = [];
                        item.treatmentMethod.forEach((list) => {
                            treatmentMethodData.push(list.dictionaryValue);
                        });
                        item.treatmentMethod = treatmentMethodData.join();
                        let treatmentOutcomeData = [];
                        item.treatmentOutcome.forEach((list) => {
                            treatmentOutcomeData.push(list.dictionaryValue);
                        });
                        item.treatmentOutcome = treatmentOutcomeData.join();

                        item.opts = [{
                            text: '查看',
                            type: 'get'
                        }, {
                            text: '编辑',
                            type: 'edit'
                        }, {
                            text: '删除',
                            type: 'del'
                        }, ]

                    });
                    self.tableData = data;
                    self.pager.total = res.data.total;
                }).catch((err) => {
                    console.log(err);
                });
        },
        // 编辑区域
        // 主治医师
        handleEditCaseChange(index) {
            const self = this;
            self.editObj.currentCaseId = self.allCaseData[index].doctorId;
            self.editObj.currentCaseName = [];
            self.editObj.currentCaseName.push(self.allCaseData[index].doctorName);
        },
        // 诊断部位
        handleEditZdbwChange(selectedItems) {
            this.editObj.zdData = selectedItems;
        },
        //手术名称
        handleEditSsfsChange(item) {
            this.editObj.ssfsData = item;
        },
        // 治疗方式
        handleEditZlfsChange(item) {
            this.editObj.zlfsData = item;
        },
        // 治疗结果
        handleEditZljgChange(item) {
            this.editObj.zljgData = item;
        },
        onEditDateChange(item, datestring) {
            this.editObj.ryDate = item;
            this.editObj.ryDetailDate = datestring;
        },
        // 处理操作
        hancleOpt: function (rowData, type) {
            const self = this;
            self.patientId = rowData.caseNo;
            if (type === 'get') {
                self.checkPatientInfoVisible = true;
                self.checkObj = rowData;
                self.getImgList(rowData.caseNo, rowData.id);
            } else if (type === 'del') {
                self.delModalVisible = true;
                // self.currentIndex = key;
                self.currentCaseId = rowData.caseNo;
                self.currentCaseIds = rowData.id;
            } else {
                self.editModalVisible = true;
                // self.tableCurrentIndex = key;
                const data = rowData;
                self.currentCaseIds = rowData.id;
                self.editObj.hospitalNum = data.caseNo;
                self.editObj.id = data.id;
                self.editObj.currentCaseName = [];
                if (data.doctor) {
                    self.editObj.currentCaseName.push(data.doctor);
                }
                self.editObj.zdData = [];
                self.editObj.zdData = data.diagnosis === '' ? [] : data.diagnosis.split(',');
                self.editObj.ssfsData = [];
                self.editObj.ssfsData = data.operationName === '' ? [] : data.operationName.split(',');
                self.editObj.zlfsData = [];
                self.editObj.zlfsData = data.treatmentMethod === '' ? [] : data.treatmentMethod.split(',');
                self.editObj.zljgData = [];
                self.editObj.zljgData = data.treatmentOutcome === '' ? [] : data.treatmentOutcome.split(',');
                self.editObj.patientName = data.patientName;
                self.editObj.sex = data.patientGender === '男' ? 0 : 1;
                self.editObj.age = data.patientAge;
                self.editObj.photoNum = data.phoneNumber;
                self.editObj.ryDate = data.admissionDate ? moment(data.admissionDate, 'YYYY-MM-DD') : '';
                self.editObj.ryDetailDate = data.admissionDate;
                self.editObj.remarks = data.caseComment ? data.caseComment : '';
                self.allCaseData.forEach((item) => {
                    if (item.doctorName === data.doctor) {
                        self.editObj.currentCaseId = item.doctorId;
                    }
                });
                self.getImgList(data.caseNo, data.id);
            }
        },
        // 获取照片
        getImgList(caseNo, id) {
            const self = this;
            self.checkPreImageData = [];
            self.checkIntraImageData = [];
            self.checkAfterImageData = [];
            self.editObj.preImageData = [];
            self.editObj.intraImageData = [];
            self.editObj.afterImageData = [];
            self.isLoadingImg = true;
            self.$http.get('/swing/image/' + caseNo + '/' + id)
                .then((res) => {
                    const data = res.data;
                    let num = 0;
                    if (data.preOperativeImageList.length + data.intraOperativeImageList.length + data.postOperativeImageList.length === num) {
                        self.isLoadingImg = false;
                    }
                    data.preOperativeImageList.forEach((item) => {
                        if (item.imageItems) {
                            num += item.imageItems.length;
                        }
                    });
                    data.intraOperativeImageList.forEach((item) => {
                        if (item.imageItems) {
                            num += item.imageItems.length;
                        }
                    });
                    data.postOperativeImageList.forEach((item) => {
                        if (item.imageItems) {
                            num += item.imageItems.length;
                        }
                    });
                    data.preOperativeImageList.forEach((item) => {
                        if (item.imageItems) {
                            item.imageItems.forEach(async (list) => {
                                let obj = {
                                    src: 'data:image/png;base64,' + list.image,
                                    type: list.imageType,
                                    id: list.imageUid,
                                    bath: item.bath,
                                };
                                // self.checkPreImageData.push(obj);
                                // self.editObj.preImageData.push(obj);
                                const params = {
                                    "imageId": list.imageUid
                                };
                                await self.$http.post('/swing/image/byte', params)
                                    .then((res) => {
                                        obj.src = 'data:image/png;base64,' + res.data.imageByte
                                        self.checkPreImageData.push(obj);
                                        self.editObj.preImageData.push(obj);
                                        console.log(self.checkPreImageData.length + self.checkIntraImageData.length + self.checkAfterImageData.length);
                                        if (self.checkPreImageData.length + self.checkIntraImageData.length + self.checkAfterImageData.length === num) {
                                            self.isLoadingImg = false;
                                        }
                                    });
                            });
                            if (self.preImageTabs.indexOf(item.bath) === -1) {
                                self.preImageTabs.push(item.bath);
                            }
                        }
                    });
                    data.intraOperativeImageList.forEach((item) => {
                        if (item.imageItems) {
                            item.imageItems.forEach(async (list) => {
                                const obj = {
                                    src: 'data:image/png;base64,' + list.image,
                                    type: list.imageType,
                                    id: list.imageUid,
                                    bath: item.bath,
                                };
                                // self.checkIntraImageData.push(obj);
                                // self.editObj.intraImageData.push(obj);
                                const params = {
                                    "imageId": list.imageUid
                                };
                                await self.$http.post('/swing/image/byte', params)
                                    .then((res) => {
                                        obj.src = 'data:image/png;base64,' + res.data.imageByte
                                        self.checkIntraImageData.push(obj);
                                        self.editObj.intraImageData.push(obj);
                                        console.log(self.checkPreImageData.length + self.checkIntraImageData.length + self.checkAfterImageData.length);

                                        if (self.checkPreImageData.length + self.checkIntraImageData.length + self.checkAfterImageData.length === num) {
                                            self.isLoadingImg = false;
                                        }
                                    });
                            });
                            if (self.intraImageTabs.indexOf(item.bath) === -1) {
                                self.intraImageTabs.push(item.bath);
                            }
                        }
                    });
                    data.postOperativeImageList.forEach((item) => {
                        if (item.imageItems) {
                            item.imageItems.forEach(async (list) => {
                                const obj = {
                                    src: 'data:image/png;base64,' + list.image,
                                    type: list.imageType,
                                    id: list.imageUid,
                                    bath: item.bath,
                                };
                                // self.checkAfterImageData.push(obj);
                                // self.editObj.afterImageData.push(obj);
                                const params = {
                                    "imageId": list.imageUid
                                };
                                await self.$http.post('/swing/image/byte', params)
                                    .then((res) => {
                                        obj.src = 'data:image/png;base64,' + res.data.imageByte
                                        self.checkAfterImageData.push(obj);
                                        self.editObj.afterImageData.push(obj);
                                        console.log(self.checkPreImageData.length + self.checkIntraImageData.length + self.checkAfterImageData.length);
                                        if (self.checkPreImageData.length + self.checkIntraImageData.length + self.checkAfterImageData.length === num) {
                                            self.isLoadingImg = false;
                                        }
                                    });
                            });
                            if (self.afterImageTabs.indexOf(item.bath) === -1) {
                                self.afterImageTabs.push(item.bath);
                            }
                        }
                    });
                }).catch(() => {
                    self.$message.error('请求失败');
                });
        },
        //术前照片上传
        beforeImgUpload(file) {
            const self = this;
            self.editObj.isLoadingImg = true;
            const formData = new FormData();
            formData.append('image', file.file);
            formData.append('type', 'PRE_OPERATIVE_IMAGE_TYPE');
            formData.append('caseNo', self.editObj.hospitalNum);
            formData.append('caseId', self.editObj.id);
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
                    self.editObj.preImageData.push(obj);
                    self.editObj.isLoadingImg = false;
                }).catch((err) => {
                    console.log(err);
                });
        },
        intraImgUpload(file) {
            const self = this;
            self.editObj.isLoadingImg = true;
            const formData = new FormData();
            formData.append('image', file.file);
            formData.append('type', 'INTRA_OPERATIVE_IMAGE_TYPE');
            formData.append('caseNo', self.editObj.hospitalNum);
            formData.append('caseId', self.editObj.id);
            formData.append('bath', self.intraBath);
            self.$http.post('/swing/image', formData)
                .then((res) => {
                    self.editObj.isLoadingImg = false;
                    const data = res.data;
                    self.src = 'data:image/png;base64,' + data.image;
                    const obj = {
                        src: 'data:image/png;base64,' + data.image,
                        type: data.imageType,
                        id: data.imageUid,
                        bath: data.bath,
                    };
                    self.editObj.intraImageData.push(obj);
                }).catch((err) => {
                    console.log(err);
                });
        },
        afterImgUpload(file) {
            const self = this;
            self.editObj.isLoadingImg = true;
            const formData = new FormData();
            formData.append('image', file.file);
            formData.append('type', 'POST_OPERATIVE_IMAGE_TYPE');
            formData.append('caseNo', self.editObj.hospitalNum);
            formData.append('caseId', self.editObj.id);
            formData.append('bath', self.afterBath);
            self.$http.post('/swing/image', formData)
                .then((res) => {
                    self.editObj.isLoadingImg = false;
                    const data = res.data;
                    self.src = 'data:image/png;base64,' + data.image;
                    const obj = {
                        src: 'data:image/png;base64,' + data.image,
                        type: data.imageType,
                        id: data.imageUid,
                        bath: data.bath,
                    };
                    self.editObj.afterImageData.push(obj);

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
                        self.editObj.intraImageData.splice(index, 1);
                    } else if (type === "preOperative") {
                        self.editObj.preImageData.splice(index, 1);
                    } else if (type === "postOperative") {
                        self.editObj.afterImageData.splice(index, 1);
                    }
                    self.$message.success('删除成功');
                }).catch((err) => {
                    console.log(err);
                    self.$message.error('删除失败');
                });
        },
        // 查看患者信息 关闭弹窗
        closeInfoModal: function () {
            this.checkPatientInfoVisible = false;
            this.preImageTabs = ['根目录'];
            this.intraImageTabs = ['根目录'];
            this.afterImageTabs = ['根目录'];
            this.preBath = '根目录';
            this.intraBath = '根目录';
            this.afterBath = '根目录';
        },
        // 删除患者信息 弹窗关闭
        handleDelInfo: function () {
            const self = this;
            self.delModalVisible = false;
            const params = {
                patientCaseIds: [self.currentCaseIds]
            };
            self.$http.post('/swing/patientcase/multipleDelete', params)
                .then(() => {
                    // self.tableData.splice(self.currentIndex, 1);
                    self.$message.success('删除成功');
                    self.handleSearch();
                }).catch((err) => {
                    console.log(err);
                    self.$message.error('删除失败');
                });
        },
        handleCloseDelModatl: function () {
            this.delModalVisible = false;
        },
        // 编辑患者信息 确认按钮点击
        handleEditInfo: function () {
            const self = this;
            if (self.editObj.isLoadingImg || self.isLoadingImg) {
                self.$message.warning('图片加载中，请稍等');
                return;
            }
            // 上传信息
            const params = {
                "admissionDate": self.editObj.ryDetailDate,
                "attendingDoctorId": self.editObj.currentCaseId,
                "caseNo": self.editObj.hospitalNum,
                "diagnosis": self.editObj.zdData,
                "operationName": self.editObj.ssfsData,
                "patientAge": self.editObj.age,
                "patientGender": self.editObj.sex == 0 ? '男' : '女',
                "patientName": self.editObj.patientName,
                "phoneNumber": self.editObj.photoNum,
                "treatmentMethod": self.editObj.zlfsData,
                "treatmentOutcome": self.editObj.zljgData,
                "caseComment": self.editObj.remarks,
                "id": self.editObj.id
            };
            self.$http.post('/swing/patientcase/addition', params)
                .then(() => {
                    self.$message.success('编辑成功');
                    window.scrollTo(0, 0);
                    self.getDiagnosisData(); //获取所有诊断数据
                    self.getOperationData(); // 获取所有手术名称数据
                    self.getTreatmentMethodData(); // 获取所有治疗方式数据
                    self.getTreatmentOutcomeData();
                    // let tableObj = self.tableData[self.tableCurrentIndex];
                    // tableObj.admissionDate = self.editObj.ryDetailDate;
                    // tableObj.patientName = self.editObj.patientName;
                    // tableObj.patientAge = self.editObj.age;
                    // tableObj.patientGender = self.editObj.sex == 0 ? '男' : '女';
                    // tableObj.doctor = self.editObj.currentCaseName;
                    // tableObj.phoneNumber = self.editObj.photoNum;
                    // tableObj.diagnosis = self.editObj.zdData.join(',');
                    // tableObj.operationName = self.editObj.ssfsData.join(',');
                    // tableObj.treatmentMethod = self.editObj.zlfsData.join(',');
                    // tableObj.treatmentOutcome = self.editObj.zljgData.join(',');
                    self.editModalVisible = false;
                    self.handleSearch();
                }).catch((err) => {
                    console.log(err);
                });
        },
        handleCloseEditModal: function () {
            this.editModalVisible = false;
            this.preImageTabs = ['根目录'];
            this.intraImageTabs = ['根目录'];
            this.afterImageTabs = ['根目录'];
            this.preBath = '根目录';
            this.intraBath = '根目录';
            this.afterBath = '根目录';
        },
        // 处理导出
        handleExport() {
            const self = this;
            if (!self.isExporting) {
                self.isExporting = true;
                if (self.allCurrentCaseId.length === 0) {
                    let params = {
                        "caseNo": self.searchObj.hospitalNum,
                        "diagnosis": self.searchObj.zdData,
                        "doctorIds": self.searchObj.currentCaseId,
                        "endAdmissionDate": self.searchObj.ryEndDetailDate,
                        "maxPatientAge": self.searchObj.endage,
                        "minPatientAge": self.searchObj.startage,
                        "operationName": self.searchObj.ssfsData,
                        "patientGender": self.searchObj.sex == 0 ? '男' : '女',
                        "patientName": self.searchObj.patientName,
                        "phoneNumber": "",
                        "startAdmissionDate": self.searchObj.ryStartDetailDate,
                        "treatmentMethod": self.searchObj.zlfsData,
                        "treatmentOutcome": self.searchObj.zljgData
                    };
                    if (self.searchObj.sex === 3) {
                        params.patientGender = '';
                    }
                    self.$http.post('/swing/patientcaserecord', params, {
                        responseType: 'blob'
                    }).then((res) => {
                        self.isExporting = false;
                        downloadFileFromResource(res);
                    }).catch(() => {
                        self.isExporting = false;
                        self.$message.error('导出失败');
                    });
                } else {
                    const params = self.allCurrentCaseId;
                    self.$http.post('/swing/patientcaserecord/caseNos', params, {
                        responseType: 'blob'
                    }).then((res) => {
                        self.isExporting = false;
                        downloadFileFromResource(res);
                    }).catch(() => {
                        self.isExporting = false;
                        self.$message.error('导出失败');
                    });
                }
            } else {
                self.$message.warning('正在导出，请稍等...');
            }
        },
        handleMultDelete() {
            this.delMulModalVisible = true;
        },
        handleMulDelInfo() {
            const self = this;
            self.delMulModalVisible = false;
            const params = {
                patientCaseIds: self.allCurrentCaseIds
            };
            self.$http.post('/swing/patientcase/multipleDelete', params)
                .then(() => {
                    self.$message.success('删除成功');
                    self.handleSearch();
                }).catch((err) => {
                    console.log(err);
                    self.$message.error('删除失败');
                });
        },
        handleCloseDelMulModatl() {
            this.delMulModalVisible = false;
        },
        onShowSizeChange(current, pageSize) {
            const self = this;
            self.pager.pageNo = current;
            self.pageSize = pageSize;
            self.handleSearch();
        },
        onPageChange(current, pageSize) {
            const self = this;
            self.pager.pageNo = current;
            self.pageSize = pageSize;
            self.handleSearch();
        },
        resetForm() {
            this.searchObj = {
                hospitalNum: '',
                currentCaseName: [], //主治医师
                patientName: '', // 患者姓名
                startage: '',
                endage: '',
                zdData: [], //诊断部位
                zlfsData: [],
                zljgData: [],
                ssfsData: [],
                ryStartDate: '',
                ryStartDetailDate: '',
                ryEndDate: '',
                ryEndDetailDate: '',
                sex: 3,
                currentCaseId: [],
            }
        },
        // 打印
        handlePrint() {
            // this.$print(this.$refs.printss);
            this.printIsShow = true;
            setTimeout(() => {
                this.printIsShow = false;
            }, 0);
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
            this.addFloderVisible = true;
            this.activeType = type;
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
                    self.editObj.preImageData = self.editObj.preImageData.concat(self.dialogObj.imgdata);
                } else if (self.activeType === 'INTRA_OPERATIVE_IMAGE_TYPE') {
                    self.intraImageTabs.push(self.dialogObj.name);
                    self.intraBath = self.dialogObj.name;
                    self.editObj.intraImageData = self.editObj.intraImageData.concat(self.dialogObj.imgdata);
                } else {
                    self.afterImageTabs.push(self.dialogObj.name);
                    self.afterBath = self.dialogObj.name;
                    self.editObj.afterImageData = self.editObj.afterImageData.concat(self.dialogObj.imgdata);
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
            // let bath = '';
            // if (self.activeType === 'PRE_OPERATIVE_IMAGE_TYPE') {
            //   bath = self.preBath;
            // } else if (self.activeType === 'INTRA_OPERATIVE_IMAGE_TYPE') {
            //   bath = self.intraBath;
            // } else {
            //   bath = self.afterBath;
            // }
            if (self.dialogObj.name === '') {
                this.$message.error('请输入批次名称');
            } else {
                self.dialogLoading = true;
                formData.append('image', file.file);
                formData.append('type', self.activeType);
                formData.append('caseNo', self.patientId);
                formData.append('caseId', self.currentCaseIds);
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
                    }).catch(() => {
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
    },
    computed: {
        rowSelection() {
            const self = this;
            return {
                onChange: (selectedRowKeys, selectedRows) => {
                    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
                    self.allCurrentCaseId = [];
                    self.allCurrentCaseIds = [];
                    selectedRows.forEach((item) => {
                        self.allCurrentCaseId.push(item.caseNo);
                        self.allCurrentCaseIds.push(item.id);
                    });
                    self.printData = selectedRows;
                }
            };
        },
    },
};
</script>

<style lang="scss">
.form-box {
    .ant-row {
        margin: 0;
    }
}

.info-table {
    width: 100%;

    tr {
        height: 26px;
        line-height: 26px;

        td {
            border: 1px solid #ddd;
            width: 16%;
            text-align: center;
        }
    }
}

.check-modal-photo-box {
    margin: 0 15px;
    position: relative;

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
            cursor: pointer;
        }

        .items-list {
            float: left;
            width: 200px;
            height: 200px;
            position: relative;
            margin-left: 15px;
            margin-top: 10px;
        }
    }

    .mask {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background-color: rgba(0, 0, 0, .3);
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
}

.ant-modal-footer {
    text-align: center !important;
}

.edit-info-box {
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

        // .photo-item {
        //   padding-left: 100px;
        //   margin-top: 15px;
        //   min-height: 200px;
        //   overflow: hidden;
        //   label {
        //     width: 100px;
        //     display: block;
        //     margin-left: -100px;
        //     text-align: center;
        //     float: left;
        //     position: relative;
        //     top: 80px;
        //     left: -10px;
        //   }
        //   img {
        //     margin-left: 20px;
        //     width: 200px;
        //     height: 200px;
        //   }
        //   .upload-img-btn {
        //     float: left;
        //     width: 102px;
        //     height: 102px;
        //   }
        //   .items-list {
        //     float: left;
        //     width: 200px;
        //     height: 200px;
        //     position: relative;
        //     margin-left: 15px;
        //     cursor: pointer;
        //     &:hover {
        //       .del-btn {
        //         display: block;
        //       }
        //     }
        //     .del-btn {
        //       position: absolute;
        //       top: 10px;
        //       right: 0;
        //       display: none;
        //       width: 20px !important;
        //       .anticon{
        //         position: relative;
        //         left: -7px;
        //       }
        //     }
        //   }
        // }
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

            .img-list-box {
                padding-left: 140px;
            }

            .upload-img-btn {
                float: left;
                width: 102px;
                height: 104px;
                margin-top: 30px;
                margin-left: -120px;
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
            cursor: pointer;

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
    #printMe {
        position: relative;

        .active {
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            background: #fff;
        }
    }

    padding-bottom: 20px;

    .head-title {
        height: 36px;
        line-height: 36px;
        border-bottom: 1px solid #eee;
        padding-left: 15px;
        font-size: 16px;
        margin-bottom: 0;
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

    .btn-list {
        padding-left: 115px;
        padding-bottom: 15px;
        border-bottom: 1px solid #eee;

        .ant-btn-primary {
            margin-top: 15px;
            width: 100px !important;
        }
    }

    .table-btns {
        margin-top: 15px;

        .ant-btn-primary {
            margin-left: 20px;
            width: 100px;
        }
    }

    .table-box {
        margin: 15px;

        .opt-btns {
            width: 200px;

            .ant-btn-primary {
                margin-left: 15px;

                &:first-child {
                    margin-left: 0;
                }
            }
        }
    }

    .page-box {
        margin-left: 15px;

        .page-label {
            float: right;
            margin-right: 5px;
        }
    }
}
</style>
