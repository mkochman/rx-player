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
import type { IRepresentationIndex, ISegment, IRepresentation } from "../../../../../../manifest";
import type { IPlayerError } from "../../../../../../public_types";
import type { ITNode } from "../../../../../../utils/xml-parser";
import type { IEMSG } from "../../../../../containers/isobmff";
import type { IIndexSegment } from "../../../../utils/index_helpers";
import type { ISegmentTimelineElement } from "../../../node_parser_types";
import type ManifestBoundsCalculator from "../../manifest_bounds_calculator";
/**
 * Index property defined for a SegmentTimeline RepresentationIndex
 * This object contains every property needed to generate an ISegment for a
 * given media time.
 */
export interface ITimelineIndex {
    /** If `false`, the last segment anounced might be still incomplete. */
    availabilityTimeComplete: boolean;
    /** Minimum availabilityTimeOffset concerning the segments of this Representation. */
    availabilityTimeOffset: number;
    /** Byte range for a possible index of segments in the server. */
    indexRange?: [number, number] | undefined;
    /**
     * Temporal offset, in the current timescale (see timescale), to add to the
     * presentation time (time a segment has at decoding time) to obtain the
     * corresponding media time (original time of the media segment in the index
     * and on the media file).
     * For example, to look for a segment beginning at a second `T` on a
     * HTMLMediaElement, we actually will look for a segment in the index
     * beginning at:
     * ```
     * T * timescale + indexTimeOffset
     * ```
     */
    indexTimeOffset: number;
    /** Information on the initialization segment. */
    initialization?: {
        /**
         * URL path, to add to the wanted CDN, to access the initialization segment.
         * `null` if no URL exists.
         */
        url: string | null;
        /** possible byte range to request it. */
        range?: [number, number] | undefined;
    } | undefined;
    /**
     * Template for the URL suffix (to concatenate to the wanted CDN), to access any
     * media segment.
     * Can contain tokens to replace to convert it to real URLs.
     *
     * `null` if no URL exists.
     */
    segmentUrlTemplate: string | null;
    /** Number from which the first segments in this index starts with. */
    startNumber?: number | undefined;
    /** Number associated to the last segment in this index. */
    endNumber?: number | undefined;
    /**
     * Every segments defined in this index.
     * `null` at the beginning as this property is parsed lazily (only when first
     * needed) for performances reasons.
     *
     * /!\ Please note that this structure should follow the exact same structure
     * than a SegmentTimeline element in the corresponding MPD.
     * This means:
     *   - It should have the same amount of elements in its array than there was
     *     `<S>` elements in the SegmentTimeline.
     *   - Each of those same elements should have the same start time, the same
     *     duration and the same repeat counter than what could be deduced from
     *     the SegmentTimeline.
     * This is needed to be able to run parsing optimization when refreshing the
     * MPD. Not doing so could lead to the RxPlayer not being able to play the
     * stream anymore.
     */
    timeline: IIndexSegment[] | null;
    /**
     * Timescale to convert a time given here into seconds.
     * This is done by this simple operation:
     * ``timeInSeconds = timeInIndex * timescale``
     */
    timescale: number;
}
/**
 * `index` Argument for a SegmentTimeline RepresentationIndex.
 * Most of the properties here are already defined in ITimelineIndex.
 */
