# Enjoy-player

English | [简体中文](./README-zh_CN.md)

---

Enjoy-player is an online video player that supports web pages and Windows, Mac and Linux desktop applications. It is mainly used for online browsing of CMS video acquisition station resources, and realizes the online playback of HLS video stream (m3u8).

## Features

- Realize Web pages and Windows, Mac, Linux desktop applications
- You only need one URL to import CMS video acquisition station resources
- Support multiple languages (i18n)
- Rich settings are provided, such as interface settings, player settings, etc
- Support data backup and restoration
- Provides keyboard shortcuts for commonly used functions

# TODO

- [ ] History playback record
- [ ] Search history
- [ ] Collection feature
- [ ] XML format data support
- [ ] M3u8 live streaming source support
- [x] Export/Import/Reset Settings and Playback Sources
- [x] Drag and drop files or paste import settings and playback sources

## Screenshot

![Screenshot](./screenshot/1.png)
![Screenshot](./screenshot/2.png)
![Screenshot](./screenshot/3.png)
![Screenshot](./screenshot/4.png)

## Using

### Desktop applications

Please download the latest version from [releases](https://github.com/xurenda/enjoy-player/releases) page, which supports Windows, Mac, and Linux

### Web page

```sh
git clone https://github.com/xurenda/enjoy-player.git
cd enjoy-player
pnpm install
pnpm run dev:web
```

> It is recommended to use desktop applications, because there may be a problem that cross-domain requests cannot obtain data on the web terminal.

## Video source

1. Search for "CMS Video Resource Station" on search engines
2. After entering a video resource station, check the collection tutorial and copy the JSON interface URL address.

## Reference projects

- [h-player-v2](https://github.com/ZyqGitHub1/h-player-v2)
