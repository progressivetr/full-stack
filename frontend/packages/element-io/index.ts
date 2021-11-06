// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import locale from "element-ui/lib/locale";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import locale from "element-ui/lib/locale";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import en from "element-ui/lib/locale/lang/en";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import tr from "element-ui/lib/locale/lang/tr-TR";
import i18n from "../../src/i18n";
import Vue from "vue";
switch (i18n.locale) {
  case "tr":
    locale.use(tr);
    break;
  case "en":
    locale.use(en);
    break;
}

Vue.use(ElementUI);
