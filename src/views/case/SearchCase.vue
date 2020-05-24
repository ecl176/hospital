<template>
  <div class='patient-content'>
    <p class="head-title">
      <span>医生信息查询</span>
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
            <a-select style="width:100%;" @change="handleCaseChange" :value="currentCaseName" placeholder="请选择职称">
                <a-select-option v-for="(item, index) in allCaseData" :key="index" :value="item"
                >{{item}}</a-select-option
              >
            </a-select>
          </div>
        </a-col>
      </a-row>
    </div>
    <div class="btn-list">
      <a-button type="primary" @click="handleSearch">查询</a-button>
      <a-button type="primary" @click="resetForm" style="margin-left: 15px;">重置</a-button>
    </div>
    <div class="table-btns">
      <a-button type="primary" @click="handleDelete" :disabled="allCurrentCaseId.length === 0">删除</a-button>
    </div>
    <div class="table-box">
      <a-table 
        :columns="columns" 
        :dataSource="tableData" 
        bordered
        :pagination= 'false'
        size="middle"
        :rowSelection="rowSelection"
      >
        <div slot="opts" slot-scope="opts, record" class="opt-btns">
          <a-button type="primary" style="cursor:pointer;" v-for="item in opts" :key="item.text" size="small" @click="hancleOpt(record, item.type)">{{item.text}}</a-button>
        </div>
      </a-table>
    </div>
    <a-modal
      v-model="delModalVisible"
      title=""
      @ok="handleDelInfo"
      @cancel="handleCloseDelModatl"
      >
      <p style="text-align:center;font-size:16px;margin: 10px 0 0">确定删除当前医生信息吗</p>
    </a-modal>
    <a-modal
      v-model="delMulModalVisible"
      title=""
      @ok="handleMulDelInfo"
      @cancel="handleCloseDelMulModatl"
      >
      <p style="text-align:center;font-size:16px;margin: 10px 0 0">确定删除所选医生信息吗</p>
    </a-modal>
    <a-modal
      title="编辑医生信息"
      :visible="editCaseInfoVisible"
      :width = '1000'
      @cancel = "handleCloseEditModal"
      @ok = "handleEditInfo"
      :maskClosable='false'
      style="top: 20px;"
      >
      <div class="edit-info-box">
        <div class="form-box">
          <a-row :gutter="16">
            <a-col class="gutter-row" :span="8">
              <div class="gutter-box">
                <label class="label">医生姓名</label>
                <a-input placeholder="请输入医生姓名" v-model='editObj.caseName' />
              </div>
            </a-col>
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
                  <label class="label">职称</label>
                  <a-select style="width:100%;" @change="handleEditCaseChange" :value="editObj.currentCaseName" placeholder="请选择职称">
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
                  v-model="editObj.remark"
                  placeholder="请添加备注"
                  :autoSize="{ minRows: 2, maxRows: 5 }"
                />
              </div>
            </a-col>
          </a-row>
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script>
  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      align: 'center'
    },
    {
      title: '性别',
      dataIndex: 'sex',
      align: 'center'
    },
    {
      title: '职称',
      dataIndex: 'type',
      align: 'center'
    },
    {
      title: '备注',
      dataIndex: 'remark',
      align: 'center'
    },
    {
      title: '操作',
      dataIndex: 'opts',
      align: 'center',
      scopedSlots: { customRender: 'opts' },
      width: 200,
      fixed: 'right',
    }
  ];
  export default {
    data() {
      return {
        allCaseData: [],//所有医生信息
        currentCaseName: [], // 默认医生信息
        caseName: '',//病人姓名
        sex: 3,
        columns: columns, // 表格头
        tableData: [], // 表格数据
        delModalVisible: false,
        currentCaseId: [],
        currentIndex: 0,
        delMulModalVisible: false,
        allCurrentCaseId: [],
        editObj: {
          currentCaseName: [], // 默认职称
          caseName: '',//病人姓名
          sex: 0,
          remark: ''
        },
        tableCurrentIndex: 0,
        editCaseInfoVisible: false,
      };
    },
    mounted() {
      this.getCaseData();
      this.handleInitSearch();
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
        this.currentCaseName = [];
        this.currentCaseName.push(item);
      },
      // 点击确定
      handleSearch: function() {
        const self = this;
        let params = {
          doctorGender: self.sex == 0 ? '男' : '女',
          doctorName: self.caseName,
          titleType: self.currentCaseName.length > 0 ? self.currentCaseName[0] : ''
        };
        if(self.sex === 3) {
          params.doctorGender = '';
        }
        self.$http.post('/doctor', params)
        .then((res) => {
          const data = res.data.list;
          let allTableData = [];
          data.forEach((item, index) => {
            const obj = {
              key: index,
              name: item.doctorName,
              sex: '男',
              type: item.titleType,
              id: item.doctorId,
              remark: item.doctorComment ? item.doctorComment : '',
              opts: [{
                text: '编辑',
                type: 'edit'
              },{
                text: '删除',
                type: 'del'
              }]
            };
            allTableData.push(obj);
          });
          self.tableData = allTableData;
        }).catch(() => {
          self.$message.error('请求失败');
        });
      },
      //
      handleInitSearch() {
        const self = this;
        const params = {
          doctorGender: '',
          doctorName: self.caseName,
          titleType: ''
        };
        self.$http.post('/doctor', params)
        .then((res) => {
          const data = res.data.list;
          let allTableData = [];
          data.forEach((item, index) => {
            const obj = {
              key: index,
              name: item.doctorName,
              sex: '男',
              type: item.titleType,
              id: item.doctorId,
              remark: item.doctorComment ? item.doctorComment : '',
              opts: [{
                text: '编辑',
                type: 'edit'
              },{
                text: '删除',
                type: 'del'
              }]
            };
            allTableData.push(obj);
          });
          self.tableData = allTableData;
        }).catch(() => {
          self.$message.error('请求失败');
        });
      },
      resetForm() {
        this.currentCaseName = [];
        this.caseName = '';
        this.remark = '';
        this.sex = 0;
      },
      handleDelInfo() {
        const self = this;
        const params = {
          doctorIds: self.currentCaseId
        };
        self.$http.post('/doctor/multipleDelete', params)
        .then(() => {
          // self.tableData.splice(self.currentIndex, 1);
          self.handleSearch();
          self.delModalVisible = false;
        }).catch((err) => {
          console.log(err);
          self.$message.error('删除失败');
        });
      },
      handleCloseDelModatl() {
        this.delModalVisible = false;
      },
      // 处理操作
      hancleOpt: function(rowData, type) {
        const self = this;
        if(type === 'del') {
          self.currentCaseId = [];
          // self.currentIndex = key;
          self.currentCaseId.push(rowData.id.toString());
          self.delModalVisible = true;
        } else {
          self.editCaseInfoVisible = true;
          // self.tableCurrentIndex = key;
          const data = rowData;
          self.editObj.currentCaseName = [];
          self.editObj.currentCaseName.push(data.type);
          self.editObj.caseName = data.name;
          self.editObj.sex = data.sex === '男' ? 0 : 1;
          self.editObj.remark = data.remark ? data.remark : '';

        }
      },
      handleMulDelInfo() {
        const self = this;
        self.delMulModalVisible = false;
        const params = {
          doctorIds: self.allCurrentCaseId
        };
        self.$http.post('/doctor/multipleDelete', params)
        .then(() => {
          // self.tableData.splice(self.currentIndex, 1);
          self.handleSearch();
        }).catch((err) => {
          console.log(err);
          self.$message.error('删除失败');
        });
      },
      handleCloseDelMulModatl() {
        this.delMulModalVisible = false;
      },
      handleDelete() {
        this.delMulModalVisible = true;
      },
      handleCloseEditModal() {
        this.editCaseInfoVisible = false;
      },
      handleEditInfo() {
        const self = this;
        self.editCaseInfoVisible = false;
      }
    },
    computed: {
      rowSelection() {
        const self = this;
        return {
          onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            self.allCurrentCaseId = [];
            selectedRows.forEach((item) => {
              self.allCurrentCaseId.push(item.id.toString());
            });
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
}

</style>
