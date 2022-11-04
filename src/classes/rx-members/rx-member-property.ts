import { Descriptor, RxEntity, TargetClass } from '@src/interfaces';
import { RxEntityFactory } from '../rx-entities';
import { RxClassMemberBase } from './rx-class-member-base';

export class RxClassProperty extends RxClassMemberBase {
    public check(descriptor: Descriptor): boolean {
        return !descriptor;
    }

    public define(targetClass: TargetClass, key: string, _descriptor: Descriptor): void {
        const newDescriptor = this.getDescriptor(targetClass);

        Object.defineProperty(targetClass, key, newDescriptor);
    }

    private getDescriptor(targetClass: TargetClass): Descriptor {
        let value: RxEntity;

        const descriptor: Descriptor = {
            get: function (): RxEntity {
                return value;
            },
            set: function (newValue: RxEntity): void {
                const entity = RxEntityFactory.getInstance(newValue);

                entity.process(this, targetClass, newValue);

                value = newValue;
            },
            enumerable: true,
            configurable: true,
        };

        return descriptor;
    }
}
