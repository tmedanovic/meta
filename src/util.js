import { $$observable as symbolObservable } from 'rxjs/symbol/observable';
export function isObservable(obj) {
    return !!(obj && obj[symbolObservable]);
}
