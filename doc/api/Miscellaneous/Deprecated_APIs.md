# Deprecated APIs

This documentation lists APIs deprecated in the v3.x.x.

As we guarantee API compatibility in the v3.x.x, those API won't disappear until
we switch to a v4.x.x version.

You will find here which APIs are deprecated, why, and depending on the
concerned API, how to replace it.

## Image (BIF) APIs

The following properties methods and events have been deprecated:

- the `imageTrackUpdate` event
- the `getImageTrackData` method
- the `supplementaryImageTracks` loadVideo option

This is because most code linked to image management will be moved outside the
RxPlayer. Doing that will both be more flexible for users and much easier to
maintain for us (albeit with a small time of transition for the application).

You can replace those API by this new exported function:
[parseBifThumbnails](../Tools/parseBifThumbnails.md).

To give more details about why those APIs have been deprecated, there are
multiple reasons:

1. How it should be specified for live contents of for multi-Period DASH
   contents is not clear enough.
2. Integrating it in the RxPlayer's API means that it had to take multiple
   choices that we prefer to let to the application: whether to retry the
   request if the it fails or if it is unavailable, whether to do the request
   at all for users with a low bitrate...
3. The task of displaying those thumbnails is ultimately on the UI-side (the
   part that know where the user wants to seek)
4. The biggest part of the code related to it was a simple BIF parser, that
   can easily be re-implemented by any application.

## RxPlayer Methods

The following RxPlayer methods are deprecated.

### getManifest

`getManifest` returns our internal representation we have of a given "manifest"
document.

Though it was first exposed to allow users to have access to more precize
information on the current content, this method also limited us on the possible
evolutions we could do, as changing what this function returns would mean
breaking the API.

We also realized that that method was not used for now by the implementation we
know of.

For now, we decided we will simply remove that API in the next major version. If
that's a problem for you, please open an issue.

### getCurrentAdaptations

`getCurrentAdaptations` returns an object describing each tracks available for
the current Period in the current content.

Like `getManifest`, we found that this API was not much used and limited us on
the possible evolutions we can do on the RxPlayer.

Again like `getManifest`, we plan to remove that API completely without
replacing it.
If that's a problem for you, please open an issue.

### getCurrentRepresentations

`getCurrentRepresentations` returns an object describing each "qualities"
available in the current chosen tracks.

Exactly like `getCurrentAdaptations` and `getManifest`, we found that this API:

- was not used as far as we know
- limited the evolutions we could do on the RxPlayer's code without breaking
  the API.

We thus plan to remove that API completely without replacing it.
If that's a problem for you, please open an issue.

### getImageTrackData

