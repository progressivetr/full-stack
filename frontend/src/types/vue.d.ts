import { httpService } from "@/services/http.service";

declare module "vue/types/vue" {
  interface Vue {
    $http: httpService;
  }
}
