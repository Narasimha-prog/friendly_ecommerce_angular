import { InjectionToken } from '@angular/core';

export const WINDOW = new InjectionToken<Window>('Window');
export const DOCUMENT = new InjectionToken<Document>('Document');
export const NAVIGATOR = new InjectionToken<Navigator>('Navigator');
export const LOCATION = new InjectionToken<Location>('Location');
export const PERFORMANCE = new InjectionToken<Performance>('Performance');
export const MUTATION_OBSERVER = new InjectionToken<typeof MutationObserver>('MutationObserver');
