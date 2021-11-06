<template>
  <div>
    <div class="v-modal" style="z-index: 1; opacity: 0.8" />
    <div class="login el-dialog__wrapper" style="z-index: 1">
      <el-card role="dialog">
        <div slot="header" class="clearfix text-center">
          <span> {{ $t("title") }}</span>
        </div>
        <el-image
          class="d-block w-50 ml-auto mr-auto mb-4"
          src="/images/logo.png"
        />
        <el-form
          ref="form"
          :model="model"
          :rules="rules"
          class="login-form"
          @submit.native.prevent="btnLoginClicked"
        >
          <el-form-item prop="email">
            <el-input
              ref="emailInput"
              v-model="model.email"
              :placeholder="$t('inputInput')"
              prefix-icon="fas fa-user"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="model.password"
              :placeholder="$t('inputPassword')"
              prefix-icon="fas fa-lock"
              show-password
              type="password"
            />
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="model.rememberMe"
              >{{ $t("inputRememberMe") }}
            </el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button
              :loading="loadingLogin"
              block
              class="login-button"
              native-type="submit"
              type="primary"
            >
              {{ $t("btnSubmit") }}
            </el-button>
            <div class="mt-1">
              <el-button
                :loading="loadingRegister"
                block
                class="login-button"
                type="warning"
                @click="btnRegisterClicked"
              >
                {{ $t("btnRegister") }}
              </el-button>
            </div>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Ref } from "vue-property-decorator";
import { ElInput } from "element-ui/types/input";
import { ElForm } from "element-ui/types/form";
import { LoginDto } from "../dto/login.dto";
import { validator } from "../../element-io/form-validation.utils";
import { AuthService } from "../auth.service";

@Component
export default class Login extends Vue {
  @Ref("form") readonly refForm!: ElForm;
  @Ref("emailInput") readonly refUsernameInput!: ElInput;
  private loadingLogin = false;
  private loadingRegister = false;
  private model: LoginDto = {
    email: "",
    password: "",
    rememberMe: false,
  };

  get rules() {
    return {
      email: [validator.email],
      password: [
        {
          required: true,
          min: 5,
          message: this.$tc("passwordAtLeast5Characters"),
        },
      ],
    };
  }

  async btnLoginClicked(): Promise<void> {
    const formRef = this.refForm;
    const valid = await formRef.validate();
    if (!valid) {
      return;
    }
    this.loadingLogin = true;
    this.$store
      .dispatch("loginByLoginDto", this.model)
      .then(() => {
        this.$emit("after-login");
      })
      .catch(() => {
        this.$message.error(this.$tc("lblLoginFailed"));
        formRef.resetFields();
        this.$nextTick(() => this.refUsernameInput.focus());
      })
      .finally(() => {
        this.loadingLogin = false;
      });
  }

  async btnRegisterClicked() {
    const formRef = this.refForm;
    const valid = await formRef.validate();
    if (!valid) {
      return;
    }
    this.loadingRegister = true;
    AuthService.register(this.model)
      .then(() => {
        this.refForm.resetFields();
        this.$message.success(this.$tc("registerSuccess"));
      })
      .finally(() => (this.loadingRegister = false));
  }
}
</script>

<style lang="css" scoped>
.login {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-button {
  width: 100%;
}

.login-form {
  width: 290px;
}
</style>
<style lang="scss">
$teal: rgb(0, 124, 137);
.el-button--primary {
  background: $teal;
  border-color: $teal;

  &:hover,
  &.active,
  &:focus {
    background: lighten($teal, 7);
    border-color: lighten($teal, 7);
  }
}

.login .el-input__inner:hover {
  border-color: $teal;
}

.forgot-password {
  margin-top: 10px;
}

.login .el-input__prefix {
  background: rgb(238, 237, 234);
  height: calc(100% - 2px);
  left: 1px;
  top: 1px;
  border-radius: 3px;

  .el-input__icon {
    width: 30px;
  }
}

.login .el-input input {
  padding-left: 35px;
}

.login .el-card {
  padding-top: 0;
}

h2 {
  letter-spacing: 1px;
  font-family: Roboto, sans-serif;
  padding-bottom: 20px;
}

a {
  color: $teal;
  text-decoration: none;

  &:hover,
  &:active,
  &:focus {
    color: lighten($teal, 7);
  }
}

.login .el-card {
  width: 340px;
}
</style>

<i18n>
{
  "tr": {
    "cantBeEmpty": "Bu alan boş bırakılamaz",
    "passwordAtLeast5Characters": "Parola en az 5 karakter olmalıdır",
    "routerTitle": "Giriş Yap",
    "title": "Hoş Geldiniz",
    "inputInput": "Kullanıcı Adı",
    "inputPassword": "Parola",
    "inputRememberMe": "Beni Hatırla",
    "btnSubmit": "Giriş Yap",
    "lblLoginFailed": "Giriş başarısız",
    "btnRegister": "Kayıt Ol",
    "registerSuccess": "Kayıt başarılı"
  }
}
</i18n>
