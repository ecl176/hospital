<template>
  <div class='patient-content'>
    <p class="head-title">
      <span>病人信息查询</span>
    </p>
    <div class="form-box">
      <a-row :gutter="16">
        <a-col class="gutter-row" :span="8">
          <div class="gutter-box">
            <label class="label">住院号</label>
            <a-input placeholder="请输入住院号" v-model='hospitalNum'/>
          </div>
        </a-col>
        <a-col class="gutter-row" :span="8">
          <div class="gutter-box">
            <label class="label">主治医师</label>
            <a-select :defaultValue="currentCaseName" style="width:100%;" @change="handleCaseChange">
              <a-select-option v-for="(item, index) in caseData" :key="index"
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
        <a-col class="gutter-row" :span="8">
          <div class="gutter-box sex">
            <label class="label">性别</label>
            <a-radio-group v-model="sex" >
              <a-radio :value="1">男</a-radio>
              <a-radio :value="2">女</a-radio>
            </a-radio-group>
          </div>
        </a-col>
        <a-col class="gutter-row" :span="8">
          <div class="gutter-box">
            <label class="label">病人年龄</label>
            <a-input placeholder="请输入病人年龄" v-model='age' style="height: 30px;" />
          </div>
        </a-col>
        <a-col class="gutter-row" :span="8">
          <div class="gutter-box">
            <label class="label">诊断</label>
            <a-select
              mode="multiple"
              placeholder="请选择诊断部位"
              :value="zdbwText"
              @change="handleZdbwChange"
              style="width: 100%;height:30px"
            >
              <a-select-option v-for="(item, index) in zdbwData" :key="index" :value="item">
                {{item}}
              </a-select-option>
            </a-select>
          </div>
        </a-col>
        <a-col class="gutter-row" :span="8">
          <div class="gutter-box">
            <label class="label">治疗方式</label>
            <a-input placeholder="请输入治疗方式" v-model='zlfsText'/>
          </div>
        </a-col>
        <a-col class="gutter-row" :span="8">
          <div class="gutter-box">
            <label class="label">治疗结果</label>
            <a-input placeholder="请输入追了结果" v-model='zljgText' />
          </div>
        </a-col>
        <a-col class="gutter-row" :span="8">
          <div class="gutter-box">
            <label class="label">入院日期</label>
            <a-date-picker @change="onDateChange" style="width:100%;" placeholder="请选择入院日期">
            </a-date-picker>
          </div>
        </a-col>
      </a-row>
    </div>
    <div class="btn-list">
      <a-button type="primary" @click="handleSearch">查找</a-button>
    </div>
    <div class="table-btns">
      <a-button type="primary" @click="handleSearch">删除</a-button>
      <a-button type="primary" @click="handleSearch">导出</a-button>
      <a-button type="primary" @click="handleSearch">打印</a-button>
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
        <a-button type="primary" v-for="item in opts" :key="item.text" size="small" @click="hancleOpt(record.key, item.type)">{{item.text}}</a-button>
      </div>
      </a-table>
    </div>
  </div>
</template>
<script>
  const caseData = ['张医生','王医生','李医生'];
  const zdbwData = ['头部','脸部','腿部','胳膊'];
  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      align: 'center'
    },
    {
      title: '入院日期',
      dataIndex: 'date',
      align: 'center'
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      align: 'center'
    },
    {
      title: '主治医生',
      dataIndex: 'case',
      align: 'center'
    },
    {
      title: '诊断部位',
      dataIndex: 'zdbw',
      align: 'center'
    },
    {
      title: '诊断结果',
      dataIndex: 'zdjg',
      align: 'center'
    },
    {
      title: '操作',
      dataIndex: 'opts',
      align: 'center',
      scopedSlots: { customRender: 'opts' },
      width: 200,
    },
  ];
  const tableData = [
    {
      key: '1',
      name: '李丽丽',
      date: '2020-03-03',
      phone: '18309876789',
      case: '李丽丽',
      zdbw: '头部',
      zdjg: '暂无',
      opts: [{
        text: '查看',
        type: 'get'
      },{
        text: '编辑',
        type: 'edit'
      },{
        text: '删除',
        type: 'del'
      },]
    }
  ];
  export default {
    data() {
      return {
        hospitalNum: '', //住院号
        caseData: caseData,//所有医生信息
        currentCaseName: caseData[0], // 默认医生信息
        zdbwData: zdbwData,//诊断部位数据
        patientName: '',//病人姓名
        sex: 1, // 病人性别
        age: '',
        zdbwText: [], // 诊断部位信息
        zlfsText: '', // 治疗方式
        zljgText: '', // 治疗结果
        columns: columns, // 表格头
        tableData: tableData, // 表格数据
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
      // 点击查找
      handleSearch: function() {
        
      },
      // 处理操作
      hancleOpt: function() {
        
      }
    },
    computed: {
      rowSelection() {
        const { selectedRowKeys } = this;
        return {
          onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
          },
          getCheckboxProps: record => ({
            props: {
              name: record.name,
            },
          }),
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
      }
    }
  }
}

</style>
