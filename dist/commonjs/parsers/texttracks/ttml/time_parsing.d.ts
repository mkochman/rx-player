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
/**
 * Parse TTML Time formats to seconds.
 *
 * Largely inspired from what the shaka-player does for TTML time parsing.
 * But rewritten to a more rx-player style.
 */
import type { ITTParameters } from "./get_parameters";
/**
 * Parses a TTML time into seconds.
 * @param {string} text
 * @param {Object} ttParams
 * @returns {Number|undefined}
 */
declare function parseTime(text: string, ttParams: ITTParameters): number | undefined | null;
export default parseTime;
//# sourceMappingURL=time_parsing.d.ts.map