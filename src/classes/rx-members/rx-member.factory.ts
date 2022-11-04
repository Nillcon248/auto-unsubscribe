import { Descriptor } from '@src/interfaces';
import { RxClassMemberBase } from './rx-class-member-base';
import { RxClassMethod } from './rx-member-method';
import { RxClassProperty } from './rx-member-property';

const RxClassMemberArray: RxClassMemberBase[] = [new RxClassProperty(), new RxClassMethod()];

export class RxClassMemberFactory {
    public static getInstance(descriptor: Descriptor): RxClassMemberBase {
        const member = RxClassMemberArray.find((member) => member.check(descriptor));

        return member;
    }
}
