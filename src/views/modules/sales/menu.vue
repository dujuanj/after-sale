<template>
  <div class="mod-menu">
    <el-form :inline="true" :model="dataForm">
      <el-form-item>
        <el-button v-if="isAuth('/api/postsale/resource.add')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      style="width: 100%;"
      >
      <el-table-column
        prop="id"
        header-align="center"
        align="center"
        width="80"
        label="ID">
      </el-table-column>
      <table-tree-column
        prop="name"
        header-align="center"
        treeKey="id"
        width="200"
        :indent= '16'
        label="名称">
      </table-tree-column>
      <el-table-column
        prop="parentId"
        header-align="center"
        align="center"
        width="120"
        label="parentID">
      </el-table-column>
      <!-- <el-table-column
        header-align="center"
        align="center"
        label="图标">
        <template slot-scope="scope">
          <icon-svg :name="scope.row.icon || ''"></icon-svg>
        </template>
      </el-table-column> -->
      <el-table-column
        prop="type"
        header-align="center"
        align="center"
        label="类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type == 0" size="small">目录</el-tag>
          <el-tag v-else-if="scope.row.type == 1" size="small" type="success">菜单</el-tag>
          <el-tag v-else-if="scope.row.type == 2" size="small" type="info">按钮</el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop="orderNum"
        header-align="center"
        align="center"
        label="排序号">
      </el-table-column> -->
      <el-table-column
        prop="url"
        header-align="center"
        align="center"
        width="650"
        :show-overflow-tooltip="true"
        label="菜单URL">
      </el-table-column>
      <el-table-column
        prop="api"
        header-align="center"
        align="center"
        width="250"
        :show-overflow-tooltip="true"
        label="授权标识">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('/api/postsale/resource.update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id,scope.row)">修改</el-button>
          <el-button v-if="isAuth('/api/postsale/resource.delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗, 新增 / 修改 -->
     <!-- <el-table
    :data="dataList"
    style="width: 100%;margin-bottom: 20px;"
    row-key="id"
    border
    
    :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
    <el-table-column
      prop="date"
      label="日期"
      sortable
      width="180">
    </el-table-column>
    <el-table-column
      prop="name"
      label="姓名"
      sortable
      width="180">
    </el-table-column>
    <el-table-column
      prop="address"
      label="地址">
    </el-table-column>
  </el-table> -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import TableTreeColumn from '@/components/table-tree-column'
  import AddOrUpdate from './menu-add-or-update'
  import { treeDataTranslate } from '@/utils'
  export default {
    data () {
      return {
        dataForm: {},
        dataList: [{
          id: '1',
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          id: '2',
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          id: '3',
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄',
          childList: [{
              id: 31,
              date: '2016-05-01',
              name: '王小vv',
              address: '上海市普陀区金沙江路 1519 弄'
            }, {
              id: 32,
              date: '2016-05-01',
              name: '王小aa',
              address: '上海市普陀区金沙江路 1519 弄'
          }]
        }, {
          id: 4,
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }],
        dataListLoading: false,
        addOrUpdateVisible: false
      }
    },
    components: {
      TableTreeColumn,
      AddOrUpdate
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        // this.$http({
        //   url: this.$http.adornUrl('/sys/menu/list'),
        //   method: 'get',
        //   params: this.$http.adornParams()
        // }).then(({data}) => {
         
        //   this.dataList = treeDataTranslate(data, 'menuId');
        //    console.log(this.dataList);
        //   this.dataListLoading = false
        // })
        this.$http_
        .post(
          this.GLOBAL.baseUrl + "/resource.queryAll",
          {
            sid: window.sessionStorage.getItem("sid")
          },
          {
            headers: {
              "Content-Type": "application/json;charset=UTF-8"
            }
          }
        )
        .then(res => {
          console.log(res);
        
            console.log(res.data.data);
            this.dataList = res.data.data.menuList;
            console.log(this.dataList);
            // this.totalPage = res.data.data.total;
          
          this.dataListLoading = false;
        })
        .catch(res => {
          console.log("err");
        });
      },
      // 新增 / 修改
      addOrUpdateHandle (id,datas) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id,datas)
        })
      },
      // 删除
      deleteHandle (id) {
        this.$confirm(`确定对[id=${id}]进行[删除]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
           this.$http_
              .post(this.GLOBAL.baseUrl + "/resource.delete", 
              {
                sid:window.sessionStorage.getItem('sid'),
                id:id
              }, {
                headers: {
                  "Content-Type": "application/json;charset=UTF-8"
                }
              })
              .then(({ data }) => {
                console.log(data.isSuccess);
                if(data.isSuccess=='true'){
                  this.$message({
                  message: "操作成功",
                  type: "success",
                  duration: 1500,
                  onClose: () => {
                    this.visible = false;
                    this.getDataList()
                  }
                });
                }else{
                   this.$message.error(data.errorMsg);
                }
                
              });
        }).catch(() => {})
      }
    }
  }
</script>
