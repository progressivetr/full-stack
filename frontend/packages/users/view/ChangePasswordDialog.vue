<template>
  <el-dialog
    :title="$t('title')"
    :visible.sync="show"
    destroy-on-close
    width="450px"
    :close-on-click-modal="false"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="150px">
      <el-form-item :label="$t('lblOldPassword')" prop="oldPassword">
        <el-input
          v-model="form.oldPassword"
          prefix-icon="fas fa-lock"
          show-password
          type="password"
        />
      </el-form-item>
      <el-form-item :label="$t('lblNewPassword')" prop="newPassword">
        <el-input
          v-model="form.newPassword"
          prefix-icon="fas fa-lock"
          show-password
          type="password"
        />
      </el-form-item>
      <el-form-item
        :label="$t('lblConfirmNewPassword')"
        prop="newPasswordConfirm"
      >
        <el-input
          v-model="form.newPasswordConfirm"
          prefix-icon="fas fa-lock"
          show-password
          type="password"
        />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button icon="el-icon-close" type="danger" @click="show = false">{{
        $t("btnCancel")
      }}</el-button>
      <el-button
        :loading="saveLoading"
        icon="el-icon-check"
        type="success"
        @click="btnSaveClicked"
        >{{ $t("btnSave") }}</el-button
      >
    </span>
  </el-dialog>
</template>

<script lang="ts">
import { Component, PropSync, Ref, Vue } from "vue-property-decorator";
import { ElForm } from "element-ui/types/form";
import { UserService } from "../user.service";

class FormModel {
  oldPassword!: string;
  newPassword!: string;
  newPasswordConfirm!: string;
}

@Component
export default class ChangePasswordDialog extends Vue {
  @PropSync("visible", { required: true, type: Boolean })
  show!: boolean;

  @Ref("form") readonly refForm!: ElForm;

  private saveLoading = false;
  private form: FormModel = new FormModel();

  get rules(): any {
    return {
      oldPassword: [
        {
          required: true,
          message: this.$tc("validationCannotBeEmpty"),
        },
      ],
      newPassword: [
        {
          required: true,
          message: this.$tc("validationCannotBeEmpty"),
        },
      ],
      newPasswordConfirm: [
        {
          required: true,
          message: this.$tc("validationCannotBeEmpty"),
        },
        {
          validator: (rule: any, value: any, callback: any) => {
            if (value === this.form.newPassword) {
              callback();
            } else {
              callback(new Error(this.$tc("validationInputsDontMatch")));
            }
          },
        },
      ],
    };
  }

  public async btnSaveClicked(): Promise<void> {
    if (!(await this.refForm.validate())) {
      return;
    }
    this.saveLoading = true;
    UserService.changePassword({
      oldPassword: this.form.oldPassword,
      newPassword: this.form.newPassword,
    })
      .then(() => {
        this.show = false;
        this.$store.dispatch("logout");
      })
      .finally(() => (this.saveLoading = false));
  }
}
</script>

<style scoped></style>
<i18n>
{
  "tr": {
    "title": "Parola Değiştir",
    "lblOldPassword": "Eski Parola",
    "lblNewPassword": "Yeni Parola",
    "lblConfirmNewPassword": "Yeni Parola (Onayla)",
    "validationCannotBeEmpty": "Bu alan boş bırakılamaz",
    "validationInputsDontMatch": "Parolalar uyuşmuyor",
    "btnCancel": "İptal",
    "btnSave": "Kaydet"
  }
}
</i18n>
