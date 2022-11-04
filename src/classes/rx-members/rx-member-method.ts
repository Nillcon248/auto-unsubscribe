import { Descriptor, RxEntity, TargetClass } from '@src/interfaces';
import { RxEntityFactory } from '../rx-entities';
import { RxClassMemberBase } from './rx-class-member-base';

export class RxClassMethod extends RxClassMemberBase {
    public check(descriptor: Descriptor): boolean {
        return !!descriptor?.value;
    }

    public define(targetClass: TargetClass, _key: string, descriptor: Descriptor): void {
        const originalMethod = descriptor?.value;

        descriptor.value = function (...args: unknown[]): RxEntity {
            const result = originalMethod.apply(this, args);

            const entity = RxEntityFactory.getInstance(result);

            entity.process(this, targetClass, result);

            return result;
        };
    }
}
