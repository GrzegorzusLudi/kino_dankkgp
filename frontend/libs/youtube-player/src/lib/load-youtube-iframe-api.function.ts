import { memoize } from 'lodash';

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
    if (apiWindow.YT) {
      resolve(apiWindow.YT);
    }
  };
};

const requestApi = memoize(
  (): Promise<YouTubeIframeApi> =>
    new Promise<YouTubeIframeApi>((resolve) => {
      registerApiReadyCallback(resolve);
      if (!isApiScriptInDom()) {
        injectApiScript();
      }
    }),
);

export const loadYouTubeIframeApi = (): Promise<YouTubeIframeApi> => {
  if (!isBrowserEnvironment()) {
    return Promise.reject(
      new Error('YouTube IFrame API requires a browser environment'),
    );
  }

  const apiWindow = getApiWindow();

  if (apiWindow.YT?.Player) {
    return Promise.resolve(apiWindow.YT);
  }

  return requestApi();
};
