// Tells IndexNow search engines (Bing, Yandex, Seznam…) which pages to recrawl.
// Run after a deploy that is live:
//   npm run indexnow                 every page in the route registry
//   npm run indexnow -- /uk /de/faq  only the paths you name
import { site } from "../src/config/site";
import { pathOf, ROUTES } from "../src/routes/registry";

const url = (p: string) => (p === "/" ? site.url : `${site.url}${p}`);
const keyLocation = `${site.url}/${site.indexNowKey}.txt`;

async function main() {
  const args = process.argv.slice(2);
  const urlList = args.length ? args.map(url) : ROUTES.map((e) => url(pathOf(e)));

  // The key file has to be live before submitting, or every engine rejects the batch.
  const keyRes = await fetch(keyLocation);
  const keyBody = keyRes.ok ? (await keyRes.text()).trim() : "";
  if (keyBody !== site.indexNowKey) {
    console.error(`Key file ${keyLocation} is not live yet (HTTP ${keyRes.status}). Deploy first.`);
    process.exit(1);
  }

  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: new URL(site.url).host, key: site.indexNowKey, keyLocation, urlList }),
  });

  // 200 = accepted, 202 = accepted and the key is still being checked.
  if (res.status === 200 || res.status === 202) {
    console.log(`IndexNow: submitted ${urlList.length} URLs (HTTP ${res.status})`);
  } else {
    console.error(`IndexNow: HTTP ${res.status} ${await res.text()}`);
    process.exit(1);
  }
}

main();
