<template>
  <div>
    <slot name="operations" v-bind:data="$data" />
    <el-input
      v-if="searchable"
      v-model="search"
      class="float-end w-25"
      :placeholder="$t('search')"
      prefix-icon="el-icon-search"
      @input="refresh"
    />
    <el-table
      :data="data"
      v-on="$listeners"
      v-bind="$attrs"
      v-loading="loading"
      @sort-change="handleSortChanged"
    >
      <slot />
    </el-table>
    <el-pagination
      class="m-4 text-center"
      background
      :page-size="perPage"
      :page-count="pageCount"
      :pager-count="5"
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="[10, 20, 50, 100]"
      :current-page="currentPage"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, PropSync, Watch } from "vue-property-decorator";
import { AxiosResponse } from "axios";
import { httpService } from "../../../src/services/http.service";

@Component
export default class PaginationTable extends Vue {
  @Prop({ required: false, type: String, default: null })
  readonly url!: string | null;

  @Prop({ required: false, type: Function, default: null })
  readonly refreshFunction!: (
    page: number,
    limit: number,
    sortingProp: string | null,
    sortingOrder: "ASC" | "DESC" | null
  ) => any | null;

  @Prop({ default: false, type: Boolean })
  readonly searchable!: boolean;

  @PropSync("params", { required: false, type: Object, default: () => ({}) })
  paramValues!: Record<string, any>;

  @Prop({ required: false, type: Boolean, default: true })
  readonly autoLoad!: boolean;

  @Prop({ required: false, type: Boolean, default: false })
  readonly autoRefresh!: boolean;

  @Prop({ required: false, type: Number, default: 0 })
  readonly refreshInterval!: number;

  @Prop({ required: false, type: String, default: "data" })
  readonly dataKey!: string;

  @Prop({ required: false, type: String, default: "total" })
  readonly totalKey!: string;

  @Prop({ required: false, type: Boolean, default: true })
  readonly showLoading!: boolean;

  private stopAutoRefreshing = false;
  private search = "";
  private data: any = [];
  private perPage = 10;
  private total = 0;
  private currentPage = 1;
  private pageCount = 0;
  private loading = false;
  private sortBy: string | null = null;
  private sortOrder: "ASC" | "DESC" | null = null;
  private clearIntervalId = 0;

  @Watch("paramValues", { deep: true })
  paramsChanged() {
    if (this.autoRefresh && !this.stopAutoRefreshing) {
      this.refresh();
    }
  }

  mounted(): void {
    const sortAttribute = this.$attrs["default-sort"];
    if (sortAttribute) {
      this.handleSortChanged(sortAttribute);
    } else if (this.autoLoad) {
      this.refresh();
    }
    if (this.refreshInterval !== 0) {
      this.clearIntervalId = setInterval(() => {
        this.refresh();
      }, this.refreshInterval);
    }
  }

  destroyed() {
    if (this.clearIntervalId !== 0) {
      clearInterval(this.clearIntervalId);
    }
  }

  handleSizeChange(val: number): void {
    this.perPage = val;
    this.refresh();
  }

  handleCurrentChange(val: number): void {
    this.currentPage = val;
    this.refresh();
  }

  handleSortChanged({ prop, order }: any): void {
    if (order) {
      this.sortBy = prop;
      this.sortOrder = order === "ascending" ? "ASC" : "DESC";
    } else {
      this.sortBy = null;
      this.sortOrder = null;
    }
    this.refresh();
  }

  clearData() {
    this.data = [];
  }

  refresh(): Promise<void> | undefined {
    const afterRefreshData = (response: AxiosResponse) => {
      const data = response.data;
      this.data = data[this.dataKey];
      if (this.data.length === 0 && this.currentPage !== 1) {
        this.currentPage = 1;
        this.refresh();
        return;
      }
      this.total = Number(data[this.totalKey]);
      this.pageCount = Math.ceil(this.total / this.perPage);
    };
    if (this.refreshFunction) {
      this.refreshFunction(
        this.currentPage,
        this.perPage,
        this.sortBy,
        this.sortOrder
      ).then((response: AxiosResponse) => afterRefreshData(response));
      return;
    }
    if (!this.url) {
      this.data = [];
      return;
    }
    const params: { [x: string]: any } = {
      page: this.currentPage,
      limit: this.perPage,
    };
    if (this.sortBy && this.sortOrder) {
      params.sortBy = this.sortBy;
      params.sortOrder = this.sortOrder;
    }
    if (this.paramValues) {
      Object.assign(params, this.paramValues);
    }
    if (this.searchable && this.search.length > 0) {
      params["q"] = this.search;
    }
    this.loading = this.showLoading;
    return httpService
      .get(this.url, {
        params,
      })
      .then((response: AxiosResponse) => afterRefreshData(response))
      .finally(() => (this.loading = false));
  }
}
</script>
<i18n>
{
  "tr": {
    "search": "Ara"
  }
}
</i18n>
