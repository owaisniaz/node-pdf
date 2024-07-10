const pdf = require("html-pdf");
const express = require("express");
const ejs = require("ejs");
const path = require("path");
const app = express();

const formatData = (data) => {
  // Format your data as needed
  return data;
};

// Serve static files from the 'public' directory
app.use("/public", express.static(path.join(__dirname, "public")));
app.get("/download-pdf", async (req, res) => {
  const protocol = req.protocol;
  const host = req.get("host");
  const baseUrl = `${protocol}://${host}`;

  console.log("host", host);
  console.log("baseUrl", baseUrl);

  try {
    const formattedData = formatData({
      name: "Shyam",
      course: "Test Course",
      date: "2022-2-2",
    });

    const html = await ejs.renderFile(
      path.join(__dirname, "views/template.ejs"),
      formattedData
    );

    const options = {
      format: "A4",
      base: baseUrl,
      orientation: "landscape",
      paginationOffset: 1,
      zoomFactor: "0.75",
      phantomPath: "./node_modules/phantomjs-prebuilt/bin/phantomjs", // Accessing the environment variable
    };

    pdf.create(html, options).toBuffer((err, buffer) => {
      if (err) {
        console.error("Error generating PDF:", err);
        res.status(500).send("Internal Server Error");
        return;
      }

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; filename=document.pdf");
      res.send(buffer);
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/test", async (req, res) => {
  console.log("req", req.hostname);
  console.log("req", req.url);
  console.log("req", req.method);
  try {
    const formattedData = formatData({
      name: "Shyam",
      course: "Test Course",
      date: "2022-2-2",
    });
    const html = await ejs.renderFile(
      path.join(__dirname, "views/template.ejs"),
      formattedData
    );
    res.send(html);
  } catch (error) {
    console.error("Error rendering template for testing:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
