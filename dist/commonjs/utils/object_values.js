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
exports.objectValues = void 0;
/**
 * @param {Object|Array} o
 * @returns {Array.<*>}
 */
function objectValues(o) {
    return Object.keys(o).map(function (k) { return o[k]; });
}
exports.objectValues = objectValues;
/* eslint-disable  @typescript-eslint/unbound-method, no-restricted-properties */
exports.default = typeof Object.values === "function" ? Object.values : objectValues;
