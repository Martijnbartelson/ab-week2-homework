import {JsonController, Get, Post, HttpCode, Param, Body, Put, NotFoundError, BadRequestError} from 'routing-controllers'
import Game, {Update, Board} from './entity'


@JsonController()
export default class GameController {
  @Get('/games')
  async allGames() {
    const games = await Game.find()
    return { games }
  }

  @Post('/games')
  @HttpCode(201)
  createGame(
    @Body() game: Game 
  ) { 
    return game.save() 
  }

  @Put('/games/:id')
  async updateGame(
    @Param('id') id: number,
    @Body() update: Update
  ) {
    const game = await Game.findOne(id)
    if (!game) throw new NotFoundError('Cannot find game')
    if (update.id) throw new BadRequestError('Not allowed to change the game id')
    
    if (update.board) {
      let board1 = update.board
      let board2 = game.board
     
      const moves = (board1:Board, board2:Board) => 
        board1
          .map((row, y) => row.filter((cell, x) => board2[y][x] !== cell))
          .reduce((a, b) => a.concat(b))
          .length === 1

      const moveIsValid = moves(board1,board2)

      if (moveIsValid){ 
        return Game.merge(game, update).save()
      } else {
        throw new BadRequestError('Only one move per update is allowed')
      } 
    } else {
      return Game.merge(game, update).save()
    }
  }
}