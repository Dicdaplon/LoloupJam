const IS_LOCAL = window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost";
const BASE_PATH = IS_LOCAL ? '' : '/LoloupJam';

const PATHS = {
  fonts: `${BASE_PATH}/assets/fonts/`,
  data: `${BASE_PATH}/data/`,
  paroles: `${BASE_PATH}/paroles/`
};