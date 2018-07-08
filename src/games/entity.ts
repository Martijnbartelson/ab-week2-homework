import { Entity, PrimaryGeneratedColumn, Column} from 'typeorm'
import { BaseEntity } from 'typeorm/repository/BaseEntity'
import { IsString, IsOptional, ValidatorConstraint, ValidatorConstraintInterface, Validate } from 'class-validator'


enum Color { 'red', 'blue', 'green', 'yellow', 'magenta' }

type Colors = 'red'| 'blue'| 'green'| 'yellow'| 'magenta' 

export type Board = [ 
  [ "a" | "b" | "o", "a" | "b" | "o", "a" | "b" | "o" ],
  [ "a" | "b" | "o", "a" | "b" | "o", "a" | "b" | "o" ],
  [ "a" | "b" | "o", "a" | "b" | "o", "a" | "b" | "o" ] 
]

export const defaultBoard = [
	['o', 'o', 'o'],
	['o', 'o', 'o'],
	['o', 'o', 'o']
]

@ValidatorConstraint({ name: "validateColor", async: false })
class ValidateColor implements ValidatorConstraintInterface {

    validate(color: string) {
        return [ 'red', 'blue', 'green', 'yellow', 'magenta'].includes(color) 
    }

    defaultMessage() { 
        return "This is not a valid color, only 'red', 'blue', 'green', 'yellow' or 'magenta' are allowed";
    }
}

@ValidatorConstraint({ name: "validateBoard", async: false })
class ValidateBoard implements ValidatorConstraintInterface {

    validate(board: Board) {
        const chars = ['o','a','b']
        let valid = board.length === 3 && board.every(line=>line.length === 3 && line.every(field=>chars.includes(field)))
        return valid 
    }

    defaultMessage() { 
        return "This is not a valid board, please POST a valid board";
    }
}

export class Update {
  @IsOptional()
  id?: number

  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @Validate(ValidateColor)
  color?: Colors 

  @IsOptional()
  @Validate(ValidateBoard)
  board?: Board 
}
                  
@Entity()
export default class Game extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number

  @IsString()
  @Column('text')
  name: string

  @Column('text', {default: Color[Math.floor(Math.random()*5)]})
  color: Colors 
 
  @Column('json', {default: JSON.stringify(defaultBoard) })
  board: Board 
}


