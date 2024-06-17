import type {
  IAdaptiveRepresentationSelectorArguments,
  IABRThrottlers,
  IResolutionInfo,
} from "./adaptive";
import type {
  ICmcdHeadersData,
  ICmcdQueryData,
  ICmcdHeadersPayload,
  ICmcdQueryPayload,
  ICmcdPayload,
} from "./cmcd";
import type {
  IManifestFetcherSettings,
  ISegmentFetcherCreatorBackoffOptions,
} from "./fetchers";
import type {
  IBufferedChunk,
  IBufferType,
  ITextDisplayerInterface,
} from "./segment_sinks";
import type SegmentSinksStore from "./segment_sinks";
import type {
  IAdaptationChoice,
  IPausedPlaybackObservation,
  IInbandEvent,
  IRepresentationsChoice,
  IStreamOrchestratorPlaybackObservation,
  ITrackSwitchingMode,
} from "./stream";

// NOTE: Only types should be exported by this file: Importing it should
// not increase a JavaScript bundle's size

/** Type of an `SegmentSinksStore` class. */
export type ISegmentSinksStore = SegmentSinksStore;

export type {
  // Adaptive Metadata
  IAdaptiveRepresentationSelectorArguments,
  IABRThrottlers,
  IResolutionInfo,

  // Fetchers Metadata
  IManifestFetcherSettings,
  ISegmentFetcherCreatorBackoffOptions,

  // Media Sinks Metadata
  IBufferType,
  IBufferedChunk,
  ITextDisplayerInterface,

  // Stream Metadata
  IAdaptationChoice,
  IInbandEvent,
  IPausedPlaybackObservation,
  IStreamOrchestratorPlaybackObservation,
  IRepresentationsChoice,
  ITrackSwitchingMode,

  // CMCD
  ICmcdHeadersData,
  ICmcdQueryData,
  ICmcdHeadersPayload,
  ICmcdQueryPayload,
  ICmcdPayload,
};