export interface ITimelineIndexIndexArgument {
    indexRange?: [number, number] | undefined;
    initialization?: {
        media?: string | undefined;
        range?: [number, number] | undefined;
    } | undefined;
    media?: string | undefined;
    startNumber?: number | undefined;
    endNumber?: number | undefined;
    timescale?: number | undefined;
    /**
     * Offset present in the index to convert from the mediaTime (time declared in
     * the media segments and in this index) to the presentationTime (time wanted
     * when decoding the segment).  Basically by doing something along the line
     * of:
     * ```
     * presentationTimeInSeconds =
     *   mediaTimeInSeconds -
     *   presentationTimeOffsetInSeconds +
     *   periodStartInSeconds
     * ```
     * The time given here is in the current
     * timescale (see timescale)
     */
    presentationTimeOffset?: number | undefined;
    timelineParser?: (() => ITNode[] | HTMLCollection) | undefined;
    timeline?: ISegmentTimelineElement[] | undefined;
}
/** Aditional context needed by a SegmentTimeline RepresentationIndex. */
export interface ITimelineIndexContextArgument {
    /**
     * If `false`, declared segments in the MPD might still be not completely generated.
     * If `true`, they are completely generated.
     *
     * If `undefined`, the corresponding property was not set in the MPD and it is
     * thus assumed that they are all generated.
     * It might however be semantically different than `true` in the RxPlayer as it
     * means that the packager didn't include that information in the MPD.
     */
    availabilityTimeComplete: boolean | undefined;
    /**
     * availability time offset of the concerned Adaptation.
     *
     * If `undefined`, the corresponding property was not set in the MPD and it is
     * thus assumed to be equal to `0`.
     * It might however be semantically different than `0` in the RxPlayer as it
     * means that the packager didn't include that information in the MPD.
     */
    availabilityTimeOffset: number | undefined;
    /** Allows to obtain the minimum and maximum positions of a content. */
    manifestBoundsCalculator: ManifestBoundsCalculator;
    /** Start of the period linked to this RepresentationIndex, in seconds. */
    periodStart: number;
    /** End of the period linked to this RepresentationIndex, in seconds. */
    periodEnd: number | undefined;
    /** Whether the corresponding Manifest can be updated and changed. */
    isDynamic: boolean;
    /**
     * Time at which the XML file containing this index was received.
     */
    receivedTime?: number | undefined;
    /** ID of the Representation concerned. */
    representationId?: string | undefined;
    /** Bitrate of the Representation concerned. */
    representationBitrate?: number | undefined;
    /**
     * The parser should take this previous version of the
     * `TimelineRepresentationIndex` - which was from the same Representation
     * parsed at an earlier time - as a base to speed-up the parsing process.
     * /!\ If unexpected differences exist between both, there is a risk of
     * de-synchronization with what is actually on the server,
     * Use with moderation.
     */
    unsafelyBaseOnPreviousRepresentation: IRepresentation | null;
    /** Function that tells if an EMSG is whitelisted by the manifest */
    isEMSGWhitelisted: (inbandEvent: IEMSG) => boolean;
    /**
     * Set to `true` if the linked Period is the chronologically last one in the
     * Manifest.
     */
    isLastPeriod: boolean;
}
export interface ILastSegmentInformation {
    /** End of the timeline on `time`, timescaled. */
    lastPosition?: number | undefined;
    /** Defines the time at which `lastPosition` was last calculated. */
    time: number;
}
/**
 * `IRepresentationIndex` implementation for a DASH `SegmentTimeline` segment
 * indexing scheme.
 * @class TimelineRepresentationIndex
 */
