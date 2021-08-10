/**
 * Author: Logan Graham <loganparkergraham@gmail.com>
 */
import { FontAwesomeOptions, SubsetOption } from "./types";
/**
 * This function will take an object of glyph names and output a subset of the standard fonts optimized in size for
 * use on websites / external resources.
 *
 * @param subset Array or Object containing glyph / font family names.
 * @param outputDir Directory output generated webfonts.
 * @param options Object of options / tweaks for further customization. Defaults to 'Free' package.
 */
declare function fontawesomeSubset(subset: SubsetOption, outputDir: string, options?: FontAwesomeOptions): void;
export = fontawesomeSubset;
