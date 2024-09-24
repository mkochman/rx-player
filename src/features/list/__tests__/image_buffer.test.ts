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

import imageBuffer from "../../../core/segment_buffers/implementations/image";
import type { IFeaturesObject } from "../../types";
import addImageBufferFeature from "../image_buffer";

describe("Features list - HTML Text Buffer", () => {
  it("should add an Image Buffer in the current features", () => {
    const featureObject = {} as unknown as IFeaturesObject;
    addImageBufferFeature(featureObject);
    expect(featureObject).toEqual({ imageBuffer });
    expect(featureObject.imageBuffer).toBe(imageBuffer);
  });
});
