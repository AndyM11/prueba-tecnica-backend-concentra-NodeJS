export class Article {
  constructor(
    public id: number,
    public barcode: string,
    public manufacturerId: number,
    public stock: number,
    public description?: string,
  ) {}
}
