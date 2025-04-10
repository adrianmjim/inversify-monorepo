// Is-inversify-import-example
import { Container } from 'inversify7';

interface Weapon {
  damage: number;
}

export class Katana implements Weapon {
  public readonly damage: number = 10;
}

// Begin-example
const container: Container = new Container();
container.bind<Weapon>('Weapon').toDynamicValue((): Weapon => new Katana());

const katana: Weapon = container.get<Weapon>('Weapon');
// End-example

export { katana };
