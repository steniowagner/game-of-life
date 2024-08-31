# Game of life

<img src="https://github.com/steniowagner/game-of-life/blob/main/images/game-of-life.png" />

The Game of Life, also known simply as Life, is a cellular automaton devised by the British mathematician John Horton Conway in 1970. It is a zero-player game, meaning that its evolution is determined by its initial state, requiring no further input. One interacts with the Game of Life by creating an initial configuration and observing how it evolves. It is Turing complete and can simulate a universal constructor or any other Turing machine.

Rules:

1. Any live cell with fewer than two live neighbours dies, as if by underpopulation.
2. Any live cell with two or three live neighbours lives on to the next generation.
3. Any live cell with more than three live neighbours dies, as if by overpopulation.
4. Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.

You can learn more about Game of life [here](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life).

## Production URL
https://steniowagner.github.io/game-of-life/

## Getting Started

### Prerequisites

To run this project locally, make sure that you have npm and NodeJS installed in your local environment. If you don't have nodejs/npm installed locally, you can find the download page [here](https://nodejs.org/en/download/package-manager).

### Installing

**Cloning the Repository**

```
$ git clone https://github.com/steniowagner/game-of-life

$ cd game-of-life
```

> For sake of simplicify, I'll be using npm as the package-manager for this tutorial. But you can use your favorite one as well.

**Installing dependencies**

```
$ npm install
```

**Building**

Before we import our extenion into Google Chrome, we have to build it.

```
$ npm run build
```

**Testing**

You can run the test-cases in the project by running the following script:

```
$ npm run test
```
