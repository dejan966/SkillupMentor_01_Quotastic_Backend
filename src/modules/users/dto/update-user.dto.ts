import { IsEmail, IsOptional, Matches, ValidateIf } from 'class-validator';
import { Match } from 'src/decorators/match.decorator';

export class UpdateUserDto {
  @IsOptional()
  first_name?: string;

  @IsOptional()
  last_name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  refresh_token?: string;

  @IsOptional()
  avatar?: string;

  @ValidateIf((o) => typeof o.password === 'string' && o.password.length > 0)
  @IsOptional()
  @Matches(/^(?=.*\d)[A-Za-z.\s_-]+[\w~@#$%^&+=`|{}:;!.?"()[\]-]{6,}/, {
    message: 'Password must have atleast one number, lower or upper case letter and it has to be longer than five characters',
  })
  password?: string;

  @ValidateIf((o) => typeof o.confirm_password === 'string' && o.confirm_password.length > 0)
  @IsOptional()
  @Match(UpdateUserDto, (field) => field.password, { message: 'Passwords do not match' })
  confirm_password?: string;
}
