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

// Get any route
app.get("*", (req, res) => {

    // Send templated page based on url from the request
    const page = getTemplatedPage(`./client/content${req.url}/index.md`);

    // Send the rendered page if it succeeded
    if(page.length > 0)
    {
        res.set('Content-Type', 'text/html');
        res.status(200).send(Buffer.from(page));
    }
    // Send a 404 otherwise
    else
    {
        res.status(404).send();
    }

})

app.listen(80, () => {})

module.exports = {app}
