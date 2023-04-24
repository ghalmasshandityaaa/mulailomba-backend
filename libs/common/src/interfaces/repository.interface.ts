export interface IRepository {
  name: string;
}

interface IConstraint {
  name: string;
  isUnique: boolean;
  isForeign: boolean;
}

interface UniqueConstraint extends IConstraint {
  isUnique: true;
}

interface ForeignKeyConstraint extends IConstraint {
  isForeign: true;
}

export type Constraint = UniqueConstraint | ForeignKeyConstraint;
