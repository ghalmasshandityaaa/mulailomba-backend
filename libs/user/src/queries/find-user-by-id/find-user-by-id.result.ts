import { JsonUserProps, UserQueryModel } from '@mulailomba/user/interfaces';
import { JsonUserSerializer } from '@mulailomba/user/serializers';
import { IQueryResult } from '@nestjs/cqrs';

export class FindUserByIdResult implements IQueryResult {
  public readonly user: JsonUserProps;

  constructor(user: UserQueryModel) {
    this.user = JsonUserSerializer.serialize(user);
  }
}
