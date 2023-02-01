import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PokeResponse } from "./interfaces/poke-response.interface";
import { Model } from "mongoose";
import { Pokemon } from "../pokemon/entities/pokemon.entity";
import { AxiosAdapter } from "../common/adapters/axios.adapter";

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,

    private readonly httpAxios: AxiosAdapter
  ) {}

  // git checkout -- . = regresa al ultimo commit cambiado
  async executedSeed() {
    await this.pokemonModel.deleteMany({});
    try {
      const data = await this.httpAxios.get<PokeResponse>(
        "https://pokeapi.co/api/v2/pokemon?limit=10"
      );

      const pokemonToInsertDb = [];

      // const insertPromisesArray = [];

      data.results.forEach(async (pokemon) => {
        const segment = pokemon.url.split("/");
        const no = Number(segment[segment.length - 2]);

        let insertPokemon = {
          name: pokemon.name,
          no: no,
        };

        // insertPromisesArray.push(this.pokemonModel.create(insertPokemon));
        pokemonToInsertDb.push(insertPokemon);
      });

      // const pokemonsInDb = await Promise.all(insertPromisesArray);
      const pokemonsInDb = await this.pokemonModel.insertMany(
        pokemonToInsertDb
      );

      return pokemonsInDb;
    } catch (error) {
      console.log(error.message);
    }
  }
}