export default class TimelineRepresentationIndex implements IRepresentationIndex {
    /** Underlying structure to retrieve segment information. */
    protected _index: ITimelineIndex;
    /**
     * Time of the last Manifest update.
     * The unit is the monotonically-raising timestamp used by the RxPlayer.
     */
    private _lastUpdate;
    /** Absolute start of the period, timescaled and converted to index time. */
    private _scaledPeriodStart;
    /** Absolute end of the period, timescaled and converted to index time. */
    private _scaledPeriodEnd;
    /** Whether this RepresentationIndex can change over time. */
    private _isDynamic;
    /** Retrieve the maximum and minimum position of the whole content. */
    private _manifestBoundsCalculator;
    /**
     * Lazily get the S elements from this timeline.
     * `null` once this call has been done once, to free memory.
     */
    private _parseTimeline;
    /**
     * This variable represents the same `TimelineRepresentationIndex` at the
     * previous Manifest update.
     * Note that it is not always set.
     * This can be used as a base to speed-up the creation of the underlying
     * index structure as it can be really heavy for long Manifests.
     * To avoid taking too much memory, this variable is reset to `null` once used.
     */
    private _unsafelyBaseOnPreviousIndex;
    private _isEMSGWhitelisted;
    /** `true` if the linked Period is the chronologically last one in the Manifest. */
    private _isLastPeriod;
    /**
     * @param {Object} index
     * @param {Object} context
     */
    constructor(index: ITimelineIndexIndexArgument, context: ITimelineIndexContextArgument);
    /**
     * Construct init Segment.
     * @returns {Object}
     */
    getInitSegment(): ISegment;
    /**
     * Asks for segments to download for a given time range.
     * @param {Number} from - Beginning of the time wanted, in seconds
     * @param {Number} duration - duration wanted, in seconds
     * @returns {Array.<Object>}
     */
    getSegments(from: number, duration: number): ISegment[];
    /**
     * Returns true if the index should be refreshed.
     * @returns {Boolean}
     */
    shouldRefresh(): false;
    /**
     * Returns the starting time, in seconds, of the earliest segment currently
     * available.
     * Returns null if nothing is in the index
     * @returns {Number|null}
     */
    getFirstAvailablePosition(): number | null;
    /**
     * Returns the ending time, in seconds, of the last segment currently
     * available.
     * Returns null if nothing is in the index
     * @returns {Number|null}
     */
    getLastAvailablePosition(): number | null;
    /**
     * Returns the absolute end in seconds this RepresentationIndex can reach once
     * all segments are available.
     * @returns {number|null|undefined}
     */
    getEnd(): number | undefined | null;
    /**
     * Returns:
     *   - `true` if in the given time interval, at least one new segment is
     *     expected to be available in the future.
     *   - `false` either if all segments in that time interval are already
     *     available for download or if none will ever be available for it.
     *   - `undefined` when it is not possible to tell.
     * @param {number} start
     * @param {number} end
     * @returns {boolean|undefined}
     */
    awaitSegmentBetween(start: number, end: number): boolean | undefined;
    /**
     * Returns true if a Segment returned by this index is still considered
     * available.
     * Returns false if it is not available anymore.
     * Returns undefined if we cannot know whether it is still available or not.
     * @param {Object} segment
     * @returns {Boolean|undefined}
     */
    isSegmentStillAvailable(segment: ISegment): boolean | undefined;
    /**
     * Checks if the time given is in a discontinuity. That is:
     *   - We're on the upper bound of the current range (end of the range - time
     *     is inferior to the timescale)
     *   - The next range starts after the end of the current range.
     * @param {Number} time
     * @returns {Number|null}
     */
    checkDiscontinuity(time: number): number | null;
    /**
     * @param {Error} error
     * @returns {Boolean}
     */
    canBeOutOfSyncError(error: IPlayerError): boolean;
    /**
     * Replace this RepresentationIndex with one from a new version of the
     * Manifest.
     * @param {Object} newIndex
     */
    _replace(newIndex: TimelineRepresentationIndex): void;
    /**
     * Update this RepresentationIndex with a shorter version of it coming from a
     * new version of the MPD.
     * @param {Object} newIndex
     */
    _update(newIndex: TimelineRepresentationIndex): void;
    /**
     * Returns `false` if this RepresentationIndex currently contains its last
     * segment.
     * Returns `true` if it's still pending.
     * @returns {Boolean}
     */
    isStillAwaitingFutureSegments(): boolean;
    /**
     * @returns {Boolean}
     */
    isInitialized(): true;
    initialize(): void;
    addPredictedSegments(): void;
    /**
     * Returns `true` if the given object can be used as an "index" argument to
     * create a new `TimelineRepresentationIndex`.
     * @param {Object} index
     * @returns {boolean}
     */
    static isTimelineIndexArgument(index: ITimelineIndexIndexArgument): boolean;
    /**
     * Clean-up timeline to remove segment information which should not be
     * available due to timeshifting.
     */
    private _refreshTimeline;
    /**
     * Allows to generate the "timeline" for this RepresentationIndex.
     * Call this function when the timeline is unknown.
     * This function was added to only perform that task lazily, i.e. only when
     * first needed.
     * After calling it, every now unneeded variable will be freed from memory.
     * This means that calling _getTimeline more than once will just return an
     * empty array.
     *
     * /!\ Please note that this structure should follow the exact same structure
     * than a SegmentTimeline element in the corresponding MPD.
     * This means:
     *   - It should have the same amount of elements in its array than there was
     *     `<S>` elements in the SegmentTimeline.
     *   - Each of those same elements should have the same start time, the same
     *     duration and the same repeat counter than what could be deduced from
     *     the SegmentTimeline.
     * This is needed to be able to run parsing optimization when refreshing the
     * MPD. Not doing so could lead to the RxPlayer not being able to play the
     * stream anymore.
     * @returns {Array.<Object>}
     */
    private _getTimeline;
}
/**
 * Returns true if a Segment returned by the corresponding index is still
 * considered available.
 * Returns false if it is not available anymore.
 * Returns undefined if we cannot know whether it is still available or not.
 * /!\ We do not check the mediaURLs of the segment.
 * @param {Object} segment
 * @param {Object} index
 * @param {Object} manifestBoundsCalculator
 * @param {number|undefined} scaledPeriodEnd
 * @returns {Boolean|undefined}
 */
