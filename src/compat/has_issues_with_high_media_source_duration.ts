import config from "../config";
import { isPlayStation5 } from "./browser_detection";

/**
 * Some platforms have issues when the `MediaSource`'s `duration` property
 * is set to a very high value (playback freezes) but not when setting it
 * to `Infinity`, which is what the HTML spec as of now (2023-05-15) recommends
 * for live contents.
 *
 * However setting the `MediaSource`'s `duration` property to `Infinity` seems
 * more risky, considering all platforms we now support, than setting it at a
 * relatively high ~2**32 value which is what we do generally.
 *
 * Moreover, setting it to `Infinity` require us to use another MSE API,
 * `setLiveSeekableRange` to properly allow seeking. We're used to MSE issues so
 * I'm not too confident of using another MSE API for all platforms directly.
 *
 * So this methods just return `true` based on a whitelist of platform for which
 * it has been detected that high `duration` values cause issues but setting it
 * to Infinity AND playing with `setLiveSeekableRange` does not.
 *
 * @returns {boolean}
 */
export default function hasIssuesWithHighMediaSourceDuration(): boolean {
  const { FORCE_HAS_ISSUES_WITH_HIGH_MEDIA_SOURCE_DURATION } = config.getCurrent();
  // For now only seen on the Webkit present in the PlayStation 5, for which the
  // alternative is known to work.
  return FORCE_HAS_ISSUES_WITH_HIGH_MEDIA_SOURCE_DURATION || isPlayStation5;
}
