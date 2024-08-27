import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'text' })
  name: string;
  @Column({ type: 'text' })
  phone: string;
  @Column({ type: 'text' })
  email: string;
  @Column({ type: 'text', nullable: false })
  password: string;
  @Column({ type: 'text' })
  address: string;

  @Column({ type: 'text', default: 'user' })
  role: string;
  @Column({ type: 'boolean', default: 'false' })
  active: boolean;
}
