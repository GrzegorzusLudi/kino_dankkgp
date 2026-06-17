<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

# General Guidelines for working with Nx

- For navigating/exploring the workspace, invoke the `nx-workspace` skill first - it has patterns for querying projects, targets, and dependencies
- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- Prefix nx commands with the workspace's package manager (e.g., `npm nx build`, `npm exec nx test`) - avoids using globally installed CLI
- You have access to the Nx MCP server and its tools, use them to help the user
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this file - proceed without it if unavailable.
- NEVER guess CLI flags - always check nx_docs or `--help` first when unsure

## Scaffolding & Generators

- For scaffolding tasks (creating apps, libs, project structure, setup), ALWAYS invoke the `nx-generate` skill FIRST before exploring or calling MCP tools

## When to use nx_docs

- USE for: advanced config options, unfamiliar flags, migration guides, plugin configuration, edge cases
- DON'T USE for: basic generator syntax (`nx g @nx/react:app`), standard commands, things you already know
- The `nx-generate` skill handles generator discovery internally - don't call nx_docs just to look up generator syntax

<!-- nx configuration end-->

# Unit Test Guidelines

## Stack & setup

- Test runner is **Vitest** via `@nx/vitest:test`, with `@analogjs/vite-plugin-angular` for Angular compilation.
- Vitest is configured with `globals: true`, so `describe`, `it`, `expect`, `beforeEach`, and `vi` are available without imports — do NOT import them.
- DOM-touching projects use `environment: 'jsdom'`; pure logic libs (e.g. `utils`) use `environment: 'node'`.
- Every project has `src/test-setup.ts` referenced in `vite.config.mts` via `setupFiles`. Angular projects call `setupTestBed({ zoneless: true })` from `@analogjs/vitest-angular/setup-testbed` — never modify this.
- Spec files live next to their source as `*.spec.ts` (e.g. `button.component.ts` → `button.component.spec.ts`).

## Running tests forbidden

- Do NOT run tests!

## Component spec structure

Follow the established pattern (see `libs/button/src/lib/button.component.spec.ts` for the canonical example):

1. Top-level `describe('ComponentName', () => { ... })`.
2. Typed locals at the top: `let component: ComponentName;`, `let fixture: ComponentFixture<ComponentName>;`, plus any DOM-element references (`let button: HTMLButtonElement;`).
3. `beforeEach(async () => { ... })` that:
   - Calls `await TestBed.configureTestingModule({ imports: [Component], providers: [provideZonelessChangeDetection(), ...] }).compileComponents();`
   - Creates the fixture, assigns `component`, sets any **required inputs** via `fixture.componentRef.setInput('name', value)` **before** the first `fixture.detectChanges()`.
   - Calls `fixture.detectChanges()` once.
   - Captures DOM-element references with `fixture.nativeElement.querySelector(...)` after the first change-detection cycle.
4. Group related assertions in nested `describe` blocks per feature area.

## Nested `describe` blocks

Group related assertions in nested `describe` blocks per feature area — observed names include:

- `structure`
- `default inputs`
- `[input name]`
- `content projection`
- `reactive forms`
- `user interactions`

## Inputs, DOM, and interactions

- Set signal inputs with `fixture.componentRef.setInput('name', value)` followed by `fixture.detectChanges()` — do not assign to the input directly.
- Trigger DOM events with native APIs: `element.click()`, `element.dispatchEvent(new Event('change' | 'blur'))`. Follow each with `fixture.detectChanges()`.
- Assert class bindings with `expect(element.classList).toContain('foo')` / `.not.toContain('foo')`.
- Assert attribute/property reflection via the native property (`input.placeholder`, `input.disabled`, `input.checked`, etc.).

## Content projection

Test `ng-content` via a dedicated host component declared in the same file:

```ts
@Component({
  template: '<lib-header>Projected Text</lib-header>',
  imports: [HeaderComponent],
})
class HostComponent {}
```

Include it in the `TestBed` `imports`, then create a separate fixture inside a nested `describe('content projection', ...)` block and assert on its DOM.

## Mocks & injection tokens

- Override injection tokens through `providers`: `{ provide: SOCKET, useValue: mockSocket }`.
- Build inline mocks in `beforeEach` using `vi.fn()` for methods (e.g. `const mockSocket = { emit: vi.fn(), on: vi.fn() };`).
- For `ControlValueAccessor` callbacks, register a `vi.fn()` spy via `registerOnChange` / `registerOnTouched`, dispatch the relevant event, then assert with `toHaveBeenCalledWith(...)`.

## Scope & conventions

- Do NOT add new spec files unless the user explicitly asks — extend the existing co-located `*.spec.ts` instead.
- Match the style of neighbouring specs (import order, blank lines, quoting). Avoid adding rationale comments inside tests.
- Keep assertions focused: one behavioural expectation per `it`, with descriptive `should ...` names.