export declare function isSegmentStillAvailable(segment: ISegment, index: {
    availabilityTimeOffset: number;
    timeline: IIndexSegment[];
    indexTimeOffset: number;
    timescale: number;
}, manifestBoundsCalculator: ManifestBoundsCalculator, scaledPeriodEnd: number | undefined): boolean | undefined;
/**
 * Returns from the given RepresentationIndex information on the last segment
 * that may be requested currently.
 *
 * Returns `null` if there's no such segment.
 * @param {Object} index
 * @param {Object} manifestBoundsCalculator
 * @param {number|undefined} scaledPeriodEnd
 * @returns {number|null}
 */
export declare function getLastRequestableSegmentInfo(index: {
    availabilityTimeOffset: number;
    timeline: IIndexSegment[];
    timescale: number;
}, manifestBoundsCalculator: ManifestBoundsCalculator, scaledPeriodEnd: number | undefined): ILastRequestableSegmentInfo | null;
/**
 * Information on the last requestable segment deduced from a timeline array of
 * segment information.
 */
export interface ILastRequestableSegmentInfo {
    /**
     * If `true`, we know that the last requestable segment is equal to the last
     * segment that can be deduced from the corresponding given timeline.
     * Written another way, there seem to be no segment announced in the timeline
     * that are not yet requestable.
     *
     * If `false`, we know that the last requestable segment is not the last
     * segment that can be deduced from the corresponding timeline.
     * Written another way, there are supplementary segments in the timeline which
     * are not yet requestable.
     *
     * Note that if the last requestable segment has its information from the last
     * element from the timeline but it's not the last segment that would be
     * deduced from the `repeatCount` property, then this value is set to `false`.
     */
    isLastOfTimeline: boolean;
    /**
     * End time at which the last requestable segment ends, in the corresponding
     * index timescale (__NOT__ in seconds).
     */
    end: number;
    /**
     * The index in `timeline` of the last requestable segment.
     * Note that its `repeatCount` may be updated and put as `newRepeatCount`.
     */
    timelineIdx: number;
    /**
     * The new `repeatCount` value for that last segment. May be equal or
     * different from the timeline element found at `timelineIdx`.
     */
    newRepeatCount: number;
}
//# sourceMappingURL=timeline_representation_index.d.ts.map