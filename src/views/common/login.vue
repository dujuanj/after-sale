<template>
  <div class="site-wrapper site-page--login">
    <div class="site-content__wrapper">
      <div class="site-content">
        <div class="brand-info">
          <h2 class="brand-info__text">HISS 售后服务管理系统</h2>
          <!-- <p class="brand-info__intro">基于vue、element-ui构建开发，实现后台管理前端功能</p> -->
        </div>
        <div class="login-main">
          <h3 class="login-title">管理员登录</h3>
          <el-form
            :model="dataForm"
            :rules="dataRule"
            ref="dataForm"
            @keyup.enter.native="dataFormSubmit()"
            status-icon
          >
            <el-form-item prop="userName">
              <el-input v-model="dataForm.userName" placeholder="帐号" clearable></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input placeholder="请输入密码"
               v-model="dataForm.password"
               :type="passForm.show.old?'text':'password'"
              clearable >
               
              </el-input>
              <!-- <el-input v-model="dataForm.password"   show-password placeholder="密码"></el-input> -->
            </el-form-item>
             <el-form-item >
             
                
               
                  <img
                  :src="passForm.show.old?'../../../static/img/close.png':'../../../static/img/open.png'"
                
                  style="margin: 0 10px;width:25px;cursor:pointer;vertical-align:middle"
                  @click="passForm.show.old=!passForm.show.old"
                />
                <span style='vertical-align:middle'>点击图标显示/隐藏密码</span>
              
             
            </el-form-item>
            
            <!-- <el-form-item prop="captcha">
              <el-row :gutter="20">
                <el-col :span="14">
                  <el-input v-model="dataForm.verification" placeholder="验证码"></el-input>
                </el-col>
                <el-col :span="10" class="login-captcha">
                  <img :src="captchaPath" @click="getCaptcha()" alt />
                </el-col>
              </el-row>
            </el-form-item>-->
            <el-form-item>
              <el-button class="login-btn-submit" type="primary" @click="dataFormSubmit()">登录</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getUUID, clearLoginInfo } from "@/utils";
