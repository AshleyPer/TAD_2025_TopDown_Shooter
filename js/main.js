import { tad, shape, text } from "../lib/TeachAndDraw.js";

tad.use(update);

function update() {
    const circleX = 100;
    const circleY = 100;
    shape.circle(100, 100, 100, 100);
    shape.colour = "blue";
    shape.rectangle(300, 300, 200, 100);
    shape.colour = "white";

    text.colour = "white";
    text.size = 20;
    text.print(200, 20, "hello world");
}
