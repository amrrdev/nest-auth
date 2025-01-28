import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @Index()
  id: number;

  @Column({ unique: true })
  @Index()
  email: string;

  @Column({ length: 200 })
  password: string;
}
