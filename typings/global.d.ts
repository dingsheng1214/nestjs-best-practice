//* * 全局类型,不需要引入 */
/**
 * 类转义为普通对象后的类型
 */
declare type ClassToPlain<T> = { [key in keyof T]: T[key] };
