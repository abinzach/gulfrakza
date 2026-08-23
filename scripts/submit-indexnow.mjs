const host = "www.gulfrakza.com"
const key = process.env.INDEXNOW_KEY || "92d87e57f41a4da1a731350b6d388e0f"
const sitemapUrl = `https://${host}/sitemap.xml`

const response = await fetch(sitemapUrl)
if (!response.ok) throw new Error(`Could not read ${sitemapUrl}: ${response.status}`)

const sitemap = await response.text()
const urlList = Array.from(sitemap.matchAll(/<loc>(.*?)<\/loc>/g), (match) => match[1])
if (urlList.length === 0) throw new Error("No URLs found in the sitemap")

const submission = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host,
    key,
    keyLocation: `https://${host}/${key}.txt`,
    urlList,
  }),
})

if (![200, 202].includes(submission.status)) {
  throw new Error(`IndexNow rejected the submission: ${submission.status} ${await submission.text()}`)
}

console.log(`Submitted ${urlList.length} canonical URLs to IndexNow (${submission.status}).`)
