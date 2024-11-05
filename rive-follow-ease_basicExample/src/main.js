// This is the High level JS runtime for Rive
// https://rive.app/community/doc/web-js/docvlgbnS1mp

const canvas = document.getElementById("canvas");
if (!canvas) {
  throw new Error("No canvas element found");
}

const riveInstance = new rive.Rive({
  src: "ease_to_mouse.riv",
  canvas: canvas,
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

    const draggedObjects = [
      riveInstance.artboard.node("DraggedObject001"),
      riveInstance.artboard.node("DraggedObject002"),
      riveInstance.artboard.node("DraggedObject003"),
      riveInstance.artboard.node("DraggedObject004"),
      riveInstance.artboard.node("DraggedObject005"),
      riveInstance.artboard.node("DraggedObject006"),
    ];

    // Mouse Position
    const mouse = {
      x: 250,
      y: 250,
    };

    ////////////// - LOOP - //////////////
    let lastTime = 0;

    function gameLoop(time) {
      window.requestAnimationFrame(gameLoop);

      // Skip frame if the canvas is not visible
      if (!isVisible) return;

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

      // initial easing value
      easing = 3.5;

      // Loop through all dragged objects and apply easing
      draggedObjects.forEach((dragObject) => {
        let vx = (pos.x - dragObject.x) * easing * elapsedTimeSec;
        let vy = (pos.y - dragObject.y) * easing * elapsedTimeSec;
        dragObject.x += vx;
        dragObject.y += vy;
        easing += 0.5;
      });
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
      { threshold: 0 },
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
