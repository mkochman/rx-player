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
 * Map each element using a mapping function, then flat the result into
 * a new array.
 * @param {Array.<*>} originalArray
 * @param {Function} fn
 */
export default function flatMap(originalArray, fn) {
    /* eslint-disable @typescript-eslint/unbound-method */
    if (typeof Array.prototype.flatMap === "function") {
        return originalArray.flatMap(fn);
    }
    /* eslint-enable @typescript-eslint/unbound-method */
    return originalArray.reduce((acc, arg) => {
        const r = fn(arg);
        if (Array.isArray(r)) {
            acc.push(...r);
            return acc;
        }
        acc.push(r);
        return acc;
    }, []);
}
