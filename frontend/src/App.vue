<template>
  <div id="app">
    <el-container
      v-if="isAuthenticated"
      class="main-layout"
      style="min-height: calc(100vh - 70px)"
    >
      <ChangePasswordDialog :visible.sync="changePasswordViewVisible" />
      <el-header class="shadow" style="margin-bottom: 10px">
        <div
          class="
            d-flex
            position-relative
            justify-content-between
            align-items-center
          "
          style="top: 50%; transform: translateY(-50%)"
        >
          <img src="/images/logo.png" style="height: 50px" />
          <el-dropdown class="fa-pull-right" trigger="hover">
            <el-button>
              {{ $t("welcome") }} {{ user ? user.email : "" }}
              <i class="el-icon-arrow-down" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                icon="fas fa-key"
                @click.native="changePasswordViewVisible = true"
                >{{ $t("changePassword") }}
              </el-dropdown-item>
              <el-dropdown :show-timeout="0" placement="left-start">
                <el-dropdown-item icon="fas fa-language">
                  <span
                    >{{ $t("selectedLanguage") }}: {{ $t("language") }}</span
                  >
                </el-dropdown-item>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-for="(lang, index) in $i18n.availableLocales"
                    :key="index"
                    @click.native="btnChangeLanguageClicked(lang)"
                    >{{ $t("language", lang) }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-dropdown-item
                icon="fas fa-sign-out-alt"
                @click.native="btnLogoutClicked"
                >{{ $t("logout") }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>

      <el-container>
        <el-aside :width="asideWidth">
          <el-menu :collapse="collapse" router>
            <el-tooltip
              class="item"
              effect="dark"
              :content="collapse ? $t('expand') : $t('collapse')"
              placement="right"
            >
              <el-menu-item index="0" @click="collapse = !collapse">
                <i
                  :class="'el-icon-arrow-' + (collapse ? 'right' : 'left')"
                /><span>{{ $t("collapse") }}</span>
              </el-menu-item>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              :content="$t('menuItems.Home')"
              placement="right"
            >
              <el-menu-item index="/" @click="$router.push({ name: 'home' })">
                <i class="el-icon-data-board" />
                <span v-t="'menuItems.Home'" />
              </el-menu-item>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              :content="$t('menuItems.Group')"
              placement="right"
            >
              <el-menu-item index="/" @click="$router.push({ name: 'Group' })">
                <i class="el-icon-data-board" />
                <span v-t="'menuItems.Group'" />
              </el-menu-item>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              :content="$t('menuItems.ActiveTodo')"
              placement="right"
            >
              <el-menu-item
                index="/"
                @click="$router.push({ name: 'ActiveTodo' })"
              >
                <i class="el-icon-data-board" />
                <span v-t="'menuItems.ActiveTodo'" />
              </el-menu-item>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              :content="$t('menuItems.CompletedTodo')"
              placement="right"
            >
              <el-menu-item
                index="/"
                @click="$router.push({ name: 'CompletedTodo' })"
              >
                <i class="el-icon-data-board" />
                <span v-t="'menuItems.CompletedTodo'" />
              </el-menu-item>
            </el-tooltip>
          </el-menu>
        </el-aside>
        <el-main style="padding: 0 0 0 10px; overflow: visible; width: 80%">
          <el-card>
            <div slot="header" class="clearfix">
              <span>
                <el-page-header
                  :content="pageTitle"
                  :title="$t('navbarBackText')"
                  @back="$router.back()"
                >
                </el-page-header
              ></span>
            </div>
            <router-view />
          </el-card>
        </el-main>
      </el-container>
      <footer style="height: 50px">
        <el-card class="mt-3">
          <div class="d-flex align-items-center justify-content-between">
            <span />
            <div>
              <img src="/images/mini-logo.png" style="height: 50px" />
              2021 Test, {{ $t("allRightsReserved") }}
            </div>
            <div class="text-right">
              <small>Version: 1.0</small>
            </div>
          </div>
        </el-card>
      </footer>
    </el-container>
    <Login v-else @after-login="handleAfterLogin" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { Getter } from "vuex-class";
import Login from "@/../packages/auth/view/Login.vue";
import { AuthUserDto } from "@/../packages/auth/dto/auth-user.dto";
import ChangePasswordDialog from "@/../packages/users/view/ChangePasswordDialog.vue";

@Component({
  components: { ChangePasswordDialog, Login },
})
export default class App extends Vue {
  @Getter("isAuthenticated") readonly isAuthenticated!: boolean;
  @Getter("user") readonly user!: AuthUserDto | null;

  private collapse = true;
  private changePasswordViewVisible = false;

  get asideWidth(): string {
    return this.collapse ? "auto" : "300px";
  }

  get pageTitle(): string {
    return this.$tc(`menuItems.${this.$route.name}`) || "";
  }

  handleAfterLogin() {
    const currentRoute = this.$route;
    if (currentRoute.name !== "Home") {
      this.$router.push({
        name: "Home",
      });
    }
  }

  btnLogoutClicked(): void {
    this.$store.dispatch("logout");
  }

  btnChangeLanguageClicked(lang: string): void {
    this.$i18n.locale = lang;
  }
}
</script>

<i18n>
{
  "tr": {
    "welcome": "Hoşgeldiniz",
    "language": "Türkçe",
    "selectedLanguage": "Dil",
    "changePassword": "Parola Değiştir",
    "logout": "Çıkış Yap",
    "expand": "Genişlet",
    "collapse": "Daralt",
    "navbarBackText": "Geri",
    "btnSelectText": "Seç",
    "menuItems": {
      "Home": "Kontrol Paneli",
      "Group": "Gruplar",
      "ActiveTodo": "Aktif To-Do'lar",
      "CompletedTodo": "Tamamlanan To-Do'lar"
    },
    "allRightsReserved": "Tüm hakları saklıdır"
  }
}
</i18n>

<style>
.el-menu-item [class^="fas fa"] {
  margin-right: 5px;
  width: 24px;
  text-align: center;
  font-size: 18px;
  vertical-align: middle;
}

.el-menu-item [class^="fad fa"] {
  margin-right: 5px;
  width: 24px;
  text-align: center;
  font-size: 18px;
  vertical-align: middle;
}

.v-elseIcon .el-icon-loading {
  font-size: 200px;
}
</style>
