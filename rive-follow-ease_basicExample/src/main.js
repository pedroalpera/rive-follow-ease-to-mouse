// This is the High level JS runtime for Rive
// https://rive.app/community/doc/web-js/docvlgbnS1mp

const riveInstance = new rive.Rive({
  src: "ease_to_mouse.riv",
  canvas: document.getElementById("canvas"),
  autoplay: true,
  artboard: "Artboard",
  stateMachines: "State Machine 1",

  onLoad: () => {
    riveInstance.resizeDrawingSurfaceToCanvas();

    let canvasWidth = 500;
    let canvasHeight = 500;
    let easing = 0.05;

    draggedObject001 = riveInstance.artboard.node("DraggedObject001");
    draggedObject002 = riveInstance.artboard.node("DraggedObject002");
    draggedObject003 = riveInstance.artboard.node("DraggedObject003");
    draggedObject004 = riveInstance.artboard.node("DraggedObject004");
    draggedObject005 = riveInstance.artboard.node("DraggedObject005");
    draggedObject006 = riveInstance.artboard.node("DraggedObject006");

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

      easing =  3.5;

      rect = canvas.getBoundingClientRect();

      let vx = ((mouse.x - draggedObject001.x) * easing) * elapsedTimeSec;
      let vy = ((mouse.y - draggedObject001.y) * easing) * elapsedTimeSec;

      draggedObject001.x += vx;
      draggedObject001.y += vy;

      easing = 4
      
       vx = ((mouse.x - draggedObject002.x) * easing) * elapsedTimeSec;
       vy = ((mouse.y - draggedObject002.y) * easing) * elapsedTimeSec;

      draggedObject002.x += vx;
      draggedObject002.y += vy;

      easing = 4.5
      
      vx = ((mouse.x - draggedObject003.x) * easing) * elapsedTimeSec;
      vy = ((mouse.y - draggedObject003.y) * easing) * elapsedTimeSec;

     draggedObject003.x += vx;
     draggedObject003.y += vy;

     
     easing = 5

     vx = ((mouse.x - draggedObject004.x) * easing) * elapsedTimeSec;
     vy = ((mouse.y - draggedObject004.y) * easing) * elapsedTimeSec;

    draggedObject004.x += vx;
    draggedObject004.y += vy;

    easing = 5.5

    vx = ((mouse.x - draggedObject005.x) * easing) * elapsedTimeSec;
    vy = ((mouse.y - draggedObject005.y) * easing) * elapsedTimeSec;

   draggedObject005.x += vx;
   draggedObject005.y += vy;

   easing = 6

   vx = ((mouse.x - draggedObject006.x) * easing) * elapsedTimeSec;
   vy = ((mouse.y - draggedObject006.y) * easing) * elapsedTimeSec;

  draggedObject006.x += vx;
  draggedObject006.y += vy;

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
