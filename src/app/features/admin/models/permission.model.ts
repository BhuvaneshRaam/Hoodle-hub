export interface Permission {
  id: number;
  module: {
    id: number;
    name: string;
  };
  privilege: {
    id: number;
    name: string;
  };
}