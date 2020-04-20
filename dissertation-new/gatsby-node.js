const { promises: fs } = require("fs");
const Prince = require("prince");

exports.createPages = async ({ graphql }) => {
  const paths = {
    html: "public/yocto-cfa.html",
    pdf: "yocto-cfa.pdf",
  };
  const result = await graphql(`
    {
      markdownRemark {
        html
      }
    }
  `);
  await fs.writeFile(
    paths.html,
    `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TODO</title>
</head>
<body>
${result.data.markdownRemark.html}
</body>
</html>
`
  );
  await Prince().inputs(paths.html).output(paths.pdf).execute();
};