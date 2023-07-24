import { Entity, Column, PrimaryGeneratedColumn, Index } from "typeorm";
import { Point } from "geojson";
import { stationBrandEnum } from "../enums/stationBrandEnum";

@Entity()
export class Station {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  brand: stationBrandEnum;

  @Column()
  name: string;

  @Column({ type: "geography", spatialFeatureType: "Point" })
  @Index({ spatial: true })
  location: Point;

  @Column({ nullable: true })
  address: string;

  @Index()
  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  postcode: string;

  @Column({ nullable: true })
  telephone: string;

  @Index()
  @Column({ nullable: true })
  voivodeship: string;

  @Index()
  @Column({ nullable: true })
  county: string;
}
