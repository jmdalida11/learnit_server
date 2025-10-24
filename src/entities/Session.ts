import {
  Entity,
  Index,
  Column,
  PrimaryColumn,
  DeleteDateColumn,
  BaseEntity,
} from "typeorm";

@Entity()
export class Session extends BaseEntity {
  @PrimaryColumn("varchar", { length: 255 })
  id: string;

  @Index()
  @Column("bigint")
  expiredAt: number;

  @Column("text")
  json: string;

  @DeleteDateColumn()
  destroyedAt?: Date;
}
