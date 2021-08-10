const {app} = require("./main");
const supertest = require('supertest')
const request = supertest(app);
const fs = require('fs')
const showdown  = require('showdown');
const mdConverter = new showdown.Converter();

function findTestFilePath()
{
    const contentDirs = fs.readdirSync("./client/content", { withFileTypes: true })
        .filter(dir => dir.isDirectory())
        .map(dir => dir.name);

    const validTestDirs = contentDirs
        .filter(dir => fs.existsSync(`./client/content/${dir}/index.md`))
        .map(dir => `./client/content/${dir}/index.md`);

    if(validTestDirs.length > 0)
        return validTestDirs[0];

    else
        return "";
}

function getPageHtml(path){
    if(path.length === 0) return "";
    let fileContents = fs.readFileSync(path, "utf8");
    let fileHtml = mdConverter.makeHtml(fileContents);
    return fileHtml;
}


describe("Test Requirements", () =>{

    const testFilePath = findTestFilePath();
    const testFileContent = getPageHtml(testFilePath);
    const testFileUrl = testFilePath.length > 25 ? testFilePath.slice(16, -9) : 0;

    expect(testFileUrl).toBeDefined();
    expect(testFileUrl.length).toBeDefined();
    expect(testFileUrl.length).toBeGreaterThan(0);

    test("Valid URL returns 200", async () => {
        await request
            .get(testFileUrl)
            .expect(200);
    })

    test("Valid index used", async ()=>{
        const response = await request
            .get(testFileUrl)
            .expect(200);

        expect(response.text).toContain(testFileContent);
    })

    test("Return 404 in case not found", async ()=>{
        await request
            .get("/anAddressThat'sNeverGoingToExist")
            .expect(404);
    })
})


