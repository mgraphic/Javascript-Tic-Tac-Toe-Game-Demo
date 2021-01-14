import '../styles/index.scss';
import { Config } from './config';

export class Game {
    static PLAYER_USER = 1;
    static PLAYER_COMPUTER = 2;

    gameBoardElement;
    endGame;
    tiles;

    constructor(gameBoard) {
        this.gameBoardElement = gameBoard;
        this.reset();
    }

    reset() {
        this.endGame = false;
        this.tiles = [];
        this.gameBoardElement.innerHTML = '';
    }

    run() {
        for (let index = 0; index < 9; index++) {
            const tile = this.createTile('tile');
            tile.id = `tile-${index}`;
            tile.addEventListener('click', () => {
                this.markTile(index, Game.PLAYER_USER);
            });

            this.tiles.push({
                player: null,
                index,
                tile
            });
            this.gameBoardElement.appendChild(tile);
        }
    }

    createTile(...classNames) {
        const element = document.createElement('div');
        element.classList.add(...classNames);
        return element;
    }

    markTile(tileIndex, player) {
        if (this.endGame) {
            return;
        }

        const tile = this.tiles[tileIndex];

        if (tile.player) {
            return;
        }

        switch (player) {
            case Game.PLAYER_USER:
                tile.tile.innerHTML = Config.MARKER_USER;
                tile.player = player;
                break;

            case Game.PLAYER_COMPUTER:
                tile.tile.innerHTML = Config.MARKER_COMPUTER;
                tile.player = player;
                break;
        }

        this.checkGame();

        if (!this.endGame && player === Game.PLAYER_USER) {
            this.playOpponent();
        }
    }

    playOpponent() {
        const availableTiles = this.tiles.filter(tile => tile.player === null);

        if (availableTiles.length > 0) {
            const random = Math.floor(Math.random() * availableTiles.length);
            const tile = availableTiles[random];
            this.markTile(tile.index, Game.PLAYER_COMPUTER);
        }
    }

    checkGame() {
        if (this.isWinner(Game.PLAYER_USER)) {
            console.log('You have won!!');
            this.endGame = true;
        }
        else if (this.isWinner(Game.PLAYER_COMPUTER)) {
            console.log('You have lost!');
            this.endGame = true;
        }
        else if (this.isFinished()) {
            console.log('CATS! Nobody won!');
            this.tiles.forEach(tile => {
                tile.tile.classList.add('lost');
            });
            this.endGame = true;
        }

        if (this.endGame) {
            setTimeout(() => {
                this.reset();
                this.run();
            }, 3000);
        }
    }

    isWinner(player) {
        const winningConditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        for (let i = 0; i < winningConditions.length; i++) {
            const winningCondition = winningConditions[i];
            const className = player === Game.PLAYER_USER ? 'won' : 'lost';

            const a = this.tiles[winningCondition[0]];
            const b = this.tiles[winningCondition[1]];
            const c = this.tiles[winningCondition[2]];

            if (player === a.player && player === b.player && player === c.player) {
                a.tile.classList.add(className);
                b.tile.classList.add(className);
                c.tile.classList.add(className);
                return true;
            }
        }

        return false;
    }

    isFinished() {
        const result = this.tiles.filter(tile => tile.player !== null);
        return result.length >= 9;
    }
}
