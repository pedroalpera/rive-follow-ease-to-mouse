// This is the High level JS runtime for Rive
// https://rive.app/community/doc/web-js/docvlgbnS1mp

const canvas = document.getElementById("canvas");
if (!canvas) {
  throw new Error("No canvas element found");
}

const riveInstance = new rive.Rive({
  src: "ghost_ease.riv",
  canvas: document.getElementById("canvas"),
  autoplay: true,
  artboard: "Artboard",
  stateMachines: "State Machine 1",

  onLoad: () => {
    riveInstance.resizeDrawingSurfaceToCanvas();

    // a rect object to store the canvas position
    const rect = { x: 0, y: 0, width: 0, height: 0 };
    // a boolean to check if the canvas is visible
    let isVisible = true;

    let canvasWidth = 500;
    let canvasHeight = 500;
    let lastScrollPosition = window.scrollY;

    let easing = 0.05;
    let zoomScale = 0.5;

    ghost_Object = riveInstance.artboard.node("ghost_Object");
    hat_Object = riveInstance.artboard.node("hat_Object");
    face_Object = riveInstance.artboard.node("face_Object");

    // Mouse Position
    const mouse = {
      x: 250,
      y: 250,
    };

    ////////////// - LOOP - //////////////

    let lastTime = 0;

    // We create a loop

    function gameLoop(time) {
      if (!lastTime) {
        lastTime = time;
      }
      const elapsedTimeMs = time - lastTime;
      // Limit the elapsed time to 1 second to avoid overshooting
      const elapsedTimeSec = Math.min(elapsedTimeMs / 1000, 1);
      lastTime = time;

        // Calculate the position inside of the game loop to have live updates
      // when the document is scrolled or resized without moving the mouse.
      const pos = {
        x: (Math.floor(mouse.x - rect.x) * canvasWidth) / rect.width,
        y: (Math.floor(mouse.y - rect.y) * canvasHeight) / rect.height,
      };

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

      let vx;
      let vy;

      easing = 2.5;

      vx = (pos.x - hat_Object.x) * easing * elapsedTimeSec;
      vy = (pos.y - hat_Object.y) * easing * elapsedTimeSec;

      hat_Object.x += vx;

      easing = 3.5;

      vx = (pos.x - ghost_Object.x) * easing * elapsedTimeSec;
      vy = (pos.y - ghost_Object.y) * easing * elapsedTimeSec;

      ghost_Object.x += vx;
      ghost_Object.y += vy;
      hat_Object.y += vy;

      if (ghost_Object.y < 250) {
        easing = 3.8;
      }

      if (ghost_Object.y > 250) {
        easing = 4;
      }

      vx = (pos.x - face_Object.x) * easing * elapsedTimeSec;
      vy = (pos.y - face_Object.y) * easing * elapsedTimeSec;

      face_Object.x += vx;
      face_Object.y += vy;

      window.requestAnimationFrame(gameLoop);
    }

    ////////////// - END LOOP - //////////////

    function pointerMoveCallback(event) {
      // Set mouse position
      mouse.x = event.clientX;
      mouse.y = event.clientY;
    }

    // Update the canvas rect value when the canvas is visible
    const updateRect = () => {
      if (!isVisible) return;
      const canvasRect = canvas.getBoundingClientRect();
      rect.x = canvasRect.x;
      rect.y = canvasRect.y;
      rect.width = canvasRect.width;
      rect.height = canvasRect.height;
    };

    // Observe the canvas position in the document
    // and detect when it is visible or not
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (!isVisible) return;
          rect.x = entry.boundingClientRect.x;
          rect.y = entry.boundingClientRect.y;
          rect.width = entry.boundingClientRect.width;
          rect.height = entry.boundingClientRect.height;
        });
      },
      { threshold: 0 }
    );

    observer.observe(canvas);

    // onpointermove is a universal event for all types of pointing devices
    document.addEventListener("pointermove", pointerMoveCallback);
    document.addEventListener("pointerdown", pointerMoveCallback);

    // Add listeners to the window to update the canvas rect
    window.addEventListener("resize", updateRect);
    window.addEventListener("orientationchange", updateRect);
    window.addEventListener("scroll", () => {
      updateRect();

      // On touch devices update mouse.y based on the scroll position
      if (!("ontouchstart" in window)) return;

      const scrollDeltaPosition = window.scrollY - lastScrollPosition;
      lastScrollPosition = window.scrollY;

      mouse.y -= scrollDeltaPosition;
    });

    // Initial update
    updateRect();
    // Start the game loop
    window.requestAnimationFrame(gameLoop);
  },
});
