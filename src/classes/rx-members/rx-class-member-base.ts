import { Descriptor, InnerInstance, TargetClass } from '@src/interfaces';

export abstract class RxClassMemberBase {
    public abstract check(descriptor: Descriptor): boolean;

    public abstract define(targetClass: TargetClass, key: string, descriptor: Descriptor): void;
}
