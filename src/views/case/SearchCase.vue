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
      </a-row>
    </div>
    <div class="btn-list">
      <a-button type="primary" @click="handleUpload">查询</a-button>
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
      </a-table>
    </div>
  </div>
</template>
<script>
  const caseData = ['张医生','王医生','李医生'];
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
  ];
  const tableData = [
    {
      key: '1',
      name: '李丽丽',
      date: '2020-03-03',
      phone: '18309876789',
      case: '李丽丽',
      zdbw: '头部',
      zdjg: '暂无'
    }
  ];
  export default {
    data() {
      return {
        caseData: caseData,//所有医生信息
        currentCaseName: caseData[0], // 默认医生信息
        caseName: '',//病人姓名
        sex: 1,
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
      // 点击确定
      handleUpload: function() {
        
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
  }
}

</style>
