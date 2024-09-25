/**@type{HTMLCanvasElement} */

const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
grad.addColorStop(0, 'white')
grad.addColorStop(0.5, 'blue')
grad.addColorStop(1, 'orange')

const effect = new Effect(canvas.width, canvas.offsetHeight);
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  effect.render(ctx);
  requestAnimationFrame(animate);
}
animate();

window.addEventListener("resize", () => {
  canvas.width = canvas.width;
  canvas.height = canvas.height;
});
