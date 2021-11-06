<template>
  <Todo
    :get-groups="getAllGroups"
    :table-params="tableParams"
    :creatable="true"
  >
    <div class="d-flex m-2">
      <el-form inline>
        <el-form-item :label="$t('group')">
          <el-select v-model="tableParams.group">
            <el-option
              v-for="group of groups"
              :key="group.id"
              :value="group.id"
              :label="group.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('prios')">
          <el-select v-model="tableParams.priorities" multiple>
            <el-option
              v-for="(priority, index) of priorities"
              :key="index"
              :value="priority"
              :label="$t('priorities.' + priority)"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('dueDate')">
          <el-date-picker
            v-model="startEndDate"
            type="datetimerange"
            @change="
              (val) => {
                if (val) {
                  tableParams.startDate = val[0].getTime();
                  tableParams.endDate = val[1].getTime();
                } else {
                  tableParams.startDate = null;
                  tableParams.endDate = null;
                }
              }
            "
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
    </div>
  </Todo>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import Vue from "vue";
import Todo from "../../packages/todo/view/Todo.vue";
import { Priority } from "../../packages/todo/enum/priority.enum";
import { GroupService } from "../../packages/group/group.service";
@Component({
  components: { Todo },
})
export default class ActiveTodo extends Vue {
  private priorities = Object.values(Priority);
  private startEndDate = [];
  private groups: any[] = [];

  private tableParams: Record<string, any> = {
    isDone: false,
    group: null,
    priorities: [],
    startDate: null,
    endDate: null,
  };

  mounted() {
    this.getAllGroups().then((groups: any) => (this.groups = groups));
  }

  getAllGroups() {
    return new Promise((resolve, reject) => {
      GroupService.findAll()
        .then((response) => resolve(response.data))
        .catch((err) => reject(err));
    });
  }
}
</script>

<i18n>
{
  "tr": {
    "dueDate": "Bitiş Tarihi",
    "group": "Grup",
    "prios": "Öncelik(ler)",
    "setActive": "Aktif Et"
  }
}
</i18n>
