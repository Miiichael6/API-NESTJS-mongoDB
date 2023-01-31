import { Injectable } from "@nestjs/common";
import axios, { AxiosInstance } from "axios";
import { PokeResponse } from "./interfaces/poke-response.interface";

@Injectable()
export class SeedService {
  private readonly axios: AxiosInstance = axios;

  async executedSeed() {
    try {
      const { data } = await this.axios.get<PokeResponse>(
        "https://pokeapi.co/api/v2/pokemon?limit=650"
      );

      data.results.forEach((pokemon) => {
        const segment = pokemon.url.split("/")

        const no:number = Number(segment[segment.length - 2])

        return 
      })

      return data.results;
    } catch (error) {
      console.log(error.message);
    }
  }
}
