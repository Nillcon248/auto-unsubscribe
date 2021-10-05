## Angular - Auto unsubscribe decorator 🐍

# Installation

`npm install ngx-auto-unsubscribe --save`

## Idea

This library has created for removing
useless code with manually unsubsribes,
for this one was create decorator that work
with all types of subscriptions, you can wrap
observable parameter, method that return observable or
method that return subscription and don't think
about memory leak.

## Examples

### Work with parameters

```js
	export class UserComponent implements OnInit {
		@AutoUnsubscribe() // <-- Should be on the target parameter
		private userData$ = new BehaviorSubject(<-Some data->);

		public ngOnInit(): void {
			// After ngOnDestroy this subscription will unsubscribe
			this.userData$.subscribe();

			// Also you can override your parameter, and it
			// will unsubscribe too
			this.userData$ = new Subject();
			this.userData$.subscribe();
		}
	}
```

### Work with method with observable

```js
	export class UserComponent implements OnInit {

		public ngOnInit(): void {
			this.getUserData$.subscribe();
		}

		@AutoUnsubscribe()
		public getUserData$(): BehaviorSubject {
			return new BehaviorSubject(<-Some data->);
		}
	}

```

### Work with method with subscription

```js
	export class UserComponent implements OnInit {

		public ngOnInit(): void {
			this.initUserDataSubscription();
		}

		@AutoUnsubscribe()
		public initUserDataSubscription(): BehaviorSubject {
			return new BehaviorSubject(<-Some data->).subscribe();
		}
	}

```
