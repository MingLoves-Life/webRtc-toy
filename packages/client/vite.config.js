import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import basicSsl from "@vitejs/plugin-basic-ssl";
import { proxy } from "./proxy";

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [vue(), basicSsl()],
//   server: {
//     https: true,
//     proxy
//   },
// });
export default defineConfig({
  plugins: [vue()],
  server: {
    // https: true,
    proxy
  },
});
