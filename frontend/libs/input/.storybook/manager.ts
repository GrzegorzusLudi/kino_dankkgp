const POPOVER_PROVIDER_ARIA_WARNING =
  "The 'ariaLabel' prop on 'PopoverProvider' will become mandatory in Storybook 11.";

const originalWarn = console.warn.bind(console);

console.warn = (...args: unknown[]): void => {
  const [firstArg] = args;

  if (
    typeof firstArg === 'string' &&
    firstArg.includes(POPOVER_PROVIDER_ARIA_WARNING)
  ) {
    return;
  }

  originalWarn(...args);
};
