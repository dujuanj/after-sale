<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="80px"
    >
      <el-form-item label="类型" prop="type">
        <!-- <el-radio-group v-model="dataForm.type">
          <el-radio v-for="(type, index) in dataForm.type" :label="index" :key="index">{{ type==1?"菜单":type==2?"按扭":'' }}</el-radio>
        </el-radio-group>-->
        <el-radio v-model="dataForm.type" label="1">菜单</el-radio>
        <el-radio v-model="dataForm.type" label="2">按扭</el-radio>
      </el-form-item>
      <el-form-item :label=" '名称'" prop="name">
        <el-input v-model="dataForm.name" :placeholder="'名称'"></el-input>
      </el-form-item>
      <el-form-item label="上级菜单" prop="parentName" v-if='!dataForm.parentId'>
        <el-popover ref="menuListPopover" placement="bottom-start" trigger="click">
          <el-tree
            :data="menuList"
            :props="menuListTreeProps"
            node-key="id"
            ref="menuListTree"
            @current-change="menuListTreeCurrentChangeHandle"
            :default-expand-all="true"
            :highlight-current="true"
            :expand-on-click-node="false"
          ></el-tree>
        </el-popover>
        <el-input
          v-model="dataForm.parentName"
          v-popover:menuListPopover
          :readonly="true"
          placeholder="点击选择上级菜单"
          class="menu-list__input"
        ></el-input>
      </el-form-item>
      <el-form-item v-if="dataForm.type == 1" label="菜单路由" prop="url">
        <el-input v-model="dataForm.url" placeholder="菜单路由"></el-input>
      </el-form-item>
      <el-form-item v-if="dataForm.type !== 0" label="api" prop="perms">
        <el-input v-model="dataForm.api" placeholder="对应的api接口"></el-input>
      </el-form-item>
      <el-form-item label="详细说明" prop="perms">
        <el-input v-model="dataForm.detail" placeholder="详细说明"></el-input>
      </el-form-item>
      <!-- <el-form-item v-if="dataForm.type !== 2" label="排序号" prop="orderNum">
        <el-input-number v-model="dataForm.orderNum" controls-position="right" :min="0" label="排序号"></el-input-number>
      </el-form-item>-->
      <!-- <el-form-item v-if="dataForm.type !== 2" label="菜单图标" prop="icon">
        <el-row>
          <el-col :span="22">
            <el-popover
              ref="iconListPopover"
              placement="bottom-start"
              trigger="click"
              popper-class="mod-menu__icon-popover">
              <div class="mod-menu__icon-list">
                <el-button
                  v-for="(item, index) in iconList"
                  :key="index"
                  @click="iconActiveHandle(item)"
                  :class="{ 'is-active': item === dataForm.icon }">
                  <icon-svg :name="item"></icon-svg>
                </el-button>
              </div>
            </el-popover>
            <el-input v-model="dataForm.icon" v-popover:iconListPopover :readonly="true" placeholder="菜单图标名称" class="icon-list__input"></el-input>
          </el-col>
          <el-col :span="2" class="icon-list__tips">
            <el-tooltip placement="top" effect="light">
              <div slot="content">全站推荐使用SVG Sprite, 详细请参考:<a href="//github.com/daxiongYang/renren-fast-vue/blob/master/src/icons/index.js" target="_blank">icons/index.js</a>描述</div>
              <i class="el-icon-warning"></i>
            </el-tooltip>
          </el-col>
        </el-row>
      </el-form-item>-->
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { treeDataTranslate } from "@/utils";
import Icon from "@/icons";
export default {
  data() {
    var validateUrl = (rule, value, callback) => {
      if (this.dataForm.type === 1 && !/\S/.test(value)) {
        callback(new Error("菜单URL不能为空"));
      } else {
        callback();
      }
    };
    return {
      visible: false,
      newform:false,
      dataForm: {
        id: 0,
        type: '',
        // typeList: ['目录', '菜单', '按钮'],
        typeList: ["", "菜单", "按钮"],
        name: "",
        parentId: 0,
        parentName: "",
        url: "",
        perms: "",
        orderNum: 0,
        icon: "",
        iconList: []
      },
      dataRule: {
        name: [
          { required: true, message: "菜单名称不能为空", trigger: "blur" }
        ],
        // parentName: [
        //   { required: true, message: "上级菜单不能为空", trigger: "change" }
        // ],
        url: [{ validator: validateUrl, trigger: "blur" }]
      },
      menuList: [],
      menuListTreeProps: {
        label: "name",
        children: "childList"
      }
    };
  },
  created() {
    this.iconList = Icon.getNameList();
  },
  methods: {
    init(id, datas) {
      this.dataForm.id = id || 0;
      this.visible = true;

     
      if (datas != undefined || datas != null) {
        this.dataForm = datas;
        console.log(datas);
        console.log(this.dataForm.type);
        console.log(typeof this.dataForm.type);
        this.dataForm.type=String(datas.type);
         this.newform = false;
      }else{
         this.newform=true;
         this.dataForm ={};
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
          if (res.status == "200") {
            console.log(res.data.data);
            this.menuList = res.data.data.menuList;
            console.log(this.menuList);
            // this.totalPage = res.data.data.total;
          }
          this.dataListLoading = false;
        })
        .catch(res => {
          console.log("err");
        });
      }
      // this.$http({
      //   url: this.$http.adornUrl('/sys/menu/select'),
      //   method: 'get',
      //   params: this.$http.adornParams()
      // }).then(({data}) => {
      //   this.menuList = treeDataTranslate(data.menuList, 'menuId')
      // }).then(() => {
      //   this.visible = true
      //   this.$nextTick(() => {
      //     this.$refs['dataForm'].resetFields()
      //   })
      // }).then(() => {
      //   if (!this.dataForm.id) {
      //     // 新增
      //     this.menuListTreeSetCurrentNode()
      //   } else {
      //     // 修改
      //     this.$http({
      //       url: this.$http.adornUrl(`/sys/menu/info/${this.dataForm.id}`),
      //       method: 'get',
      //       params: this.$http.adornParams()
      //     }).then(({data}) => {
      //       this.dataForm.id = data.menu.menuId
      //       this.dataForm.type = data.menu.type
      //       this.dataForm.name = data.menu.name
      //       this.dataForm.parentId = data.menu.parentId
      //       this.dataForm.url = data.menu.url
      //       this.dataForm.perms = data.menu.perms
      //       this.dataForm.orderNum = data.menu.orderNum
      //       this.dataForm.icon = data.menu.icon
      //       this.menuListTreeSetCurrentNode()
      //     })
      //   }
      // })
    },
    // 菜单树选中
    menuListTreeCurrentChangeHandle(data, node) {
      this.dataForm.parentId = data.parentId;
      this.dataForm.parentName = data.name;
    },
    // 菜单树设置当前选中节点
    menuListTreeSetCurrentNode() {
      this.$refs.menuListTree.setCurrentKey(this.dataForm.parentId);
      this.dataForm.parentName = (this.$refs.menuListTree.getCurrentNode() ||
        {})["name"];
    },
    // 图标选中
    iconActiveHandle(iconName) {
      this.dataForm.icon = iconName;
    },
    // 表单提交
    dataFormSubmit() {
      this.dataForm.sid=window.sessionStorage.getItem('sid');
      this.dataForm.type=Number(this.dataForm.type);
      if(this.newform==true){
        //新建菜单及命令
        this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.$http_
        .post(
          this.GLOBAL.baseUrl + "/resource.add",        
           this.dataForm,
          {
            headers: {
              "Content-Type": "application/json;charset=UTF-8"
            }
          }
        ).then(({ data }) => {
            if (data .isSuccess == 'true') {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.visible = false;
                  this.$emit("refreshDataList");
                }
              });
            } else {
              this.$message.error(data.errorMsg);
            }
          });
        }
      });
      }else{
        // 修改菜单
        this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.$http_
        .post(
          this.GLOBAL.baseUrl + "/resource.update",        
           this.dataForm,
          {
            headers: {
              "Content-Type": "application/json;charset=UTF-8"
            }
          }
        ).then(({ data }) => {
            console.log(data);
             if (data .isSuccess == 'true') {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.visible = false;
                  this.$emit("refreshDataList");
                }
              });
            } else {
              this.$message.error(data.msg);
            }
          });
        }
      });
      }
      
    }
  }
};
</script>

<style lang="scss">
.mod-menu {
  .menu-list__input,
  .icon-list__input {
    > .el-input__inner {
      cursor: pointer;
    }
  }
  &__icon-popover {
    max-width: 370px;
  }
  &__icon-list {
    max-height: 180px;
    padding: 0;
    margin: -8px 0 0 -8px;
    > .el-button {
      padding: 8px;
      margin: 8px 0 0 8px;
      > span {
        display: inline-block;
        vertical-align: middle;
        width: 18px;
        height: 18px;
        font-size: 18px;
      }
    }
  }
  .icon-list__tips {
    font-size: 18px;
    text-align: center;
    color: #e6a23c;
    cursor: pointer;
  }
}
</style>
