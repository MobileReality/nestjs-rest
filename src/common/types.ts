export type Nullable<T> = null | T;

export type PartiallyRequired<T, K extends keyof T> = Partial<T> & Pick<T, K>;
