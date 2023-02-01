import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { isValidObjectId, Model } from "mongoose";
import { Pokemon } from "./entities/pokemon.entity";
import { CreatePokemonDto } from "./dto/create-pokemon.dto";
import { UpdatePokemonDto } from "./dto/update-pokemon.dto";
import { InjectModel } from "@nestjs/mongoose";
import { PaginationDto } from "../common/dto/pagination.dto";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class PokemonService {
  // inyectando la tabla
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,

    private readonly configService: ConfigService
  ) {}

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();

    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);

      return pokemon;
    } catch (error: any) {
      this.handleExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    try {
      const { limit = 0, offset = 0 } = paginationDto;

      const allPokemons = await this.pokemonModel
        .find()
        .limit(limit)
        .skip(offset)
        .sort({
          no: 1,
        })
        .select("-__v");

      return allPokemons;
    } catch (error: any) {
      console.log(error.message);
    }
  }

  async findOne(termino: string) {
    let pokemon: Pokemon;
    if (isValidObjectId(termino)) {
      pokemon = await this.pokemonModel.findById(termino);
      return pokemon;
    }

    if (!isNaN(+termino)) {
      pokemon = await this.pokemonModel.findOne({ no: termino });
    }

    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({
        name: termino.toLowerCase().trim(),
      });
    }

    if (!pokemon)
      throw new NotFoundException(
        `Pokemon with termino ${termino} does not exist in the database`
      );

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    try {
      const pokemon = await this.findOne(term);

      if (updatePokemonDto.name) {
        updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
      }

      pokemon.no = updatePokemonDto.no || pokemon.no;
      pokemon.name = updatePokemonDto.name || pokemon.name;

      await pokemon.save();

      return pokemon;
    } catch (error: any) {
      this.handleExceptions(error);
    }
  }

  async remove(_id: string) {
    // const pokemon = await this.findOne(id)

    // await pokemon.deleteOne();

    const { deletedCount } = await this.pokemonModel.deleteOne({ _id });

    if (deletedCount === 0) {
      throw new BadRequestException(`Pokemon con id ${_id} no existe`);
    }

    return;
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Pokemon ya existe en la db ${JSON.stringify(error.keyValue)}`
      );
    }

    throw new InternalServerErrorException(`Check logs`);
  }
}
