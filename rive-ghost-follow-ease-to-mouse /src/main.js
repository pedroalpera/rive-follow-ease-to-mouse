// This is the High level JS runtime for Rive
// https://rive.app/community/doc/web-js/docvlgbnS1mp

const riveInstance = new rive.Rive({
  src: "ghost_ease.riv",
  canvas: document.getElementById("canvas"),
  autoplay: true,
  artboard: "Artboard",
  stateMachines: "State Machine 1",

  onLoad: () => {
    riveInstance.resizeDrawingSurfaceToCanvas();

    let canvasWidth = 500;
    let canvasHeight = 500;
    let easing = 0.05;

    let zoomScale = 0.5;

    ghost_Object = riveInstance.artboard.node("ghost_Object");
    hat_Object = riveInstance.artboard.node("hat_Object");
    face_Object = riveInstance.artboard.node("face_Object");

    // Mouse Position
    const mouse = {
      x: null,
      y: null,
    };

    mouse.x = 250;
    mouse.y = 250;

    // Canvas position in the document
    let rect = canvas.getBoundingClientRect();

    // On Mouse Move
    document.addEventListener("mousemove", function (event) {
      detectPosition(event);
    });

    //////////////
    ////////////// LOOP

    let lastTime = 0;

    // We create a loop

    function gameLoop(time) {
      if (!lastTime) {
        lastTime = time;
      }
      const elapsedTimeMs = time - lastTime;
      const elapsedTimeSec = elapsedTimeMs / 1000;
      lastTime = time;

      // Ghost Scale

      ghost_Object.scaleX = zoomScale;
      ghost_Object.scaleY = zoomScale;
      face_Object.scaleX = zoomScale;
      face_Object.scaleY = zoomScale;
      hat_Object.scaleX = zoomScale;
      hat_Object.scaleY = zoomScale;

      zoomScale = (ghost_Object.y * 1) / 450;

      if (zoomScale < 0.3) {
        zoomScale = 0.3;
      }

      if (zoomScale > 1) {
        zoomScale = 1;
      }

      rect = canvas.getBoundingClientRect();

      let vx;
      let vy;

      easing = 2.5;

      vx = (mouse.x - hat_Object.x) * easing * elapsedTimeSec;
      vy = (mouse.y - hat_Object.y) * easing * elapsedTimeSec;

      hat_Object.x += vx;

      easing = 3.5;

      vx = (mouse.x - ghost_Object.x) * easing * elapsedTimeSec;
      vy = (mouse.y - ghost_Object.y) * easing * elapsedTimeSec;

      ghost_Object.x += vx;
      ghost_Object.y += vy;
      hat_Object.y += vy;

      if (ghost_Object.y < 250) {
        easing = 3.8;
      }

      if (ghost_Object.y > 250) {
        easing = 4;
      }

      vx = (mouse.x - face_Object.x) * easing * elapsedTimeSec;
      vy = (mouse.y - face_Object.y) * easing * elapsedTimeSec;

      face_Object.x += vx;
      face_Object.y += vy;

      window.requestAnimationFrame(gameLoop);
    }
    // Start the first frame request
    window.requestAnimationFrame(gameLoop);

    ////////////// END LOOP
    //////////////

    function detectPosition(event) {
      rect = canvas.getBoundingClientRect();

      // Calculate the position
      mouse.x = (Math.floor(event.x - rect.x) * canvasWidth) / rect.width;
      mouse.y = (Math.floor(event.y - rect.y) * canvasHeight) / rect.height;
    }
  },
});
