<template>
  <div class="login-container">
    <div class="screen">
      <video class="video" autoplay loop preload="metadata" width="100%" height="100%">
        <source src="./l.mp4" type="video/mp4">
        <source src="./l.webm" type="video/webm">
      </video>
    </div>
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-width="0px">
      <div class="title">一站式医院后勤管理系统</div>
      <el-row class="nameAndPassWord">
        <el-col>
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              clearable
              name="username"
              type="text"
              auto-complete="on"
              placeholder="请输入帐号">
              <svg-icon slot="prefix" icon-class="useName" class="svgIcon"/>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="nameAndPassWord">
        <el-col>
          <el-form-item prop="password">
            <el-input
              :type="pwdType"
              v-model="loginForm.password"
              clearable
              name="password"
              auto-complete="on"
              placeholder="请输入密码"
              @keyup.enter.native="handleLogin">
              <svg-icon slot="prefix" icon-class="passWord" class="svgIcon"/>
            </el-input>
            <span class="show-pwd" @click="showPwd">
              <svg-icon :icon-class="pwdType === 'password' ? 'eye' : 'eye-open'" />
            </span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="65">
        <el-col :span="12" class="vsCode">
          <el-form-item
            label="验证码:"
            label-width="59px"
            prop="verificationCode">
            <el-input
              v-model="loginForm.verificationCode"
              clearable
              type="text"
              name="verificationCode"
              auto-complete="on"
              style="width:110px;padding-left:0;"
              placeholder="请输入验证码"
              @keyup.enter.native="handleLogin"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <div @click="getCodeFunc">
            <el-image
              v-loading="codeLoading"
              :src="codeUrl"
              class="imgborder"
            />
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12" class="keepPasswords">
          <el-form-item>
            <el-checkbox v-model="loginForm.rememberPassWord" text-color="#00B7FF" label="记住密码" checked/>
          </el-form-item>
        </el-col>
        <el-col :span="12" align="right" class="keepPasswords">
          <el-button type="text" class="forgetPasswords">忘记密码?</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item>
            <el-button
              :loading="loading"
              class="sign"
              @click.native.prevent="handleLogin">
              登录
            </el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { getCode } from '@/api/login'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (Object.is(value, '')) {
        callback(new Error('请输入帐号'))
      }
      callback()
    }
    const validatePass = (rule, value, callback) => {
      if (Object.is(value, '')) {
        callback(new Error('请输入密码'))
      }
      if (value.length < 5) {
        callback(new Error('密码不能小于5位'))
      } else {
        callback()
      }
    }
    return {
      codeUrl: '',
      codeLoading: false,
      loginForm: {
        username: '',
        password: '',
        verificationCode: '',
        rememberPassWord: true,
        requestId: ''
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePass }
        ],
        verificationCode: [
          { required: false, message: '请输入验证码', trigger: 'blur' }
        ]
      },
      loading: false,
      pwdType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  mounted() {
    this.getCodeFunc()
    this.autoLogin()
  },
  methods: {
    async autoLogin() {
      const query = this.$route.query
      console.log(query)
      if (query.username && query.pwd) {
        this.loginForm.username = query.username
        this.loginForm.password = query.pwd
        this.handleLogin()
      }
    },
    async getCodeFunc() {
      try {
        this.codeLoading = true
        const r = await getCode()
        this.loginForm['requestId'] = r['data']['requestId']
        this.codeUrl = r['data']['url']
      } catch (e) {
        console.log(e)
      } finally {
        this.codeLoading = false
      }
    },
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('Login', this.loginForm).then(() => {
            this.loading = false
            this.$router.push({ path: this.redirect || '/' })
          }).catch(() => {
            this.getCodeFunc()
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg:#2d3a4b;
$light_gray:#eee;
$whiteCharacter: #FDFDFD;

/* reset element-ui css */
.login-container {
  .el-input {
    opacity: 0.8;
    display: inline-block;
    height: 47px;
    width: 100%;
    // padding-left: 20px;
    background: rgba(255,255,255,0.08);
    border-radius: 4px;
    border:1px solid rgba(0,126,170,1);
    input {
      padding-bottom: 2px;
      background: rgba(255,255,255,0.08);
      border: 0px;
      -webkit-appearance: none;
      color: #d4d4d4;
      opacity: 0.6;
      height: 47px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
      &::-webkit-input-placeholder{
        // padding-left: 20px;
        color: #d4d4d4;
        opacity: 0.6;
        font-size: 12px;
      }
    }
  }
  .el-input--suffix .el-input__inner {
    padding-left: 50px;
    padding-right: 0px;
  }
  .el-form-item__label{
    color: $whiteCharacter;
    font-size: 14px;
  }
  .el-checkbox__input.is-checked+.el-checkbox__label {
    color: #00B7FF;
  }
  .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background-color: #03B6FD;
    border-color: rgba(3,182,253,1);;
  }
}

// 验证码
.vsCode {
  height: 47px;
  .el-input--suffix .el-input__inner {
    padding-left: 10px;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
$whiteCharacter: #FDFDFD;
$fontWeight: 400;

.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  .screen {
    position: absolute;
    top:0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 0;
    overflow: hidden;
    .video {
      position: absolute;
      object-fit: cover;
    }
  }

  // 表单
  .login-form {
    width: 390px;
    height: 400px;
    max-width: 100%;
    padding: 24px 50px 34px;
    margin: 0 60%; /*水平居中*/
    position: relative;
    top: 50%; /*偏移*/
    transform: translateY(-50%);
    background-image: url('../../assets/images/denglubeijiang.png')
  }

  .nameAndPassWord{
    margin-bottom: 8px;
  }

  // icon
  .svgIcon{
    width: 16px;
    height: 16px;
    margin-left: 10px;
    margin-top: 15px;
  }

  // 图片边框
  .imgborder {
    width: 110px;
    height: 48px;
    color: #007EAA;
    vertical-align: middle;
    background: rgba(255,255,255,0.08);
    border-radius: 4px 2px 2px 2px;
    border: 1px solid rgba(0,134,178,1);
  }

  // 大标题
  .title {
    font-size: 24px;
    font-weight: $fontWeight;
    color: $whiteCharacter;
    margin-bottom: 26px;
    text-align: center;
  }

  // 记住密码
  .keepPasswords{
    margin-top: 15px;
    height: 37px;
    .forgetPasswords{
      color: #00B7FF;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  // 新增button 按钮样式
  .sign{
    font-size: 16px;
    font-weight: $fontWeight;
    color: $whiteCharacter;
    width: 290px;
    height: 40px;
    background: linear-gradient(180deg,rgba(0,173,251,1) 0%,rgba(1,124,230,1) 100%);
    border-radius: 2px;
    border: 0;
  }
}
</style>
