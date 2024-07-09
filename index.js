const express = require("express");
const path = require("path");
const ejs = require("ejs");
const pdf = require("html-pdf");
const app = express();
const PORT = 5000;

// Serve static files from the 'public' directory
app.use("/public", express.static(path.join(__dirname, "public")));

// Function to format data
const formatData = (data) => {
  return {
    ...data,
    date: new Date(data.date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  };
};

// Route to render EJS template in browser for testing
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

// Route to render the PDF
app.get("/download-pdf", async (req, res) => {
  const protocol = req.protocol;
  const host = req.get("host");

  console.log("host", host);
  const originalUrl = req.originalUrl;
  const baseUrl = `${protocol}://${host}`;
  console.log("baseUrl", baseUrl);
  try {
    const formattedData = formatData({
      name: "Shyam",
      course: "Test Course",
      date: "2022-2-2",
    });
    // Render the EJS template to HTML with dynamic data
    const html = await ejs.renderFile(
      path.join(__dirname, "views/template.ejs"),
      formattedData
    );
    // console.log("req", req);
    const options = {
      format: "A4",
      // border: {
      //   top: "10mm",
      //   right: "10mm",
      //   bottom: "10mm",
      //   left: "10mm",
      // },

      base: baseUrl,
      orientation: "landscape", // Set page orientation
      paginationOffset: 1, // Start page numbering at 1
      zoomFactor: "0.75", // Adjust zoom factor if content is too large
    };

    // Generate the PDF
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

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
