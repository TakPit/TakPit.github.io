const world = document.querySelector(".boops");
const { Engine, Render, Runner, World, Bodies } = Matter;

function createBall() {
  const ball = Bodies.circle(Math.round(Math.random() * 1280), -30, 25, {
    angle: Math.PI * (Math.random() * 2 - 1),
    friction: 0.001,
    frictionAir: 0.01,
    restitution: 0.8,
    render: {
      sprite: {
        texture: "https://static-cdn.jtvnw.net/emoticons/v1/301299185/2.0"
      }
    }
  });

  setTimeout(() => {
    World.remove(engine.world, ball);
  }, 30000);

  return ball;
}

const engine = Engine.create();
const runner = Runner.create();
const render = Render.create({
  canvas: world,
  engine: engine,
  options: {
    width: 1280,
    height: 720,
    background: "transparent",
    wireframes: false
  }
});

const boundaryOptions = {
  isStatic: true,
  render: {
    fillStyle: "transparent",
    strokeStyle: "transparent"
  }
};
const ground = Bodies.rectangle(640, 720, 1300, 4, boundaryOptions);
const leftWall = Bodies.rectangle(0, 360, 4, 740, boundaryOptions);
const rightWall = Bodies.rectangle(1280, 360, 4, 800, boundaryOptions);

Render.run(render);
Runner.run(runner, engine);

World.add(engine.world, [ground, leftWall, rightWall]);

const handleClick = () => {
  const ball2 = createBall();
  World.add(engine.world, [ball2]);
};

const button = document.querySelector("#boop");

button.addEventListener("click", handleClick);
