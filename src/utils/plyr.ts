export function initRotateAndMirror(plyr: Plyr) {
  const settingsMenuDom: HTMLDivElement = (plyr as any).elements.settings?.panels?.home?.firstElementChild
  if (!settingsMenuDom) {
    return
  }

  const hMirrorLabel = (plyr as any).config.i18n.horizontalMirror || 'Horizontal Mirror'
  const vMirrorLabel = (plyr as any).config.i18n.verticalMirror || 'Vertical Mirror'
  const rotateLabel = (plyr as any).config.i18n.rotate || 'Rotate'

  const tmpDom = document.createElement('div')
  tmpDom.innerHTML = `
  <button data-plyr="settings" data-role="hMirror" type="button" class="plyr__control" role="menuitem" >
    <span>${hMirrorLabel}</span>
  </button>
  <button data-plyr="settings" data-role="vMirror" type="button" class="plyr__control" role="menuitem" >
    <span>${vMirrorLabel}</span>
  </button>
  <button data-plyr="settings" data-role="rotate" type="button" class="plyr__control" role="menuitem" >
    <span>${rotateLabel}</span>
  </button>
  `
  const hMirrorBtnDom = tmpDom.querySelector('button[data-role="hMirror"]') as HTMLButtonElement
  const vMirrorBtnDom = tmpDom.querySelector('button[data-role="vMirror"]') as HTMLButtonElement
  const rotateBtnDom = tmpDom.querySelector('button[data-role="rotate"]') as HTMLButtonElement

  let hMirrored = false
  let vMirrored = false
  let rotateTimes = 0

  const rotateAndMirror = () => {
    const mediaDom = (plyr as any).media as HTMLElement
    if (!mediaDom) {
      return
    }
    const transformStr = `rotate(${-0.25 * rotateTimes}turn) scaleX(${hMirrored ? -1 : 1}) scaleY(${vMirrored ? -1 : 1})`
    mediaDom.style.transformOrigin = 'center center'
    mediaDom.style.transform = transformStr
  }

  hMirrorBtnDom.onclick = () => {
    hMirrored = !hMirrored
    rotateAndMirror()
  }
  vMirrorBtnDom.onclick = () => {
    vMirrored = !vMirrored
    rotateAndMirror()
  }
  rotateBtnDom.onclick = () => {
    rotateTimes++
    rotateTimes %= 4
    rotateAndMirror()
  }

  settingsMenuDom.insertAdjacentElement('afterbegin', rotateBtnDom)
  settingsMenuDom.insertAdjacentElement('afterbegin', vMirrorBtnDom)
  settingsMenuDom.insertAdjacentElement('afterbegin', hMirrorBtnDom)
}
