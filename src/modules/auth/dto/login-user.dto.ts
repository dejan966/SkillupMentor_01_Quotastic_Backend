import { IsEmail, IsNotEmpty, Matches } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Matches(/^(?=.*\d)[A-Za-z.\s_-]+[\w~@#$%^&+=`|{}:;!.?"()[\]-]{6,}/, {
    message: 'Password must have atleast one number, lower or upper case letter and it has to be longer than five characters',
  })
  password: string;
}
