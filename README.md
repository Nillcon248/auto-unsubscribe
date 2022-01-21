## Angular - Auto unsubscribe decorator 🦄

[![npm](https://img.shields.io/npm/dt/ngx-auto-unsubscribe-decorator.svg)]()
[![npm](https://img.shields.io/npm/l/ngx-auto-unsubscribe-decorator.svg)]()
[![Build status](https://travis-ci.org/Nillcon248/ngx-base-state.svg?branch=master)](https://travis-ci.org/Nillcon248/ngx-auto-unsubscribe.svg?branch=master)

# Installation

`npm i ngx-auto-unsubscribe-decorator`

## Idea 💡

This library has been created for removing
useless code with manually unsubscribes,
for this one was created decorator that works
with all types of subscriptions, you can wrap
observable parameter, a method that returns observable or
a method that returns subscription and doesn't think
about memory leak.

## Examples 🧪

### Work with parameters

```js
export class UserComponent implements OnInit {
  @AutoUnsubscribe() // <-- Should be on the target parameter
  private userData$ = new BehaviorSubject(/* Some data */);

  public ngOnInit(): void {
    // After ngOnDestroy this subscription will unsubscribe
    this.userData$.subscribe();

    // You can override parameter, it will unsubscribe too
    this.userData$ = new Subject();
    this.userData$.subscribe();
  }
}
```

### Work with methods

```js
export class UserComponent implements OnInit {

  public ngOnInit(): void {
    this.getUserData$().subscribe();

    this.initUserDataSubscription();
  }

  @AutoUnsubscribe() // <-- Should be on the target method
  public getUserData$(): BehaviorSubject {
    return new BehaviorSubject(/* Some data */);
  }

  @AutoUnsubscribe() // <-- Should be on the target method
  public initUserDataSubscription(): BehaviorSubject {
    return new BehaviorSubject(/* Some data */).subscribe();
  }
}

```

## Demo

See the [Demo App](https://stackblitz.com/edit/angular-ivy-ujz6vk?devtoolsheight=33&file=src/app/autounsubscribe/autounsubscribe.component.ts) on Stackblitz
