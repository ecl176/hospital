<template>
  <div class='dictionary-content'>
    <p class="head-title">
      <span>字典管理</span>
    </p>
    <div class="dictionary-box">
      <a-tabs default-active-key="1" @change="hancleTabChange">
        <a-tab-pane key="1" tab="诊断">
          <div class="list-item">
            <a-list bordered :data-source="allZdData">
              <a-list-item slot="renderItem" slot-scope="item">
                {{ item.value }}
                <a-button type="primary" size="small" @click="handleDelItem(item.type, item.value)">
                  删除
                </a-button>
              </a-list-item>
            </a-list>
            <a-input placeholder="请输入诊断部位" style="margin-top: 15px;" v-model="inputValue"/>
            <a-button type="primary" style="margin-top: 15px;" @click="handleAddItem('DIAGNOSIS_TYPE')">
              添加
            </a-button>
          </div>
        </a-tab-pane>
        <a-tab-pane key="2" tab="手术名称" force-render>
          <div class="list-item">
            <a-list bordered :data-source="allSsfsData">
              <a-list-item slot="renderItem" slot-scope="item">
                {{ item.value }}
                <a-button type="primary" size="small" @click="handleDelItem(item.type, item.value)">
                  删除
                </a-button>
              </a-list-item>
            </a-list>
            <a-input placeholder="请输入诊断部位" style="margin-top: 15px;" v-model="inputValue"/>
            <a-button type="primary" style="margin-top: 15px;" @click="handleAddItem('OPERATION_NAME_TYPE')">
              添加
            </a-button>
          </div>
        </a-tab-pane>
        <a-tab-pane key="3" tab="治疗方式">
          <div class="list-item">
            <a-list bordered :data-source="allZlfsData">
              <a-list-item slot="renderItem" slot-scope="item">
                {{ item.value }}
                <a-button type="primary" size="small" @click="handleDelItem(item.type, item.value)">
                  删除
                </a-button>
              </a-list-item>
            </a-list>
            <a-input placeholder="请输入诊断部位" style="margin-top: 15px;" v-model="inputValue"/>
            <a-button type="primary" style="margin-top: 15px;" @click="handleAddItem('TREATMENT_METHOD_TYPE')">
              添加
            </a-button>
          </div>
        </a-tab-pane>
        <a-tab-pane key="4" tab="治疗结果">
          <div class="list-item">
            <a-list bordered :data-source="allZljgData">
              <a-list-item slot="renderItem" slot-scope="item">
                {{ item.value }}
                <a-button type="primary" size="small" @click="handleDelItem(item.type, item.value)">
                  删除
                </a-button>
              </a-list-item>
            </a-list>
            <a-input placeholder="请输入诊断部位" style="margin-top: 15px;" v-model="inputValue"/>
            <a-button type="primary" style="margin-top: 15px;" @click="handleAddItem('TREATMENT_OUTCOME_TYPE')">
              添加
            </a-button>
          </div>
        </a-tab-pane>
        <a-tab-pane key="5" tab="职称">
          <div class="list-item">
            <a-list bordered :data-source="allTitleType">
              <a-list-item slot="renderItem" slot-scope="item">
                {{ item.value }}
                <a-button type="primary" size="small" @click="handleDelItem(item.type, item.value)">
                  删除
                </a-button>
              </a-list-item>
            </a-list>
            <a-input placeholder="请输入职称" style="margin-top: 15px;" v-model="inputValue"/>
            <a-button type="primary" style="margin-top: 15px;" @click="handleAddItem('TITLE_TYPE')">
              添加
            </a-button>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        allZdData: [],//诊断部位数据
        allSsfsData: [],//所有手术名称数据
        allZlfsData: [],//所有治疗方式数据
        allZljgData: [],//所有治疗结果数据
        allTitleType: [],//所有职称数据
        inputValue:'',
        currentType:''
      };
    },
    mounted() {
      this.getDiagnosisData();//获取所有诊断数据
      this.getOperationData();// 获取所有手术名称数据
      this.getTreatmentMethodData();// 获取所有治疗方式数据
      this.getTreatmentOutcomeData();// 获取所有治疗结果数据
      this.getCaseTitleType();//获取所有职称信息
    },
    methods: {
     // 获取所有诊断数据
      getDiagnosisData() {
        const self = this;
        self.$http.get('/swing/dictionary/DIAGNOSIS_TYPE').then((res) => {
          if(res.status === 200) {
            const data = res.data;
            self.allZdData = [];
            // data.forEach((item) => {
            //   self.allZdData.push(item.value);
            // });
            self.allZdData = data;
          }
        }).catch(() => {
          self.$message.error('请求失败');
        });
      },
      //获取所有手术名称数据
      getOperationData() {
        const self = this;
        self.$http.get('/swing/dictionary/OPERATION_NAME_TYPE').then((res) => {
          if(res.status === 200) {
            const data = res.data;
            self.allSsfsData = [];
            // data.forEach((item) => {
            //   self.allSsfsData.push(item.value);
            // });
            self.allSsfsData = data;
          }
        }).catch(() => {
          self.$message.error('请求失败');
        });
      },
      // 获取所有治疗方式数据
      getTreatmentMethodData() {
        const self = this;
        self.$http.get('/swing/dictionary/TREATMENT_METHOD_TYPE').then((res) => {
          if(res.status === 200) {
            const data = res.data;
            self.allZlfsData = [];
            // data.forEach((item) => {
            //   self.allZlfsData.push(item.value);
            // });
            self.allZlfsData = data;
          }
        }).catch(() => {
          self.$message.error('请求失败');
        });
      },
      //获取所有治疗结果数据
      getTreatmentOutcomeData() {
        const self = this;
        self.$http.get('/swing/dictionary/TREATMENT_OUTCOME_TYPE').then((res) => {
          if(res.status === 200) {
            const data = res.data;
            self.allZljgData = [];
            // data.forEach((item) => {
            //   self.allZljgData.push(item.value);
            // });
            self.allZljgData = data;
          }
        }).catch(() => {
          self.$message.error('请求失败');
        });
      },
      getCaseTitleType() {
        const self = this;
        self.$http.get('/swing/dictionary/TITLE_TYPE')
        .then((res) => {
          if(res.status === 200) {
            const data = res.data;
            self.allTitleType = [];
            self.allTitleType = data;
          }
        }).catch(() => {
          self.$message.error('请求失败');
        });
      },
      //删除
      handleDelItem(type, item) {
        const self = this;
        self.currentType = type;
        const params = [{
          type: type,
          value: item
        }];
        console.log(params);
        self.$http.post('/swing/dictionary/multipleDelete', params)
        .then(() => {
          self.$message.success('删除成功');
          switch(self.currentType) {
            case 'DIAGNOSIS_TYPE':
              self.getDiagnosisData();
              break;
            case 'OPERATION_NAME_TYPE':
              self.getOperationData();
              break;
            case 'TREATMENT_METHOD_TYPE':
              self.getTreatmentMethodData();
              break;
            case 'TREATMENT_OUTCOME_TYPE':
              self.getTreatmentOutcomeData();
              break;
            default:
              self.getCaseTitleType();
              break;
          }
        }).catch((err) => {
          console.log(err);
        });
      },
      handleAddItem(type) {
        const self = this;
        self.currentType = type;
        const params = {
          type: type,
          value: self.inputValue
        };
        self.$http.post('/swing/dictionary/addition', params)
        .then(() => {
          self.inputValue = '';
          self.$message.success('添加成功');
          switch(self.currentType) {
            case 'DIAGNOSIS_TYPE':
              self.getDiagnosisData();
              break;
            case 'OPERATION_NAME_TYPE':
              self.getOperationData();
              break;
            case 'TREATMENT_METHOD_TYPE':
              self.getTreatmentMethodData();
              break;
            case 'TREATMENT_OUTCOME_TYPE':
              self.getTreatmentOutcomeData();
              break;
            case 'TITLE_TYPE':
              self.getCaseTitleType();
              break;
          }
        }).catch((err) => {
          console.log(err);
        });
      },
      hancleTabChange() {
        this.inputValue = '';
      }
    },
  };
</script>
<style lang="scss" scoped>
  .dictionary-content {
    padding-bottom: 20px;
    .head-title {
      height: 36px;
      line-height: 36px;
      border-bottom: 1px solid #eee;
      padding-left: 15px;
      font-size: 16px;
      margin-bottom: 10px;
    }
    .dictionary-box {
      margin-left: 20px;
      position: relative;
      &:before {
        content: '';
        width: 20px;
        position: absolute;
        height: 1px;
        background-color: #e8e8e8;
        left: -20px;
        top: 43px;
      }
      .list-item {
        margin-right: 20px;
        width: 500px;
        .ant-list {
          .ant-btn {
            position: absolute;
            right: 30px;
            margin-top: -2px;
          }
        }
        > .atn-btn {
          margin-top: 15px;
          display: block;
        }
      }
    }
  }
</style>
