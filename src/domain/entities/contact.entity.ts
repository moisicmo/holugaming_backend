
export class ContactEntity {
  constructor(
    public typeContact: number,
    public data: string,

  ) { }

  static fromObject(object: { [key: string]: any; }) {
    const { typeContact, data } = object;
    return new ContactEntity(typeContact, data);
  }
}
