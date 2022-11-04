import { RxEntity } from './rx-entity';

export interface Descriptor {
    get: () => unknown;
    set: (value: RxEntity) => void;
    value?: (...args: unknown[]) => RxEntity;
    enumerable: boolean;
    configurable: boolean;
}
