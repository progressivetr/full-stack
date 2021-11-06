<template>
  <Todo
    :get-groups="getAllGroups"
    :table-params="tableParams"
    :editable="false"
  ></Todo>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import Vue from "vue";
import Todo from "../../packages/todo/view/Todo.vue";
import { GroupService } from "../../packages/group/group.service";
@Component({
  components: { Todo },
})
export default class CompletedTodo extends Vue {
  private tableParams: Record<string, any> = {
    isDone: true,
  };

  getAllGroups() {
    return new Promise((resolve, reject) => {
      GroupService.findAll()
        .then((response) => resolve(response.data))
        .catch((err) => reject(err));
    });
  }
}
</script>

<style scoped></style>