`getImageTrackData` has been deprecated like most API related to BIF thumbnail
parsing.
You can read [the related chapter](#bif-apis) for more information.

You can replace this API by using the
[parseBifThumbnails](../Tools/parseBifThumbnails.md) tool.


### getCurrentKeySystem

`getCurrentKeySystem` has been deprecated in profit of the similar
[`getKeySystemConfiguration`](../Content_Information/getKeySystemConfiguration.md)
method.

Note however that the key system string optionally returned as a `keySystem`
property from the latter is slightly different than the optional string returned
from the former:

  - `getCurrentKeySystem` returned the same keysystem name used as `type`
    property of the `keySystems` `loadVideo` option originally communicated.

    For example, calling the `loadVideo` like this:
    ```js
    rxPlayer.loadVideo({
      keySystems: [{
        type: "widevine",
        // ...
      }],
      // ...
    });
    ```
    May lead to `getCurrentKeySystem` returning just `"widevine"`.

  - The `keySystem` property from `getKeySystemConfiguration` returns the actual
    key system string used, alongside the actual configuration used in its
    `configuration` key.

    For example, calling the `loadVideo` like this:
    ```js
    rxPlayer.loadVideo({
      keySystems: [{
        type: "widevine",
        // ...
      }],
      // ...
    });
    ```
    May lead to a more complex `keySystem` property being reported, like for
    example, `"com.widevine.alpha"`.


### getVideoLoadedTime

The `getVideoLoadedTime` method has been deprecated and won't be replaced in the
next major version because it was poorly named, poorly understood, and it is
easy to replace.

#### How to replace that method

To replace it, you can write:
```js
function getVideoLoadedTime() {
  const position = rxPlayer.getPosition();
  const mediaElement = rxPlayer.getVideoElement();
  if (mediaElement === null) {
    console.error("The RxPlayer is disposed");
  } else {
    const range = getRange(mediaElement.buffered, currentTime);
    return range !== null ? range.end - range.start :
                            0;
  }
}

/**
 * Get range object of a specific time in a TimeRanges object.
 * @param {TimeRanges} timeRanges
 * @returns {Object}
 */
function getRange(timeRanges, time) {
  for (let i = timeRanges.length - 1; i >= 0; i--) {
    const start = timeRanges.start(i);
    if (time >= start) {
      const end = timeRanges.end(i);
      if (time < end) {
        return { start, end };
      }
    }
  }
  return null;
}
```

### getVideoPlayedTime

The `getVideoPlayedTime` method has been deprecated and won't be replaced in the
next major version because it was poorly named, poorly understood, and it is
easy to replace.

#### How to replace that method

To replace it, you can write:
```js
function getVideoPlayedTime() {
  const position = rxPlayer.getPosition();
  const mediaElement = rxPlayer.getVideoElement();
  if (mediaElement === null) {
    console.error("The RxPlayer is disposed");
  } else {
    const range = getRange(mediaElement.buffered, currentTime);
    return range !== null ? currentTime - range.start :
  }
}

/**
 * Get range object of a specific time in a TimeRanges object.
 * @param {TimeRanges} timeRanges
 * @returns {Object}
 */
function getRange(timeRanges, time) {
  for (let i = timeRanges.length - 1; i >= 0; i--) {
    const start = timeRanges.start(i);
    if (time >= start) {
      const end = timeRanges.end(i);
      if (time < end) {
        return { start, end };
      }
    }
  }
  return null;
}
```


## RxPlayer Events

The following RxPlayer events has been deprecated.

### imageTrackUpdate

`imageTrackUpdate` events have been deprecated like most API related to BIF
thumbnail parsing.
You can read [the related chapter](#bif-apis) for more information.

You can replace this API by using the
[parseBifThumbnails](../Tools/parseBifThumbnails.md) tool.

## loadVideo options

The following loadVideo options are deprecated.

### defaultAudioTrack

[The `preferredAudioTracks` loadVideo
option](../Loading_a_Content.md#preferredaudiotracks) is now the preferred
(no pun intended) solution to set the default audio track.
This new option allows to handle much more complex use cases and can even be
updated at any time through [the `setPreferredAudioTracks`
method](../Track_Selection/setPreferredAudioTracks.md).

#### How to replace that option

It is very easy to replace `defaultAudioTrack` by `preferredAudioTracks`.

For example, if you want to have a default french audio language, you probably
previously did:

```js
player.loadVideo({
  url: myURL,
  transport: myTransport,

  defaultAudioTrack: { language: "fra", audioDescription: false },
  // or just `defaultAudioTrack: "fra"`, both are equivalent
});
```

Now you will have to set it through an array either when creating a new
RxPlayer:

```js
const player = new RxPlayer({
  preferredAudioTracks: [{ language: "fra", audioDescription: false }],
});
```

Or at any time, through the `setPreferredAudioTracks` method:

```js
player.setPreferredAudioTracks([{ language: "fra", audioDescription: false }]);
```

### defaultTextTrack

`defaultTextTrack` is replaced by [the `preferredTextTracks` constructor
option](../Loading_a_Content.md#preferredtexttracks) for the same reason
than `defaultAudioTrack`.

#### How to replace that option

It is very easy to replace `defaultTextTrack` by `preferredTextTracks`.

For example, if you want to have a default swedish subtitle language, you
probably previously did:

```js
player.loadVideo({
  url: myURL,
  transport: myTransport,

  defaultTextTrack: { language: "swe", closedCaption: false },
  // or just `defaultTextTrack: "swe"`, both are equivalent
});
```

Now you will have to set it through an array either when creating a new
RxPlayer:

```js
const player = new RxPlayer({
  preferredTextTracks: [{ language: "swe", closedCaption: false }],
});
```

Or at any time, through the `setPreferredTextTracks` method:

```js
player.setPreferredTextTracks([{ language: "fra", closedCaption: false }]);
```

### transportOptions.supplementaryTextTracks

The `supplementaryTextTracks` has been deprecated for multiple reasons:

1. The main reason is that the behavior of this API is not defined for
   multi-Period DASH contents (nor for MetaPlaylist contents): Should we only
   add the subtitles for the first Period or should it be for every Period?
   How to define a different subtitles track for the first and for the second
   Period?

   Adding an external tool much less coupled to the RxPlayer move those
   questions entirely to the application, which should know more than us what
   to do in those different cases.

2. Its API was a little arcane because we had to make it compatible with every
   possible type of contents (i.e. DASH, Smooth, MetaPlaylist etc.) out there.

3. It did not work for Directfile contents yet. Although we could have made it
   compatible with them, we thought that this was the occasion to define a
   better API to replace it.

4. Its behavior was more complex that you would initially think of. For
   example, we could have to re-download multiple times the same subtitles
   file if manual garbage collecting was enabled.

5. All usages of that API that we know of were for Smooth or DASH VoD contents
   which sadly just omitted those subtitles tracks in their Manifest. The true
   "clean" way to fix the problem in that case is to do it at the source: the
   content.
   In this case, fixing it on the player-side should only be a temporary
   work-around (don't be scared, we still have an API replacement).

The new `TextTrackRenderer` tool which replace it is much more straightforward.
As an external tool which just reads and renders already-downloaded text
subtitles, its API and the extent of what it does should be much more simple.

It's also compatible with any type of contents, even when playing through an
other player.

#### How to replace that option

Every `supplementaryTextTracks` feature can be replaced by the
`TextTrackRenderer` tool.
Please bear in mind however that they are two completely different APIs, doing
the transition might take some time.

The `TextTrackRenderer` tool is documented [here](../Tools/TextTrackRenderer.md).

### transportOptions.supplementaryImageTracks

The `supplementaryImageTracks` events have been deprecated like most API related
to BIF thumbnail parsing.
You can read [the related chapter](#bif-apis) for more information.

You can replace this API by using the
[parseBifThumbnails](../Tools/parseBifThumbnails.md) tool.


## transportOptions.aggressiveMode

The `aggressiveMode` boolean from the `transportOptions` option will be removed
from the next major version.

It has no planned replacement. Please open an issue if you need it.


### keySystems[].throwOnLicenseExpiration

The `throwOnLicenseExpiration` property of the `keySystems` option has been
replaced by the more powerful `onKeyExpiration` property.

#### How to replace that option

If you set `throwOnLicenseExpiration` to `false` before, you can simply set
`onKeyExpiration` to `"continue"` instead, which reproduce the exact same
behavior:
```ts
// old way
rxPlayer.loadVideo({
  // ...
  keySystems: [
    {
      throwOnLicenseExpiration: false,
      // ...
    }
  ],
});

// new way
rxPlayer.loadVideo({
  // ...
  keySystems: [
    {
      onKeyExpiration: "continue",
      // ...
    }
  ],
});
```

You can have more information on the `onKeyExpiration` option [in the
correspnding API documentation](../Decryption_Options.md#onkeyexpiration).

If you previously set `throwOnLicenseExpiration` to `true` or `undefined`, you
can just remove this property as this still the default behavior.


### keySystems[].onKeyStatusesChange

The `onKeyStatusesChange` callback from the `keySystems` option will be removed
from the next major version.

It has no planned replacement. Please open an issue if you need it.


## RxPlayer constructor options

The following RxPlayer constructor options are deprecated.

### throttleWhenHidden

`throttleWhenHidden`has been deprecated as video visibility relies only on
page visibility API and document hiddenness.

A video should be visible if the Picture-In-Picture mode is activated, even
if the `hidden` attribute of `document` is set to `true`.

`throttleVideoBitrateWhenHidden` relies on both and can be used like this :

```js
const rxPlayer = new RxPlayer({
  // ... RxPlayer options
  // throttleWhenHidden: true [deprecated]
  throttleVideoBitrateWhenHidden: true,
});
```

## Other properties

Some very specific properties from various methods are deprecated.
You will find them here.

### Manifest

The `adaptations` property returned by the `Manifest` object you can obtain
through the `getManifest` call is deprecated.

This corresponds to the `adaptations` property of the first element in the
`periods` object from the same `Manifest` object, so it's very easy to
replace:

```js
const manifest = player.getManifest();

if (manifest && manifest.periods.length) {
  console.log(manifest.adaptations === manifest.periods[0].adaptations); // true
}
```

### Smooth

Setting a `*.wsx`, a `*.ism` or a `*.isml` URL as an `url` property in
`loadVideo` is now deprecated when we're talking about a Smooth Streaming
content.

We recommend to only set a Manifest URL in that property when the transport is
equal to `smooth`.