<template>
  <div>
    <el-dialog
      width="400px"
      :visible.sync="editorVisible"
      :title="$t('groupEditor')"
      :close-on-click-modal="false"
    >
      <el-form
        ref="editorForm"
        :model="form"
        :rules="formRules"
        label-width="60px"
        @submit.prevent
      >
        <el-form-item :label="$t('name')" prop="name">
          <el-input v-model="form.name" @keyup.enter.native="btnSaveClicked" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="danger"
          @click="editorVisible = false"
          icon="el-icon-close"
          >{{ $t("cancel") }}</el-button
        >
        <el-button
          :loading="loading"
          type="success"
          @click="btnSaveClicked"
          icon="el-icon-check"
          >{{ $t("save") }}</el-button
        >
      </span>
    </el-dialog>
    <el-button type="primary" icon="fas fa-phone-plus" @click="btnNewClicked">
      {{ $t("newGroup") }}
    </el-button>
    <PaginationTable ref="table" url="group">
      <el-table-column :label="$t('id')" prop="id" width="100" />
      <el-table-column :label="$t('name')" prop="name" />
      <el-table-column :label="$t('createdAt')" prop="createdAt" width="200px">
        <template v-slot="{ row }">
          {{ new Date(row.createdAt).toLocaleDateString() }}
          {{ new Date(row.createdAt).toLocaleTimeString() }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('operations')" width="210">
        <template v-slot="{ row }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="btnEditClicked(row)"
          >
            {{ $t("edit") }}
          </el-button>
          <el-popconfirm
            :confirm-button-text="$t('yes')"
            :cancel-button-text="$t('no')"
            :title="$t('removeConfirmMsg')"
            @confirm="btnDeleteClicked(row.id)"
          >
            <el-button
              slot="reference"
              size="mini"
              class="float-end ml-2"
              icon="el-icon-delete"
              type="danger"
            >
              {{ $t("delete") }}
            </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </PaginationTable>
  </div>
</template>

<script lang="ts">
import { Component, Ref } from "vue-property-decorator";
import Vue from "vue";
import PaginationTable from "../../element-io/components/PaginationTable.vue";
import { CreateGroupDto } from "../dto/create-group.dto";
import { GroupService } from "../group.service";
import { validator } from "../../element-io/form-validation.utils";
import { ElForm } from "element-ui/types/form";
import { PTable } from "../../element-io/types/PTable";
import { UpdateGroupDto } from "../dto/update-group.dto";
@Component({
  components: { PaginationTable },
})
export default class Group extends Vue {
  @Ref("table") readonly refTable!: PTable;
  @Ref("editorForm") readonly refEditorForm!: ElForm;

  private editorVisible = false;
  private form: CreateGroupDto | UpdateGroupDto = new CreateGroupDto("");
  private loading = false;

  get formRules() {
    return {
      name: [validator.required],
    };
  }

  btnNewClicked() {
    this.form = new CreateGroupDto("");
    this.editorVisible = true;
  }

  async btnSaveClicked() {
    this.loading = true;
    let valid = await this.refEditorForm.validate();
    if (!valid) {
      return;
    }
    if (this.form instanceof UpdateGroupDto) {
      GroupService.update(this.form)
        .then(() => {
          this.editorVisible = false;
          this.refTable.refresh();
        })
        .finally(() => (this.loading = false));
    } else {
      GroupService.create(this.form)
        .then(() => {
          this.editorVisible = false;
          this.refTable.refresh();
        })
        .finally(() => (this.loading = false));
    }
  }
  btnEditClicked(item: any) {
    this.form = new UpdateGroupDto(item.id, item.name);
    this.editorVisible = true;
  }
  btnDeleteClicked(id: number) {
    GroupService.remove(id).then(() => this.refTable.refresh());
  }
}
</script>
<i18n>
{
  "tr": {
    "newGroup": "Yeni Grup",
    "groupEditor": "Group Editörü",
    "name": "Adı",
    "cancel": "İptal",
    "save": "Kaydet",
    "edit": "Düzenle",
    "delete": "Kaldır",
    "yes": "Evet",
    "no": "Hayır",
    "removeConfirmMsg": "Bu grubu silmek istediğinize emin misiniz?",
    "id": "ID",
    "createdAt": "Oluşturulma Tarihi",
    "operations": "İşlemler"
  }
}
</i18n>
