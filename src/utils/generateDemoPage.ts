export default function generateDemoPage(animationData, animationStyle, backgroundConfig) {
  /* eslint-disable no-useless-escape */
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <style>
          body {
            background-color: #fff;
            margin: 0px;
            height: 100%;
            overflow: hidden;
          }

          .lottie-wrapper {
            margin: 0 auto;
            background-color: ${backgroundConfig.backgroundColor || '#fff'};
            width: ${backgroundConfig.width + 'px' || '100%'};
            height: ${backgroundConfig.height + 'px' || '100%'};
          }

          #lottie {
            margin: 0 auto;
            width: ${animationStyle.width + 'px' || '375px'};
            height: ${animationStyle.height + 'px' || '375px'};
            display: block;
            overflow: hidden;
            transform: translate3d(0, 0, 0);
            text-align: center;
            opacity: 1;
          }
        </style>
        <script type="text/javascript" src="https://paiangit.github.io/lottie_light.min.js">
        </script>
      </head>

      <body>
        <div class="lottie-wrapper">
          <div id="lottie"></div>
        </div>

        <script>
          var animationData = ${animationData};
          var params = {
            container: document.getElementById('lottie'),
            renderer: 'svg',
            loop: true,
            autoplay: true,
            animationData: animationData
          };
          var anim;
          anim = lottie.loadAnimation(params);
        </script>
      </body>
    </html>
  `;
};
