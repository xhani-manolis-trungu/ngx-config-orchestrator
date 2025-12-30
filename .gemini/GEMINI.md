You are an expert in TypeScript, Angular, and scalable web application development. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default in Angular v20+.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Accessibility Requirements

- It MUST pass all AXE checks.
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes.

### Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead
- When using external templates/styles, use paths relative to the component TS file.

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not assume globals like (`new Date()`) are available.
- Do not write arrow functions in templates (they are not supported).

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection

# Testing

## Practices

- Follow the Arrange-Act-Assert (AAA) pattern for all unit tests.
- Prioritize testing user behavior (what the user sees/clicks) over implementation details (internal method calls).
- Isolate the unit under test; mock all external dependencies (Services, HTTP, Router).
- Use fakeAsync and tick() to handle asynchronous operations and timers deterministically.
- Do NOT use inject() inside it blocks; resolve dependencies in beforeEach or using TestBed.inject() variables.

## Angular-Specific Patterns

- Signals: Explicitly trigger change detection (fixture.detectChanges()) to flush Signal updates to the DOM.
- Inputs: Use fixture.componentRef.setInput('propName', value) to test Signal inputs (input()).
- HTTP: Use provideHttpClientTesting() and HttpTestingController to mock and assert network requests.
- Harnesses: Use Angular Component Harnesses to interact with child components (especially Material/UI libraries) to avoid brittle DOM queries.
- DOM Querying: Avoid nativeElement.querySelector. Use By.css or Testing Library queries.

## Packages

- @testing-library/angular: Preferred over native TestBed queries. It enforces accessibility best practices by querying elements by role, text, or label (e.g., screen.getByRole('button')).
- jasmine-marbles: Use for testing complex RxJS observable streams if simple async/await is insufficient.
