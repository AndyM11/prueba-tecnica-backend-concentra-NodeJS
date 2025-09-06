import { ClientType } from "./Types";

export { ClientType };

export class Client {
  constructor(
    public id: number,
    public name: string,
    public phone: string,
    public clientType: ClientType,
  ) {}
}
