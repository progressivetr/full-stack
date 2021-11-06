import i18n from "../../src/i18n";

const ipRegex =
  /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
const subnetRegex =
  /^(((255\.){3}(255|254|252|248|240|224|192|128|0+))|((255\.){2}(255|254|252|248|240|224|192|128|0+)\.0)|((255\.)(255|254|252|248|240|224|192|128|0+)(\.0+){2})|((255|254|252|248|240|224|192|128|0+)(\.0+){3}))$/;

const required = {
  required: true,
  message: i18n.tc("form.validation.cantBeEmpty"),
  trigger: "blur",
};

const email = {
  required: true,
  type: "email",
  message: i18n.tc("form.validation.enterCorrectEmail"),
  trigger: "blur",
};

const password = {
  min: 5,
  message: i18n.tc("form.validation.passwordAtLeast5CharactersText"),
  trigger: "blur",
};

const stringLengthMax255 = {
  min: 0,
  max: 255,
  message: i18n.tc("form.validation.stringLengthShouldBe255Max"),
  trigger: "blur",
};

const port = {
  type: "number",
  min: 0,
  max: 65535,
  message: i18n.tc("form.validation.portMessage"),
  trigger: "blur",
};

const angle = {
  required: true,
  type: "number",
  min: 0,
  max: 360,
  message: i18n.tc("form.validation.portMessage"),
  trigger: "blur",
};

const ipAddress = {
  required: true,
  message: i18n.tc("form.validation.inputCorrectIP"),
  pattern: ipRegex,
  trigger: "blur",
};
const subnetMask = {
  required: true,
  message: i18n.tc("form.validation.inputCorrectSubnet"),
  pattern: subnetRegex,
  trigger: "blur",
};

export const validator = {
  required,
  email,
  password,
  stringLengthMax255,
  port,
  ipAddress,
  subnetMask,
  angle,
};
