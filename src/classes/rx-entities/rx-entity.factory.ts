import { RxEntity } from '@src/interfaces';
import { RxEntityBase } from './rx-entity-base';
import { RxEntityObservable } from './rx-entity-observable';
import { RxEntitySubscription } from './rx-entity-subscription';

const RxClassMemberArray: RxEntityBase[] = [new RxEntityObservable(), new RxEntitySubscription()];

export class RxEntityFactory {
    public static getInstance(variable: RxEntity): RxEntityBase {
        const entity = RxClassMemberArray.find((entity) => entity.check(variable));

        return entity;
    }
}
