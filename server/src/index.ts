import { env } from "./config/env";
import { app } from "./app";

app.listen(env.PORT, () => {
  console.log(`API berjalan di http://localhost:${env.PORT}/api/v1`);
});