export default {
  data() {
    return {
      dataForm: {
        userName: "",
        password: "",
        // uuid: "",
        verification: ""
      },
      dataRule: {
        userName: [
          { required: true, message: "帐号不能为空", trigger: "blur" }
        ],
        password: [{ required: true, message: "密码不能为空", trigger: "blur" }]
        // verification: [
        //   { required: true, message: '验证码不能为空', trigger: 'blur' }
        // ]
      },
      captchaPath: "",
      navs: "",
      passForm: {    
        show: {
          old: false,
          new: false,       
        }
      }
    };
  },
  created() {
    this.getCaptcha();
  },
  methods: {
    // 提交表单
    dataFormSubmit() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          //  this.$router.replace({ name: 'home' }) //跳转首页--
          // this.$cookie.set('token','ca2d91cf60136aedb47eb6103c655ef3')
          this.$http_
            .post(
              // this.GLOBAL.baseUrl + "/user.login",
              this.GLOBAL.baseUrl + "/user.loginEx",
              {
                userName: this.dataForm.userName,
                password: this.dataForm.password,
                verification: this.dataForm.verification,
                clientType: "1",
                clientIp: "127.0.0.1"
              },
              {
                headers: {
                  "Content-Type": "application/json;charset=UTF-8"
                }
              }
            )
            .then(res => {
              console.log(res);
              if (res.data.isSuccess == "true") {
                console.log(res);
                console.log(res.data);
                console.log(res.data.data); //sid
                console.log(res.data.data.resList);
                if (
                  res.data.data.resList == [] ||
                  res.data.data.resList.length == 0
                ) {
                  this.$message.error("该用户没有权限登陆");
                }
                // 验证sid是否有效互踢
                if (res.data.data.loginInfo.sid) {
                  this.$http_
                    .post(
                      this.GLOBAL.baseUrl + "/user.sid",
                      {
                        sid: res.data.data.loginInfo.sid
                      },
                      {
                        headers: {
                          "Content-Type": "application/json;charset=UTF-8"
                        }
                      }
                    )
                    .then(({ data }) => {
                      console.log(data);
                      if (data.isSuccess == "true") {
                        window.sessionStorage.setItem(
                          "sid",
                          res.data.data.loginInfo.sid
                        );
                        window.sessionStorage.setItem(
                          "userId",
                          res.data.data.loginInfo.userId
                        );
                        //  window.sessionStorage.setItem('userName',res.data.data.userInfo.userName);
                        window.sessionStorage.setItem(
                          "userName",
                          res.data.data.userRole.userName
                        );
                        window.sessionStorage.setItem(
                          "usrImg",
                          res.data.data.pic.url
                        );
                        //  this.getnav(res.data.data.sid,data.data.userId); //获取菜单列表
                        this.$router.replace({ name: "home" }); //跳转首页--
                        this.$cookie.set("token", res.data.data.loginInfo.sid);
                      } else {
                        this.$message.error(data.errorMsg);
                        clearLoginInfo();
                      }
                    });
                }
                // 互踢结束
              } else {
                this.$message.error(res.data.errorMsg);
              }
              this.dataListLoading = false;
            })
            .catch(res => {
              console.log("err");
            });

          // before
          // this.$http({
          //   url: this.$http.adornUrl('/sys/login'),
          //   method: 'post',
          //   data: this.$http.adornData({
          //     'username': this.dataForm.userName,
          //     'password': this.dataForm.password,
          //     'uuid': this.dataForm.uuid,
          //     'captcha': this.dataForm.captcha
          //   })
          // }).then(({data}) => {
          //   if (data && data.code === 0) {
          //     console.log(data);
          //     this.$cookie.set('token', data.token)
          //     this.$router.replace({ name: 'home' })
          //   } else {
          //     this.getCaptcha()
          //     this.$message.error(data.msg)
          //   }
          // })
        }
      });
    },
    // 获取菜单
    getnav(sid, userId) {
      console.log(sid);
      this.$http_
        .post(
          this.GLOBAL.baseUrl + "/user.queryUserAndResource",
          {
            sid: sid,
            userId: userId
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
            console.log(res);
            console.log(res.data);
            console.log(res.data.data);
            window.sessionStorage.setItem(
              "menuData",
              JSON.stringify(res.data.data)
            );
            //   window.sessionStorage.setItem('sid',res.data.data);
            //   this.$router.replace({ name: 'home' }) //跳转首页--
            //  this.$cookie.set('token',res.data.data);
          }
          this.dataListLoading = false;
        })
        .catch(res => {
          console.log("err");
        });
    },
    // 获取验证码
    getCaptcha() {
      // this.dataForm.uuid = getUUID()
      // console.log( this.dataForm.uuid)
      // this.captchaPath = this.$http.adornUrl(`/captcha.jpg?uuid=${this.dataForm.uuid}`)
    }
  }
};
</script>

<style lang="scss">
.site-wrapper.site-page--login {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(38, 50, 56, 0.6);
  overflow: hidden;
  &:before {
    position: fixed;
    top: 0;
    left: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
    content: "";
    background-image: url(~@/assets/img/login_bg.jpg);
    background-size: cover;
  }
  .site-content__wrapper {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    padding: 0;
    margin: 0;
    overflow-x: hidden;
    overflow-y: auto;
    background-color: transparent;
  }
  .site-content {
    min-height: 100%;
    padding: 30px 500px 30px 30px;
  }
  .brand-info {
    margin: 220px 100px 0 90px;
    color: #fff;
  }
  .brand-info__text {
    margin: 0 0 22px 0;
    font-size: 48px;
    font-weight: 400;
    text-transform: uppercase;
  }
  .brand-info__intro {
    margin: 10px 0;
    font-size: 16px;
    line-height: 1.58;
    opacity: 0.6;
  }
  .login-main {
    position: absolute;
    top: 0;
    right: 0;
    padding: 150px 60px 180px;
    width: 470px;
    min-height: 100%;
    background-color: #fff;
  }
  .login-title {
    font-size: 16px;
  }
  .login-captcha {
    overflow: hidden;
    > img {
      width: 100%;
      cursor: pointer;
    }
  }
  .login-btn-submit {
    width: 100%;
    margin-top: 38px;
  }
}
</style>
