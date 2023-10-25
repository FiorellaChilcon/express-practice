import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, Index, BeforeInsert, BeforeUpdate } from 'typeorm';
import { BcryptGateway } from '@/infra/gateways';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
    id!: string;

  @Column()
    firstName: string;

  @Column()
    lastName: string;

  @Index('username_index')
  @Column({ unique: true })
    username: string;

  @Index('email_index')
  @Column({ unique: true })
    email: string;

  @Column()
    password: string;

  @BeforeUpdate()
  @BeforeInsert()
  hashPassword() {
    this.password = BcryptGateway.hash(this.password);
  }
}
