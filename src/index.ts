import { handler } from "./handler";

addEventListener("fetch", (event) => {
  return event.respondWith(handler(event.request));
});
