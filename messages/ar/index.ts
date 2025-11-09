import common from "./common.json";
import home from "./home.json";
import about from "./about.json";
import forms from "./forms.json";
import legal from "./legal.json";
import notFound from "./notFound.json";

const messages = {
  common,
  home,
  about,
  forms,
  legal,
  notFound,
} as const;

export default messages;
