import type { Subscription } from "rxjs";

export interface TargetClass {
	ɵUnsubscriptionHasInitialized: boolean;
	ɵSubscriptions: WeakMap<Object, Subscription[]>;
	ngOnDestroy?: () => unknown;
}