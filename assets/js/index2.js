const showcase = document.getElementById("showcase");

if (showcase) {
  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;
  let moved = false;
  let velocity = 0;
  let lastX = 0;
  let lastTime = 0;
  let momentumID = null;

  const dragThreshold = 8;
  const dragDelay = 150;

  let dragTimer = null;
  let isDragging = false;

  function stopDragging() {
    if (!isDown) return;
    isDown = false;
    isDragging = false;
    showcase.classList.remove("grabbing");
    startMomentum();
  }

  function startMomentum() {
    let v = velocity * 20;
    function momentum() {
      showcase.scrollLeft -= v;
      v *= 0.95;
      if (Math.abs(v) > 8) momentumID = requestAnimationFrame(momentum);
    }
    momentum();
  }

  showcase.addEventListener("mousedown", (e) => {
    isDown = true;
    moved = false;
    isDragging = false;

    startX = e.pageX - showcase.offsetLeft;
    scrollLeft = showcase.scrollLeft;

    lastX = e.pageX;
    lastTime = Date.now();

    cancelAnimationFrame(momentumID);

    dragTimer = setTimeout(() => {
      if (isDown) {
        isDragging = true;
        showcase.classList.add("grabbing");
      }
    }, dragDelay);
  });

  showcase.addEventListener("mousemove", (e) => {
    if (!isDown) return;

    const x = e.pageX - showcase.offsetLeft;
    const walk = x - startX;

    if (Math.abs(walk) > dragThreshold) {
      clearTimeout(dragTimer);
      isDragging = true;
      moved = true;
      showcase.classList.add("grabbing");
      e.preventDefault();
    }

    if (!isDragging) return;

    showcase.scrollLeft = scrollLeft - walk;

    const now = Date.now();
    velocity = (e.pageX - lastX) / (now - lastTime);

    lastX = e.pageX;
    lastTime = now;
  });

  document.addEventListener("mouseup", stopDragging);
  showcase.addEventListener("mouseleave", stopDragging);

  showcase.addEventListener(
    "click",
    (e) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
      }
      moved = false;
    },
    true,
  );

  window.addEventListener("load", () => {
    showcase.scrollLeft = 0;
  });
}
