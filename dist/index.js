"use strict";
/**
 * Author: Logan Graham <loganparkergraham@gmail.com>
 */
var fs_1 = require("fs");
var path_1 = require("path");
var mkdirp_1 = require("mkdirp");
var svg2ttf = require("svg2ttf"), ttf2eot = require("ttf2eot"), ttf2woff = require("ttf2woff"), ttf2woff2 = require("ttf2woff2");
/**
 * Returns a list of all glyph names that don't exist in user-provided 'icons' parameter
 *
 * @param svgFile The contents of the SVG file we're looking at.
 * @param fontFamily The current font family we're parsing.
 * @param icons Array of glyph names we want to keep / output.
 *
 * @return string[] List of glyph names to remove from the output.
 */
function findGlyphsToRemove(svgFile, fontFamily, icons) {
    var glyphs = [], matcher = new RegExp('<glyph glyph-name="([^"]+)"', "gms");
    var current_match;
    while ((current_match = matcher.exec(svgFile))) {
        if (fontFamily === "duotone") {
            // If we're matching duotone we need to remove the trailing `-secondary` or `-primary`
            if (icons.indexOf(current_match[1].substring(0, current_match[1].lastIndexOf("-"))) === -1) {
                glyphs.push(current_match[1]);
            }
        }
        else {
            if (icons.indexOf(current_match[1]) === -1) {
                glyphs.push(current_match[1]);
            }
        }
    }
    return glyphs;
}
/**
 * This function will take an object of glyph names and output a subset of the standard fonts optimized in size for
 * use on websites / external resources.
 *
 * @param subset Array or Object containing glyph / font family names.
 * @param outputDir Directory output generated webfonts.
 * @param options Object of options / tweaks for further customization. Defaults to 'Free' package.
 */
function fontawesomeSubset(subset, outputDir, options) {
    if (options === void 0) { options = { package: "free" }; }
    // Maps style to actual font name / file name.
    var fontMap = {
        solid: "fa-solid-900",
        light: "fa-light-300",
        regular: "fa-regular-400",
        brands: "fa-brands-400",
        duotone: "fa-duotone-900"
    };
    var fontTypes = Object.keys(fontMap);
    // Check to see if the user has either free, or pro installed.
    if (!(fs_1.existsSync("node_modules/@fortawesome/fontawesome-free") || fs_1.existsSync("node_modules/@fortawesome/fontawesome-pro"))) {
        console.error("Unable to find either the Free or Pro FontAwesome files in node_modules folder. Double-check that you have your preferred fontawesome package as a dependency in `package.json` and rerun the installation.");
        return;
    }
    // If 'subset' is set to array, turn into object defaulted for 'solid' use (fontawesome free)
    if (Array.isArray(subset)) {
        subset = { solid: subset };
    }
    var entries = Object.entries(subset);
    for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
        var _a = entries_1[_i], key = _a[0], icons = _a[1];
        // Skip if current font family is not found in font_map.
        if (fontTypes.indexOf(key) === -1) {
            continue;
        }
        // Bail early if icons isn't set, or isn't an array
        if (!Array.isArray(icons)) {
            continue;
        }
        var fontFamily = key;
        var svgFileName = fontMap[fontFamily];
        var svgFilePath = "node_modules/@fortawesome/fontawesome-" + options.package + "/webfonts/" + svgFileName + ".svg";
        if (!fs_1.existsSync(svgFilePath)) {
            console.warn("Unable to find SVG font file for requested font style '" + fontFamily + "'. Skipping.");
            continue;
        }
        var svgFile = fs_1.readFileSync(svgFilePath).toString();
        var glyphsToRemove = findGlyphsToRemove(svgFile, fontFamily, icons);
        var svgContentsNew = svgFile.replace(new RegExp("(<glyph glyph-name=\"(" + glyphsToRemove.join("|") + ")\".*?\\/>)", "gms"), "").replace(/>\s+</gms, "><");
        var ttfUtils = svg2ttf(svgContentsNew, {
            fullname: "FontAwesome " + fontFamily,
            familyname: "FontAwesome",
            subfamilyname: fontFamily
        });
        var ttf = Buffer.from(ttfUtils.buffer);
        mkdirp_1.sync(path_1.resolve(outputDir));
        var outputFile = path_1.resolve(outputDir, svgFileName);
        fs_1.writeFileSync(outputFile + ".svg", svgContentsNew);
        fs_1.writeFileSync(outputFile + ".ttf", ttf);
        fs_1.writeFileSync(outputFile + ".eot", ttf2eot(ttf).buffer);
        fs_1.writeFileSync(outputFile + ".woff", ttf2woff(ttf).buffer);
        fs_1.writeFileSync(outputFile + ".woff2", ttf2woff2(ttf));
    }
}
module.exports = fontawesomeSubset;
