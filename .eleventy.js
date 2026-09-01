module.exports = function(eleventyConfig) {
  // Solo procesar .md y .njk como plantillas;
  // los .html estáticos se copian tal cual (sin renombrar a /carpeta/index.html)
  eleventyConfig.setTemplateFormats(["md", "njk"]);

  eleventyConfig.addCollection("articulos", function(collection) {
    return collection
      .getFilteredByGlob("articulos/**/*.md")
      .filter(item => item.data.published !== false);
  });

  eleventyConfig.addCollection("multimedia", function(collection) {
    return collection
      .getFilteredByGlob("multimedia/**/*.md")
      .filter(item => item.data.published !== false);
  });

  eleventyConfig.addFilter("limit", (arr, n) => arr.slice(0, n));
  eleventyConfig.addFilter("date", (date, format) => {
    if (!date) return "";
    const d = new Date(date);
    const pad = n => String(n).padStart(2, "0");
    return format
      .replace("YYYY", d.getFullYear())
      .replace("MM", pad(d.getMonth() + 1))
      .replace("DD", pad(d.getDate()));
  });
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("*.jpeg");
  eleventyConfig.addPassthroughCopy("*.png");
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy("sitemap.xml");

  return {
    dir: {
      input: ".",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    markdownTemplateEngine: "njk",
  };
};
