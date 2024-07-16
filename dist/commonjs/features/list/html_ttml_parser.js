"use strict";
/**
 * Copyright 2015 CANAL+ Group
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTML_TTML_PARSER = void 0;
var html_1 = require("../../main_thread/text_displayer/html");
var html_2 = require("../../parsers/texttracks/ttml/html");
/**
 * Add ability to parse TTML text tracks in an HTML textrack mode.
 * @param {Object} features
 */
function addHTMLTTMLFeature(features) {
    features.htmlTextTracksParsers.ttml = html_2.default;
    features.htmlTextDisplayer = html_1.default;
}
exports.HTML_TTML_PARSER = addHTMLTTMLFeature;
exports.default = addHTMLTTMLFeature;
