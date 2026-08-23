import { memoize, noop } from 'lodash-es';
import { match, P } from 'ts-pattern';

import { IFRAME_API_SRC } from './youtube-player.consts';
import { YouTubeApiWindow, YouTubeIframeApi } from './youtube-player.types';

const isBrowserEnvironment = (): boolean =>
  typeof window !== 'undefined' && typeof document !== 'undefined';

const getApiWindow = (): Window & YouTubeApiWindow =>
  window as Window & YouTubeApiWindow;

const isApiScriptInDom = (): boolean =>
  document.querySelector(`script[src="${IFRAME_API_SRC}"]`) !== null;

const injectApiScript = (): void => {
  const script = document.createElement('script');
  script.src = IFRAME_API_SRC;
  script.async = true;
  document.head.appendChild(script);
};

const registerApiReadyCallback = (
  resolve: (api: YouTubeIframeApi) => void,
): void => {
  const apiWindow = getApiWindow();
  const previousCallback = apiWindow.onYouTubeIframeAPIReady;

  apiWindow.onYouTubeIframeAPIReady = () => {
    previousCallback?.();
    match(apiWindow.YT)
      .with(P.nonNullable, (yt) => resolve(yt))
      .otherwise(noop);
  };
};

const requestApi = memoize(
  (): Promise<YouTubeIframeApi> =>
    new Promise<YouTubeIframeApi>((resolve) => {
      registerApiReadyCallback(resolve);
      match(isApiScriptInDom()).with(false, injectApiScript).otherwise(noop);
    }),
);

export const loadYouTubeIframeApi = (): Promise<YouTubeIframeApi> =>
  match(isBrowserEnvironment())
    .with(false, () =>
      Promise.reject<YouTubeIframeApi>(
        new Error('YouTube IFrame API requires a browser environment'),
      ),
    )
    .otherwise(() =>
      match(getApiWindow().YT)
        .with({ Player: P.nonNullable }, (yt) => Promise.resolve(yt))
        .otherwise(() => requestApi()),
    );
