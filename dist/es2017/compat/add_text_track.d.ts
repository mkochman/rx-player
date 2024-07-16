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
import type { ICompatTextTrack } from "./browser_compatibility_types";
/**
 * Add text track to the given media element.
 *
 * Returns an object with the following properties:
 *   - track {TextTrack}: the added text track
 *   - trackElement {HTMLElement|undefined}: the added <track> element.
 *     undefined if no trackElement was added.
 *
 * @param {HTMLMediaElement} mediaElement
 * @returns {Object}
 */
export default function addTextTrack(mediaElement: HTMLMediaElement): {
    track: ICompatTextTrack;
    trackElement: HTMLTrackElement | undefined;
};
//# sourceMappingURL=add_text_track.d.ts.map