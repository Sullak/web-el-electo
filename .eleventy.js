module.exports = function(eleventyConfig) {
  // Solo procesar .md y .njk como plantillas;
  // los .html estáticos se copian tal cual (sin renombrar a /carpeta/index.html)
  eleventyConfig.setTemplateFormats(["md", "njk"]);

  eleventyConfig.addPassthroughCopy("*.html");
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
