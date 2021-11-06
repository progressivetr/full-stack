<template>
  <div>
    <el-dialog
      width="400px"
      :visible.sync="editorVisible"
      :title="$t('todoEditor')"
      :close-on-click-modal="false"
    >
      <el-form
        ref="editorForm"
        :model="form"
        :rules="formRules"
        label-width="120px"
      >
        <el-form-item :label="$t('text')" prop="text">
          <el-input type="textarea" v-model="form.text" />
        </el-form-item>
        <el-form-item :label="$t('priority')" prop="priority">
          <el-select v-model="form.priority" class="w-100">
            <el-option
              v-for="(priority, index) of priorities"
              :key="index"
              :value="priority"
              :label="$t('priorities.' + priority)"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('group')" prop="groupId">
          <el-select v-model="form.groupId" class="w-100">
            <el-option
              v-for="group of groups"
              :key="group.id"
              :value="group.id"
              :label="group.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('dueDate')" prop="dueDate">
          <el-date-picker
            v-model="form.dueDate"
            class="w-100"
            type="datetime"
          />
        </el-form-item>
        <el-form-item v-if="form.id" :label="$t('isDone')" prop="text">
          <el-switch v-model="form.isDone" />
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
    <el-button
      v-if="creatable"
      type="primary"
      icon="fas fa-phone-plus"
      @click="btnNewClicked"
    >
      {{ $t("newTodo") }}
    </el-button>
    <slot />
    <PaginationTable ref="table" url="todo" :params="tableParams" auto-refresh>
      <el-table-column :label="$t('id')" prop="id" width="100" />
      <el-table-column
        :label="$t('priority')"
        prop="priority"
        :formatter="(row, column, cellValue) => $t('priorities.' + cellValue)"
      />
      <el-table-column :label="$t('text')" prop="text" />
      <el-table-column :label="$t('group')" prop="group.name" />
      <el-table-column :label="$t('dueDate')" prop="dueDate">
        <template v-slot="{ row }">
          {{ new Date(row.dueDate).toLocaleDateString() }}
          {{ new Date(row.dueDate).toLocaleTimeString() }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('createdAt')" prop="createdAt" width="200px">
        <template v-slot="{ row }">
          {{ new Date(row.createdAt).toLocaleDateString() }}
          {{ new Date(row.createdAt).toLocaleTimeString() }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('operations')" width="210">
        <template v-slot="{ row }">
          <el-button
            v-if="row.isDone"
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="btnSetAsActive(row.id)"
          >
            {{ $t("setActive") }}
          </el-button>
          <el-button
            v-if="editable"
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
import { Component, Prop, Ref } from "vue-property-decorator";
import Vue from "vue";
import PaginationTable from "../../element-io/components/PaginationTable.vue";
import { validator } from "../../element-io/form-validation.utils";
import { ElForm } from "element-ui/types/form";
import { PTable } from "../../element-io/types/PTable";
import { CreateTodoDto } from "../dto/create-todo.dto";
import { UpdateTodoDto } from "../dto/update-todo.dto";
import { TodoService } from "../todo.service";
import { Priority } from "../enum/priority.enum";
@Component({
  components: { PaginationTable },
})
export default class Todo extends Vue {
  @Ref("table") readonly refTable!: PTable;
  @Ref("editorForm") readonly refEditorForm!: ElForm;

  @Prop({ required: false, type: Object, default: {} })
  readonly tableParams!: Record<string, any>;

  @Prop({ required: false, type: Boolean, default: false })
  readonly creatable!: boolean;

  @Prop({ required: true, type: Function || Promise })
  readonly getGroups!: (() => []) | (() => Promise<[]>);

  @Prop({ required: false, type: Boolean, default: true })
  readonly editable!: boolean;

  private editorVisible = false;
  private form: CreateTodoDto | UpdateTodoDto = new CreateTodoDto(
    "",
    null,
    null,
    null
  );
  private loading = false;

  private priorities = Object.values(Priority);
  private groups = [];

  get formRules() {
    return {
      dueDate: [validator.required],
      groupId: [validator.required],
      isDone: [{ required: this.form instanceof UpdateTodoDto }],
      priority: [validator.required],
      text: [validator.required],
      name: [validator.required],
    };
  }

  mounted() {
    this.loadGroups();
  }

  loadGroups() {
    const groups = this.getGroups();
    if (Array.isArray(groups)) {
      this.groups = groups;
    } else {
      groups.then((groups) => (this.groups = groups));
    }
  }

  btnNewClicked() {
    this.form = new CreateTodoDto("", null, null, null);
    this.loadGroups();
    this.editorVisible = true;
  }

  async btnSaveClicked() {
    this.loading = true;
    let valid = await this.refEditorForm.validate();
    if (!valid) {
      return;
    }
    if (this.form instanceof UpdateTodoDto) {
      TodoService.update(this.form)
        .then(() => {
          this.editorVisible = false;
          this.refTable.refresh();
        })
        .finally(() => (this.loading = false));
    } else {
      TodoService.create(this.form)
        .then(() => {
          this.editorVisible = false;
          this.refTable.refresh();
        })
        .finally(() => (this.loading = false));
    }
  }
  btnEditClicked(item: any) {
    this.form = new UpdateTodoDto(
      item.id,
      item.text,
      item.priority,
      item.groupId,
      new Date(item.dueDate),
      item.isDone
    );
    this.loadGroups();
    this.editorVisible = true;
  }
  btnDeleteClicked(id: number) {
    TodoService.remove(id).then(() => this.refTable.refresh());
  }
  btnSetAsActive(id: number) {
    TodoService.setAsActive(id).then(() => this.refTable.refresh());
  }
}
</script>
<i18n>
{
  "tr": {
    "newTodo": "Yeni To-Do",
    "todoEditor": "To-Do Editörü",
    "text": "Metin",
    "priority": "Öncelik",
    "dueDate": "Bitiş Tarihi",
    "group": "Grup",
    "cancel": "İptal",
    "save": "Kaydet",
    "edit": "Düzenle",
    "delete": "Kaldır",
    "yes": "Evet",
    "no": "Hayır",
    "removeConfirmMsg": "Bu to-do'yu silmek istediğinize emin misiniz?",
    "id": "ID",
    "createdAt": "Oluşturulma Tarihi",
    "operations": "İşlemler",
    "isDone": "Bitti Mi",
    "prios": "Öncelik(ler)",
    "setActive": "Aktif Et",
    "priorities": {
      "LOW": "Düşük",
      "MEDIUM": "Orta",
      "HIGH": "Yüksek"
    }
  }
}
</i18n>
