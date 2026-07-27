// cPanel / Phusion Passenger başlangıç dosyası.
// cPanel "Setup Node.js App" ekranında "Application startup file" alanına
// bu dosya (server.js) yazılmalıdır. Passenger, listen() çağrısını kendi
// soketine yönlendirdiği için PORT değeri ortam tarafından yönetilir.
import { createServer } from "node:http";
import next from "next";

const port = Number(process.env.PORT) || 3000;
const app = next({ dev: false });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    createServer((req, res) => {
      handle(req, res);
    }).listen(port, () => {
      console.log(`> Dinamik Okulları sitesi ${port} portunda hazır`);
    });
  })
  .catch((error) => {
    console.error("Sunucu başlatılamadı:", error);
    process.exit(1);
  });
