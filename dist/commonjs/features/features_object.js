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
/**
 * Initial features object, with no feature activated by default.
 * @type {Object}
 */
var features = {
    dashParsers: { wasm: null, native: null, fastJs: null },
    codecSupportProber: null,
    createDebugElement: null,
    directfile: null,
    decrypt: null,
    htmlTextDisplayer: null,
    htmlTextTracksParsers: {},
    mainThreadMediaSourceInit: null,
    multithread: null,
    nativeTextDisplayer: null,
    nativeTextTracksParsers: {},
    transports: {},
};
exports.default = features;
