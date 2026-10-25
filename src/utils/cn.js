/** Join class names, ignoring falsy values. */
export const cn = (...classes) => classes.filter(Boolean).join(' ');
