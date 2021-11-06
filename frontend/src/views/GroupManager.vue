<template>
  <Group />
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import Vue from "vue";
import Group from "../../packages/group/view/Group.vue";
@Component({
  components: { Group },
})
export default class GroupManager extends Vue {}
</script>

<style scoped></style>
