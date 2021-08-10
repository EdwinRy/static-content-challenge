const express = require("express")
const app = express()

const fs = require("fs")
const showdown  = require('showdown');
const mdConverter = new showdown.Converter();

/**
 * Fetch both the template file and the requested page, returning the view created from both
 * @param pagePath path to the index file related to the page
 * @returns {string} a rendered templated page
 */
function getTemplatedPage(pagePath)
{
    // Prepare file content placeholders
    let template = ""
    let indexMd = "";

    // Read template and page files
    try { template = fs.readFileSync("./client/template.html", "utf8"); }
    catch (err) { /* TODO: Error logic */}

    try { indexMd = fs.readFileSync(pagePath, "utf8"); }
    catch (err) { /* TODO: Error logic */}

    if(template === "" || indexMd === "") return "";

    // Convert markdown to HTML
    let indexHtml = mdConverter.makeHtml(indexMd);

    // Apply template
    let page = template.replace(/{{content}}/g, indexHtml)
    return page;
}

// Get blog post page
app.get("/blog/:month/:post", (req, res)=>{
    const page = getTemplatedPage(`./client/content/blog/${req.params.month}/${req.params.post}/index.md`);
    res.set('Content-Type', 'text/html');
    res.status(200).send(Buffer.from(page));
})

// Get any other page
app.get("/:page", (req, res) => {
    const page = getTemplatedPage(`./client/content/${req.params.page}/index.md`);
    if(page.length > 0)
    {
        res.set('Content-Type', 'text/html');
        res.status(200).send(Buffer.from(page));
    }
    else{
        res.status(404).send();
    }

})


app.listen(80, () => {})

module.exports = {app}
