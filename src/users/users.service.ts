import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { LoginUserInput } from './dto/login-user.input';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { AuthService } from '@/common/auth/services/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly authService: AuthService,
  ) {}

  async create(createUserInput: CreateUserInput) {
    const saltOrRounds = 10;
    const password = createUserInput.password;
    createUserInput.password = await bcrypt.hash(password, saltOrRounds);
    const user = new this.userModel(createUserInput);
    return user.save();
  }

  findAll() {
    return this.userModel.find().exec();
  }

  async findOne(id: string) {
    const user = await this.userModel.findOne({ _id: id }).exec();
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }
    return user;
  }

  async update(id: string, updateUserInput: UpdateUserInput) {
    const existingUser = await this.userModel
      .findOneAndUpdate({ _id: id }, { $set: updateUserInput }, { new: true })
      .exec();

    if (!existingUser) {
      throw new NotFoundException(`User ${id} not found`);
    }
    return existingUser;
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    return user.remove();
  }

  async findOneByUsername(username: string) {
    const user = await this.userModel.findOne({ username }).exec();
    if (!user) {
      throw new NotFoundException(`User ${username} not found`);
    }
    return user;
  }

  async loginUser(loginUserInput: LoginUserInput) {
    const user = await this.authService.validateUser(
      loginUserInput.username,
      loginUserInput.password,
    );
    if (!user) {
      throw new BadRequestException(`Username or password are invalid`);
    } else {
      return this.authService.generateUserCredentials(user);
    }
  }
}
