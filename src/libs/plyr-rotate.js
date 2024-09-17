;(function init(document) {
  function rotate(player, times = 1) {
    const turn = times % 4
    const rotateDeg = 0.25 * turn
    const scale = 1 // -1 翻转/镜像
    player.media.style.transformOrigin = 'center center'
    player.media.style.transform = `rotate(${rotateDeg}turn) scale(${scale})`
    player.media.style.webKitTransform = `rotate(${rotateDeg}turn) scale(${scale})`
  }

  document.addEventListener('ready', event => {
    const curPlayer = event.detail.plyr
    const { config } = curPlayer
    if (Array.isArray(config.controls) && config.controls.includes('rotate')) {
      const captureLabel = config.i18n.rotate || '旋转'

      const menu = document.querySelector('.plyr__controls__item.plyr__menu')
      const btn = `
            <button class="plyr__controls__item plyr__control" type="button" data-plyr="rotate">
                <svg role="presentation" focusable="false">
                    <path d="M15.236,1.365l0.13,2.674c-1.521-1.792-3.752-2.825-6.101-2.822c-3.913,0-7.17,2.808-7.869,6.521
                    c-0.039,0.21,0.1,0.413,0.311,0.452c0.023,0.003,0.047,0.006,0.07,0.006h1.584c0.18,0,0.336-0.124,0.377-0.299
                    c0.736-3.051,3.805-4.929,6.856-4.194c1.384,0.333,2.593,1.174,3.385,2.355L10.702,5.9c-0.213-0.011-0.394,0.155-0.404,0.369
                    c0,0.006,0,0.012,0,0.019V7.82c0,0.213,0.175,0.388,0.388,0.388h6.469c0.213,0,0.388-0.174,0.388-0.388V1.347
                    c0-0.214-0.175-0.388-0.388-0.388h-1.532c-0.212,0-0.386,0.174-0.386,0.388C15.236,1.353,15.236,1.359,15.236,1.365z M9.266,14.915
                    c-1.894,0.002-3.663-0.94-4.717-2.512l3.289,0.155c0.214,0.012,0.396-0.153,0.405-0.366c0-0.008,0-0.014,0-0.021v-1.529
                    c0-0.215-0.173-0.388-0.388-0.388H1.388C1.174,10.254,1,10.427,1,10.642v6.471C1,17.327,1.174,17.5,1.388,17.5h1.53
                    c0.214,0,0.388-0.173,0.388-0.388c0-0.006,0-0.012,0-0.019l-0.134-2.669c1.52,1.79,3.748,2.818,6.095,2.816
                    c3.913,0,7.17-2.807,7.868-6.521c0.039-0.209-0.102-0.412-0.311-0.45c-0.022-0.006-0.047-0.008-0.07-0.008h-1.585
                    c-0.181,0-0.336,0.124-0.378,0.301C14.177,13.115,11.892,14.917,9.266,14.915z"/>
                </svg>
                <span class="plyr__sr-only">${captureLabel}</span>
            </button>
            `
      menu.insertAdjacentHTML('beforebegin', btn)
      let times = 1
      const btnElement = document.querySelector('button[data-plyr="rotate"]')
      btnElement.addEventListener('click', () => {
        rotate(curPlayer, (times += 1))
      })
    }
  })
})(document)
