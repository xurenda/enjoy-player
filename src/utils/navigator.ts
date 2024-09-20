export const isMac = (() => /macintosh|mac os x/i.test(navigator.userAgent))()

export const isWindows = (() => /windows|win32/i.test(navigator.userAgent))()
