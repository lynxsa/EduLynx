
/**
 * Client
**/

import * as runtime from './runtime/library';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions

export type PrismaPromise<T> = $Public.PrismaPromise<T>


export type CurriculumSubjectPayload<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
  name: "CurriculumSubject"
  objects: {
    topics: TopicPayload<ExtArgs>[]
  }
  scalars: $Extensions.GetResult<{
    id: number
    name: string
    grade: number
    description: string | null
    imageUrl: string | null
    createdAt: Date
    updatedAt: Date
  }, ExtArgs["result"]["curriculumSubject"]>
  composites: {}
}

/**
 * Model CurriculumSubject
 * 
 */
export type CurriculumSubject = runtime.Types.DefaultSelection<CurriculumSubjectPayload>
export type TopicPayload<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
  name: "Topic"
  objects: {
    subject: CurriculumSubjectPayload<ExtArgs>
    lessons: LessonPayload<ExtArgs>[]
  }
  scalars: $Extensions.GetResult<{
    id: number
    title: string
    description: string | null
    subjectId: number
    orderIndex: number
  }, ExtArgs["result"]["topic"]>
  composites: {}
}

/**
 * Model Topic
 * 
 */
export type Topic = runtime.Types.DefaultSelection<TopicPayload>
export type LessonPayload<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
  name: "Lesson"
  objects: {
    topic: TopicPayload<ExtArgs>
  }
  scalars: $Extensions.GetResult<{
    id: number
    title: string
    content: string
    videoUrl: string | null
    duration: number | null
    difficulty: string | null
    topicId: number
  }, ExtArgs["result"]["lesson"]>
  composites: {}
}

/**
 * Model Lesson
 * 
 */
export type Lesson = runtime.Types.DefaultSelection<LessonPayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more CurriculumSubjects
 * const curriculumSubjects = await prisma.curriculumSubject.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  T extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof T ? T['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<T['log']> : never : never,
  GlobalReject extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined = 'rejectOnNotFound' extends keyof T
    ? T['rejectOnNotFound']
    : false,
  ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more CurriculumSubjects
   * const curriculumSubjects = await prisma.curriculumSubject.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<T, Prisma.PrismaClientOptions>);
  $on<V extends (U | 'beforeExit')>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : V extends 'beforeExit' ? () => Promise<void> : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): Promise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): Promise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): Promise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => Promise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): Promise<R>


  $extends: $Extensions.ExtendsHook<'extends', Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.curriculumSubject`: Exposes CRUD operations for the **CurriculumSubject** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CurriculumSubjects
    * const curriculumSubjects = await prisma.curriculumSubject.findMany()
    * ```
    */
  get curriculumSubject(): Prisma.CurriculumSubjectDelegate<GlobalReject, ExtArgs>;

  /**
   * `prisma.topic`: Exposes CRUD operations for the **Topic** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Topics
    * const topics = await prisma.topic.findMany()
    * ```
    */
  get topic(): Prisma.TopicDelegate<GlobalReject, ExtArgs>;

  /**
   * `prisma.lesson`: Exposes CRUD operations for the **Lesson** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Lessons
    * const lessons = await prisma.lesson.findMany()
    * ```
    */
  get lesson(): Prisma.LessonDelegate<GlobalReject, ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql

  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export type Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export type Args<T, F extends $Public.Operation> = $Public.Args<T, F>
  export type Payload<T, F extends $Public.Operation> = $Public.Payload<T, F>
  export type Result<T, A, F extends $Public.Operation> = $Public.Result<T, A, F>
  export type Exact<T, W> = $Public.Exact<T, W>

  /**
   * Prisma Client JS version: 4.16.2
   * Query Engine version: 4bc8b6e1b66cb932731fb1bdbbc550d1e010de81
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON object.
   * This type can be useful to enforce some input to be JSON-compatible or as a super-type to be extended from. 
   */
  export type JsonObject = {[Key in string]?: JsonValue}

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON array.
   */
  export interface JsonArray extends Array<JsonValue> {}

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches any valid JSON value.
   */
  export type JsonValue = string | number | boolean | JsonObject | JsonArray | null

  /**
   * Matches a JSON object.
   * Unlike `JsonObject`, this type allows undefined and read-only properties.
   */
  export type InputJsonObject = {readonly [Key in string]?: InputJsonValue | null}

  /**
   * Matches a JSON array.
   * Unlike `JsonArray`, readonly arrays are assignable to this type.
   */
  export interface InputJsonArray extends ReadonlyArray<InputJsonValue | null> {}

  /**
   * Matches any valid value that can be used as an input for operations like
   * create and update as the value of a JSON field. Unlike `JsonValue`, this
   * type allows read-only arrays and read-only object properties and disallows
   * `null` at the top level.
   *
   * `null` cannot be used as the value of a JSON field because its meaning
   * would be ambiguous. Use `Prisma.JsonNull` to store the JSON null value or
   * `Prisma.DbNull` to clear the JSON value and set the field to the database
   * NULL value instead.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-by-null-values
   */
  export type InputJsonValue = string | number | boolean | InputJsonObject | InputJsonArray

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }
  type HasSelect = {
    select: any
  }
  type HasInclude = {
    include: any
  }
  type CheckSelect<T, S, U> = T extends SelectAndInclude
    ? 'Please either choose `select` or `include`'
    : T extends HasSelect
    ? U
    : T extends HasInclude
    ? U
    : S

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => Promise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but with an array
   */
  type PickArray<T, K extends Array<keyof T>> = Prisma__Pick<T, TupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    CurriculumSubject: 'CurriculumSubject',
    Topic: 'Topic',
    Lesson: 'Lesson'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }


  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.Args}, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs']>
  }

  export type TypeMap<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    meta: {
      modelProps: 'curriculumSubject' | 'topic' | 'lesson'
      txIsolationLevel: Prisma.TransactionIsolationLevel
    },
    model: {
      CurriculumSubject: {
        payload: CurriculumSubjectPayload<ExtArgs>
        operations: {
          findUnique: {
            args: Prisma.CurriculumSubjectFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<CurriculumSubjectPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CurriculumSubjectFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<CurriculumSubjectPayload>
          }
          findFirst: {
            args: Prisma.CurriculumSubjectFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<CurriculumSubjectPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CurriculumSubjectFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<CurriculumSubjectPayload>
          }
          findMany: {
            args: Prisma.CurriculumSubjectFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<CurriculumSubjectPayload>[]
          }
          create: {
            args: Prisma.CurriculumSubjectCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<CurriculumSubjectPayload>
          }
          createMany: {
            args: Prisma.CurriculumSubjectCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.CurriculumSubjectDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<CurriculumSubjectPayload>
          }
          update: {
            args: Prisma.CurriculumSubjectUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<CurriculumSubjectPayload>
          }
          deleteMany: {
            args: Prisma.CurriculumSubjectDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.CurriculumSubjectUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.CurriculumSubjectUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<CurriculumSubjectPayload>
          }
          aggregate: {
            args: Prisma.CurriculumSubjectAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateCurriculumSubject>
          }
          groupBy: {
            args: Prisma.CurriculumSubjectGroupByArgs<ExtArgs>,
            result: $Utils.Optional<CurriculumSubjectGroupByOutputType>[]
          }
          count: {
            args: Prisma.CurriculumSubjectCountArgs<ExtArgs>,
            result: $Utils.Optional<CurriculumSubjectCountAggregateOutputType> | number
          }
        }
      }
      Topic: {
        payload: TopicPayload<ExtArgs>
        operations: {
          findUnique: {
            args: Prisma.TopicFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<TopicPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TopicFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<TopicPayload>
          }
          findFirst: {
            args: Prisma.TopicFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<TopicPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TopicFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<TopicPayload>
          }
          findMany: {
            args: Prisma.TopicFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<TopicPayload>[]
          }
          create: {
            args: Prisma.TopicCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<TopicPayload>
          }
          createMany: {
            args: Prisma.TopicCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.TopicDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<TopicPayload>
          }
          update: {
            args: Prisma.TopicUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<TopicPayload>
          }
          deleteMany: {
            args: Prisma.TopicDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.TopicUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.TopicUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<TopicPayload>
          }
          aggregate: {
            args: Prisma.TopicAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateTopic>
          }
          groupBy: {
            args: Prisma.TopicGroupByArgs<ExtArgs>,
            result: $Utils.Optional<TopicGroupByOutputType>[]
          }
          count: {
            args: Prisma.TopicCountArgs<ExtArgs>,
            result: $Utils.Optional<TopicCountAggregateOutputType> | number
          }
        }
      }
      Lesson: {
        payload: LessonPayload<ExtArgs>
        operations: {
          findUnique: {
            args: Prisma.LessonFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<LessonPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LessonFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<LessonPayload>
          }
          findFirst: {
            args: Prisma.LessonFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<LessonPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LessonFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<LessonPayload>
          }
          findMany: {
            args: Prisma.LessonFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<LessonPayload>[]
          }
          create: {
            args: Prisma.LessonCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<LessonPayload>
          }
          createMany: {
            args: Prisma.LessonCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.LessonDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<LessonPayload>
          }
          update: {
            args: Prisma.LessonUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<LessonPayload>
          }
          deleteMany: {
            args: Prisma.LessonDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.LessonUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.LessonUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<LessonPayload>
          }
          aggregate: {
            args: Prisma.LessonAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateLesson>
          }
          groupBy: {
            args: Prisma.LessonGroupByArgs<ExtArgs>,
            result: $Utils.Optional<LessonGroupByOutputType>[]
          }
          count: {
            args: Prisma.LessonCountArgs<ExtArgs>,
            result: $Utils.Optional<LessonCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<'define', Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type RejectOnNotFound = boolean | ((error: Error) => Error)
  export type RejectPerModel = { [P in ModelName]?: RejectOnNotFound }
  export type RejectPerOperation =  { [P in "findUnique" | "findFirst"]?: RejectPerModel | RejectOnNotFound } 
  type IsReject<T> = T extends true ? True : T extends (err: Error) => Error ? True : False
  export type HasReject<
    GlobalRejectSettings extends Prisma.PrismaClientOptions['rejectOnNotFound'],
    LocalRejectSettings,
    Action extends PrismaAction,
    Model extends ModelName
  > = LocalRejectSettings extends RejectOnNotFound
    ? IsReject<LocalRejectSettings>
    : GlobalRejectSettings extends RejectPerOperation
    ? Action extends keyof GlobalRejectSettings
      ? GlobalRejectSettings[Action] extends RejectOnNotFound
        ? IsReject<GlobalRejectSettings[Action]>
        : GlobalRejectSettings[Action] extends RejectPerModel
        ? Model extends keyof GlobalRejectSettings[Action]
          ? IsReject<GlobalRejectSettings[Action][Model]>
          : False
        : False
      : False
    : IsReject<GlobalRejectSettings>
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'

  export interface PrismaClientOptions {
    /**
     * Configure findUnique/findFirst to throw an error if the query returns null. 
     * @deprecated since 4.0.0. Use `findUniqueOrThrow`/`findFirstOrThrow` methods instead.
     * @example
     * ```
     * // Reject on both findUnique/findFirst
     * rejectOnNotFound: true
     * // Reject only on findFirst with a custom error
     * rejectOnNotFound: { findFirst: (err) => new Error("Custom Error")}
     * // Reject on user.findUnique with a custom error
     * rejectOnNotFound: { findUnique: {User: (err) => new Error("User not found")}}
     * ```
     */
    rejectOnNotFound?: RejectOnNotFound | RejectPerOperation
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources

    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat

    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: Array<LogLevel | LogDefinition>
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findMany'
    | 'findFirst'
    | 'create'
    | 'createMany'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => Promise<T>,
  ) => Promise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type CurriculumSubjectCountOutputType
   */


  export type CurriculumSubjectCountOutputType = {
    topics: number
  }

  export type CurriculumSubjectCountOutputTypeSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    topics?: boolean | CurriculumSubjectCountOutputTypeCountTopicsArgs
  }

  // Custom InputTypes

  /**
   * CurriculumSubjectCountOutputType without action
   */
  export type CurriculumSubjectCountOutputTypeArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CurriculumSubjectCountOutputType
     */
    select?: CurriculumSubjectCountOutputTypeSelect<ExtArgs> | null
  }


  /**
   * CurriculumSubjectCountOutputType without action
   */
  export type CurriculumSubjectCountOutputTypeCountTopicsArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: TopicWhereInput
  }



  /**
   * Count Type TopicCountOutputType
   */


  export type TopicCountOutputType = {
    lessons: number
  }

  export type TopicCountOutputTypeSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    lessons?: boolean | TopicCountOutputTypeCountLessonsArgs
  }

  // Custom InputTypes

  /**
   * TopicCountOutputType without action
   */
  export type TopicCountOutputTypeArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TopicCountOutputType
     */
    select?: TopicCountOutputTypeSelect<ExtArgs> | null
  }


  /**
   * TopicCountOutputType without action
   */
  export type TopicCountOutputTypeCountLessonsArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: LessonWhereInput
  }



  /**
   * Models
   */

  /**
   * Model CurriculumSubject
   */


  export type AggregateCurriculumSubject = {
    _count: CurriculumSubjectCountAggregateOutputType | null
    _avg: CurriculumSubjectAvgAggregateOutputType | null
    _sum: CurriculumSubjectSumAggregateOutputType | null
    _min: CurriculumSubjectMinAggregateOutputType | null
    _max: CurriculumSubjectMaxAggregateOutputType | null
  }

  export type CurriculumSubjectAvgAggregateOutputType = {
    id: number | null
    grade: number | null
  }

  export type CurriculumSubjectSumAggregateOutputType = {
    id: number | null
    grade: number | null
  }

  export type CurriculumSubjectMinAggregateOutputType = {
    id: number | null
    name: string | null
    grade: number | null
    description: string | null
    imageUrl: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CurriculumSubjectMaxAggregateOutputType = {
    id: number | null
    name: string | null
    grade: number | null
    description: string | null
    imageUrl: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CurriculumSubjectCountAggregateOutputType = {
    id: number
    name: number
    grade: number
    description: number
    imageUrl: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CurriculumSubjectAvgAggregateInputType = {
    id?: true
    grade?: true
  }

  export type CurriculumSubjectSumAggregateInputType = {
    id?: true
    grade?: true
  }

  export type CurriculumSubjectMinAggregateInputType = {
    id?: true
    name?: true
    grade?: true
    description?: true
    imageUrl?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CurriculumSubjectMaxAggregateInputType = {
    id?: true
    name?: true
    grade?: true
    description?: true
    imageUrl?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CurriculumSubjectCountAggregateInputType = {
    id?: true
    name?: true
    grade?: true
    description?: true
    imageUrl?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CurriculumSubjectAggregateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which CurriculumSubject to aggregate.
     */
    where?: CurriculumSubjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CurriculumSubjects to fetch.
     */
    orderBy?: Enumerable<CurriculumSubjectOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CurriculumSubjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CurriculumSubjects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CurriculumSubjects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CurriculumSubjects
    **/
    _count?: true | CurriculumSubjectCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CurriculumSubjectAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CurriculumSubjectSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CurriculumSubjectMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CurriculumSubjectMaxAggregateInputType
  }

  export type GetCurriculumSubjectAggregateType<T extends CurriculumSubjectAggregateArgs> = {
        [P in keyof T & keyof AggregateCurriculumSubject]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCurriculumSubject[P]>
      : GetScalarType<T[P], AggregateCurriculumSubject[P]>
  }




  export type CurriculumSubjectGroupByArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: CurriculumSubjectWhereInput
    orderBy?: Enumerable<CurriculumSubjectOrderByWithAggregationInput>
    by: CurriculumSubjectScalarFieldEnum[]
    having?: CurriculumSubjectScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CurriculumSubjectCountAggregateInputType | true
    _avg?: CurriculumSubjectAvgAggregateInputType
    _sum?: CurriculumSubjectSumAggregateInputType
    _min?: CurriculumSubjectMinAggregateInputType
    _max?: CurriculumSubjectMaxAggregateInputType
  }


  export type CurriculumSubjectGroupByOutputType = {
    id: number
    name: string
    grade: number
    description: string | null
    imageUrl: string | null
    createdAt: Date
    updatedAt: Date
    _count: CurriculumSubjectCountAggregateOutputType | null
    _avg: CurriculumSubjectAvgAggregateOutputType | null
    _sum: CurriculumSubjectSumAggregateOutputType | null
    _min: CurriculumSubjectMinAggregateOutputType | null
    _max: CurriculumSubjectMaxAggregateOutputType | null
  }

  type GetCurriculumSubjectGroupByPayload<T extends CurriculumSubjectGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickArray<CurriculumSubjectGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CurriculumSubjectGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CurriculumSubjectGroupByOutputType[P]>
            : GetScalarType<T[P], CurriculumSubjectGroupByOutputType[P]>
        }
      >
    >


  export type CurriculumSubjectSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    grade?: boolean
    description?: boolean
    imageUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    topics?: boolean | CurriculumSubject$topicsArgs<ExtArgs>
    _count?: boolean | CurriculumSubjectCountOutputTypeArgs<ExtArgs>
  }, ExtArgs["result"]["curriculumSubject"]>

  export type CurriculumSubjectSelectScalar = {
    id?: boolean
    name?: boolean
    grade?: boolean
    description?: boolean
    imageUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type CurriculumSubjectInclude<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    topics?: boolean | CurriculumSubject$topicsArgs<ExtArgs>
    _count?: boolean | CurriculumSubjectCountOutputTypeArgs<ExtArgs>
  }


  type CurriculumSubjectGetPayload<S extends boolean | null | undefined | CurriculumSubjectArgs> = $Types.GetResult<CurriculumSubjectPayload, S>

  type CurriculumSubjectCountArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = 
    Omit<CurriculumSubjectFindManyArgs, 'select' | 'include'> & {
      select?: CurriculumSubjectCountAggregateInputType | true
    }

  export interface CurriculumSubjectDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CurriculumSubject'], meta: { name: 'CurriculumSubject' } }
    /**
     * Find zero or one CurriculumSubject that matches the filter.
     * @param {CurriculumSubjectFindUniqueArgs} args - Arguments to find a CurriculumSubject
     * @example
     * // Get one CurriculumSubject
     * const curriculumSubject = await prisma.curriculumSubject.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends CurriculumSubjectFindUniqueArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, CurriculumSubjectFindUniqueArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'CurriculumSubject'> extends True ? Prisma__CurriculumSubjectClient<$Types.GetResult<CurriculumSubjectPayload<ExtArgs>, T, 'findUnique', never>, never, ExtArgs> : Prisma__CurriculumSubjectClient<$Types.GetResult<CurriculumSubjectPayload<ExtArgs>, T, 'findUnique', never> | null, null, ExtArgs>

    /**
     * Find one CurriculumSubject that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {CurriculumSubjectFindUniqueOrThrowArgs} args - Arguments to find a CurriculumSubject
     * @example
     * // Get one CurriculumSubject
     * const curriculumSubject = await prisma.curriculumSubject.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends CurriculumSubjectFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, CurriculumSubjectFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__CurriculumSubjectClient<$Types.GetResult<CurriculumSubjectPayload<ExtArgs>, T, 'findUniqueOrThrow', never>, never, ExtArgs>

    /**
     * Find the first CurriculumSubject that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CurriculumSubjectFindFirstArgs} args - Arguments to find a CurriculumSubject
     * @example
     * // Get one CurriculumSubject
     * const curriculumSubject = await prisma.curriculumSubject.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends CurriculumSubjectFindFirstArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, CurriculumSubjectFindFirstArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'CurriculumSubject'> extends True ? Prisma__CurriculumSubjectClient<$Types.GetResult<CurriculumSubjectPayload<ExtArgs>, T, 'findFirst', never>, never, ExtArgs> : Prisma__CurriculumSubjectClient<$Types.GetResult<CurriculumSubjectPayload<ExtArgs>, T, 'findFirst', never> | null, null, ExtArgs>

    /**
     * Find the first CurriculumSubject that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CurriculumSubjectFindFirstOrThrowArgs} args - Arguments to find a CurriculumSubject
     * @example
     * // Get one CurriculumSubject
     * const curriculumSubject = await prisma.curriculumSubject.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends CurriculumSubjectFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, CurriculumSubjectFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__CurriculumSubjectClient<$Types.GetResult<CurriculumSubjectPayload<ExtArgs>, T, 'findFirstOrThrow', never>, never, ExtArgs>

    /**
     * Find zero or more CurriculumSubjects that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CurriculumSubjectFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CurriculumSubjects
     * const curriculumSubjects = await prisma.curriculumSubject.findMany()
     * 
     * // Get first 10 CurriculumSubjects
     * const curriculumSubjects = await prisma.curriculumSubject.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const curriculumSubjectWithIdOnly = await prisma.curriculumSubject.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends CurriculumSubjectFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, CurriculumSubjectFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Types.GetResult<CurriculumSubjectPayload<ExtArgs>, T, 'findMany', never>>

    /**
     * Create a CurriculumSubject.
     * @param {CurriculumSubjectCreateArgs} args - Arguments to create a CurriculumSubject.
     * @example
     * // Create one CurriculumSubject
     * const CurriculumSubject = await prisma.curriculumSubject.create({
     *   data: {
     *     // ... data to create a CurriculumSubject
     *   }
     * })
     * 
    **/
    create<T extends CurriculumSubjectCreateArgs<ExtArgs>>(
      args: SelectSubset<T, CurriculumSubjectCreateArgs<ExtArgs>>
    ): Prisma__CurriculumSubjectClient<$Types.GetResult<CurriculumSubjectPayload<ExtArgs>, T, 'create', never>, never, ExtArgs>

    /**
     * Create many CurriculumSubjects.
     *     @param {CurriculumSubjectCreateManyArgs} args - Arguments to create many CurriculumSubjects.
     *     @example
     *     // Create many CurriculumSubjects
     *     const curriculumSubject = await prisma.curriculumSubject.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends CurriculumSubjectCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, CurriculumSubjectCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a CurriculumSubject.
     * @param {CurriculumSubjectDeleteArgs} args - Arguments to delete one CurriculumSubject.
     * @example
     * // Delete one CurriculumSubject
     * const CurriculumSubject = await prisma.curriculumSubject.delete({
     *   where: {
     *     // ... filter to delete one CurriculumSubject
     *   }
     * })
     * 
    **/
    delete<T extends CurriculumSubjectDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, CurriculumSubjectDeleteArgs<ExtArgs>>
    ): Prisma__CurriculumSubjectClient<$Types.GetResult<CurriculumSubjectPayload<ExtArgs>, T, 'delete', never>, never, ExtArgs>

    /**
     * Update one CurriculumSubject.
     * @param {CurriculumSubjectUpdateArgs} args - Arguments to update one CurriculumSubject.
     * @example
     * // Update one CurriculumSubject
     * const curriculumSubject = await prisma.curriculumSubject.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends CurriculumSubjectUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, CurriculumSubjectUpdateArgs<ExtArgs>>
    ): Prisma__CurriculumSubjectClient<$Types.GetResult<CurriculumSubjectPayload<ExtArgs>, T, 'update', never>, never, ExtArgs>

    /**
     * Delete zero or more CurriculumSubjects.
     * @param {CurriculumSubjectDeleteManyArgs} args - Arguments to filter CurriculumSubjects to delete.
     * @example
     * // Delete a few CurriculumSubjects
     * const { count } = await prisma.curriculumSubject.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends CurriculumSubjectDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, CurriculumSubjectDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CurriculumSubjects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CurriculumSubjectUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CurriculumSubjects
     * const curriculumSubject = await prisma.curriculumSubject.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends CurriculumSubjectUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, CurriculumSubjectUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one CurriculumSubject.
     * @param {CurriculumSubjectUpsertArgs} args - Arguments to update or create a CurriculumSubject.
     * @example
     * // Update or create a CurriculumSubject
     * const curriculumSubject = await prisma.curriculumSubject.upsert({
     *   create: {
     *     // ... data to create a CurriculumSubject
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CurriculumSubject we want to update
     *   }
     * })
    **/
    upsert<T extends CurriculumSubjectUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, CurriculumSubjectUpsertArgs<ExtArgs>>
    ): Prisma__CurriculumSubjectClient<$Types.GetResult<CurriculumSubjectPayload<ExtArgs>, T, 'upsert', never>, never, ExtArgs>

    /**
     * Count the number of CurriculumSubjects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CurriculumSubjectCountArgs} args - Arguments to filter CurriculumSubjects to count.
     * @example
     * // Count the number of CurriculumSubjects
     * const count = await prisma.curriculumSubject.count({
     *   where: {
     *     // ... the filter for the CurriculumSubjects we want to count
     *   }
     * })
    **/
    count<T extends CurriculumSubjectCountArgs>(
      args?: Subset<T, CurriculumSubjectCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CurriculumSubjectCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CurriculumSubject.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CurriculumSubjectAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CurriculumSubjectAggregateArgs>(args: Subset<T, CurriculumSubjectAggregateArgs>): Prisma.PrismaPromise<GetCurriculumSubjectAggregateType<T>>

    /**
     * Group by CurriculumSubject.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CurriculumSubjectGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CurriculumSubjectGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CurriculumSubjectGroupByArgs['orderBy'] }
        : { orderBy?: CurriculumSubjectGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CurriculumSubjectGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCurriculumSubjectGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for CurriculumSubject.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__CurriculumSubjectClient<T, Null = never, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> implements Prisma.PrismaPromise<T> {
    private readonly _dmmf;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    constructor(_dmmf: runtime.DMMFClass, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);

    topics<T extends CurriculumSubject$topicsArgs<ExtArgs> = {}>(args?: Subset<T, CurriculumSubject$topicsArgs<ExtArgs>>): Prisma.PrismaPromise<$Types.GetResult<TopicPayload<ExtArgs>, T, 'findMany', never>| Null>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * CurriculumSubject base type for findUnique actions
   */
  export type CurriculumSubjectFindUniqueArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CurriculumSubject
     */
    select?: CurriculumSubjectSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: CurriculumSubjectInclude<ExtArgs> | null
    /**
     * Filter, which CurriculumSubject to fetch.
     */
    where: CurriculumSubjectWhereUniqueInput
  }

  /**
   * CurriculumSubject findUnique
   */
  export interface CurriculumSubjectFindUniqueArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends CurriculumSubjectFindUniqueArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * CurriculumSubject findUniqueOrThrow
   */
  export type CurriculumSubjectFindUniqueOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CurriculumSubject
     */
    select?: CurriculumSubjectSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: CurriculumSubjectInclude<ExtArgs> | null
    /**
     * Filter, which CurriculumSubject to fetch.
     */
    where: CurriculumSubjectWhereUniqueInput
  }


  /**
   * CurriculumSubject base type for findFirst actions
   */
  export type CurriculumSubjectFindFirstArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CurriculumSubject
     */
    select?: CurriculumSubjectSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: CurriculumSubjectInclude<ExtArgs> | null
    /**
     * Filter, which CurriculumSubject to fetch.
     */
    where?: CurriculumSubjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CurriculumSubjects to fetch.
     */
    orderBy?: Enumerable<CurriculumSubjectOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CurriculumSubjects.
     */
    cursor?: CurriculumSubjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CurriculumSubjects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CurriculumSubjects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CurriculumSubjects.
     */
    distinct?: Enumerable<CurriculumSubjectScalarFieldEnum>
  }

  /**
   * CurriculumSubject findFirst
   */
  export interface CurriculumSubjectFindFirstArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends CurriculumSubjectFindFirstArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * CurriculumSubject findFirstOrThrow
   */
  export type CurriculumSubjectFindFirstOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CurriculumSubject
     */
    select?: CurriculumSubjectSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: CurriculumSubjectInclude<ExtArgs> | null
    /**
     * Filter, which CurriculumSubject to fetch.
     */
    where?: CurriculumSubjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CurriculumSubjects to fetch.
     */
    orderBy?: Enumerable<CurriculumSubjectOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CurriculumSubjects.
     */
    cursor?: CurriculumSubjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CurriculumSubjects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CurriculumSubjects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CurriculumSubjects.
     */
    distinct?: Enumerable<CurriculumSubjectScalarFieldEnum>
  }


  /**
   * CurriculumSubject findMany
   */
  export type CurriculumSubjectFindManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CurriculumSubject
     */
    select?: CurriculumSubjectSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: CurriculumSubjectInclude<ExtArgs> | null
    /**
     * Filter, which CurriculumSubjects to fetch.
     */
    where?: CurriculumSubjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CurriculumSubjects to fetch.
     */
    orderBy?: Enumerable<CurriculumSubjectOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CurriculumSubjects.
     */
    cursor?: CurriculumSubjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CurriculumSubjects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CurriculumSubjects.
     */
    skip?: number
    distinct?: Enumerable<CurriculumSubjectScalarFieldEnum>
  }


  /**
   * CurriculumSubject create
   */
  export type CurriculumSubjectCreateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CurriculumSubject
     */
    select?: CurriculumSubjectSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: CurriculumSubjectInclude<ExtArgs> | null
    /**
     * The data needed to create a CurriculumSubject.
     */
    data: XOR<CurriculumSubjectCreateInput, CurriculumSubjectUncheckedCreateInput>
  }


  /**
   * CurriculumSubject createMany
   */
  export type CurriculumSubjectCreateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CurriculumSubjects.
     */
    data: Enumerable<CurriculumSubjectCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * CurriculumSubject update
   */
  export type CurriculumSubjectUpdateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CurriculumSubject
     */
    select?: CurriculumSubjectSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: CurriculumSubjectInclude<ExtArgs> | null
    /**
     * The data needed to update a CurriculumSubject.
     */
    data: XOR<CurriculumSubjectUpdateInput, CurriculumSubjectUncheckedUpdateInput>
    /**
     * Choose, which CurriculumSubject to update.
     */
    where: CurriculumSubjectWhereUniqueInput
  }


  /**
   * CurriculumSubject updateMany
   */
  export type CurriculumSubjectUpdateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CurriculumSubjects.
     */
    data: XOR<CurriculumSubjectUpdateManyMutationInput, CurriculumSubjectUncheckedUpdateManyInput>
    /**
     * Filter which CurriculumSubjects to update
     */
    where?: CurriculumSubjectWhereInput
  }


  /**
   * CurriculumSubject upsert
   */
  export type CurriculumSubjectUpsertArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CurriculumSubject
     */
    select?: CurriculumSubjectSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: CurriculumSubjectInclude<ExtArgs> | null
    /**
     * The filter to search for the CurriculumSubject to update in case it exists.
     */
    where: CurriculumSubjectWhereUniqueInput
    /**
     * In case the CurriculumSubject found by the `where` argument doesn't exist, create a new CurriculumSubject with this data.
     */
    create: XOR<CurriculumSubjectCreateInput, CurriculumSubjectUncheckedCreateInput>
    /**
     * In case the CurriculumSubject was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CurriculumSubjectUpdateInput, CurriculumSubjectUncheckedUpdateInput>
  }


  /**
   * CurriculumSubject delete
   */
  export type CurriculumSubjectDeleteArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CurriculumSubject
     */
    select?: CurriculumSubjectSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: CurriculumSubjectInclude<ExtArgs> | null
    /**
     * Filter which CurriculumSubject to delete.
     */
    where: CurriculumSubjectWhereUniqueInput
  }


  /**
   * CurriculumSubject deleteMany
   */
  export type CurriculumSubjectDeleteManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which CurriculumSubjects to delete
     */
    where?: CurriculumSubjectWhereInput
  }


  /**
   * CurriculumSubject.topics
   */
  export type CurriculumSubject$topicsArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Topic
     */
    select?: TopicSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: TopicInclude<ExtArgs> | null
    where?: TopicWhereInput
    orderBy?: Enumerable<TopicOrderByWithRelationInput>
    cursor?: TopicWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Enumerable<TopicScalarFieldEnum>
  }


  /**
   * CurriculumSubject without action
   */
  export type CurriculumSubjectArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CurriculumSubject
     */
    select?: CurriculumSubjectSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: CurriculumSubjectInclude<ExtArgs> | null
  }



  /**
   * Model Topic
   */


  export type AggregateTopic = {
    _count: TopicCountAggregateOutputType | null
    _avg: TopicAvgAggregateOutputType | null
    _sum: TopicSumAggregateOutputType | null
    _min: TopicMinAggregateOutputType | null
    _max: TopicMaxAggregateOutputType | null
  }

  export type TopicAvgAggregateOutputType = {
    id: number | null
    subjectId: number | null
    orderIndex: number | null
  }

  export type TopicSumAggregateOutputType = {
    id: number | null
    subjectId: number | null
    orderIndex: number | null
  }

  export type TopicMinAggregateOutputType = {
    id: number | null
    title: string | null
    description: string | null
    subjectId: number | null
    orderIndex: number | null
  }

  export type TopicMaxAggregateOutputType = {
    id: number | null
    title: string | null
    description: string | null
    subjectId: number | null
    orderIndex: number | null
  }

  export type TopicCountAggregateOutputType = {
    id: number
    title: number
    description: number
    subjectId: number
    orderIndex: number
    _all: number
  }


  export type TopicAvgAggregateInputType = {
    id?: true
    subjectId?: true
    orderIndex?: true
  }

  export type TopicSumAggregateInputType = {
    id?: true
    subjectId?: true
    orderIndex?: true
  }

  export type TopicMinAggregateInputType = {
    id?: true
    title?: true
    description?: true
    subjectId?: true
    orderIndex?: true
  }

  export type TopicMaxAggregateInputType = {
    id?: true
    title?: true
    description?: true
    subjectId?: true
    orderIndex?: true
  }

  export type TopicCountAggregateInputType = {
    id?: true
    title?: true
    description?: true
    subjectId?: true
    orderIndex?: true
    _all?: true
  }

  export type TopicAggregateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which Topic to aggregate.
     */
    where?: TopicWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Topics to fetch.
     */
    orderBy?: Enumerable<TopicOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TopicWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Topics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Topics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Topics
    **/
    _count?: true | TopicCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TopicAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TopicSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TopicMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TopicMaxAggregateInputType
  }

  export type GetTopicAggregateType<T extends TopicAggregateArgs> = {
        [P in keyof T & keyof AggregateTopic]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTopic[P]>
      : GetScalarType<T[P], AggregateTopic[P]>
  }




  export type TopicGroupByArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: TopicWhereInput
    orderBy?: Enumerable<TopicOrderByWithAggregationInput>
    by: TopicScalarFieldEnum[]
    having?: TopicScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TopicCountAggregateInputType | true
    _avg?: TopicAvgAggregateInputType
    _sum?: TopicSumAggregateInputType
    _min?: TopicMinAggregateInputType
    _max?: TopicMaxAggregateInputType
  }


  export type TopicGroupByOutputType = {
    id: number
    title: string
    description: string | null
    subjectId: number
    orderIndex: number
    _count: TopicCountAggregateOutputType | null
    _avg: TopicAvgAggregateOutputType | null
    _sum: TopicSumAggregateOutputType | null
    _min: TopicMinAggregateOutputType | null
    _max: TopicMaxAggregateOutputType | null
  }

  type GetTopicGroupByPayload<T extends TopicGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickArray<TopicGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TopicGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TopicGroupByOutputType[P]>
            : GetScalarType<T[P], TopicGroupByOutputType[P]>
        }
      >
    >


  export type TopicSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    subjectId?: boolean
    orderIndex?: boolean
    subject?: boolean | CurriculumSubjectArgs<ExtArgs>
    lessons?: boolean | Topic$lessonsArgs<ExtArgs>
    _count?: boolean | TopicCountOutputTypeArgs<ExtArgs>
  }, ExtArgs["result"]["topic"]>

  export type TopicSelectScalar = {
    id?: boolean
    title?: boolean
    description?: boolean
    subjectId?: boolean
    orderIndex?: boolean
  }

  export type TopicInclude<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    subject?: boolean | CurriculumSubjectArgs<ExtArgs>
    lessons?: boolean | Topic$lessonsArgs<ExtArgs>
    _count?: boolean | TopicCountOutputTypeArgs<ExtArgs>
  }


  type TopicGetPayload<S extends boolean | null | undefined | TopicArgs> = $Types.GetResult<TopicPayload, S>

  type TopicCountArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = 
    Omit<TopicFindManyArgs, 'select' | 'include'> & {
      select?: TopicCountAggregateInputType | true
    }

  export interface TopicDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Topic'], meta: { name: 'Topic' } }
    /**
     * Find zero or one Topic that matches the filter.
     * @param {TopicFindUniqueArgs} args - Arguments to find a Topic
     * @example
     * // Get one Topic
     * const topic = await prisma.topic.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends TopicFindUniqueArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, TopicFindUniqueArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'Topic'> extends True ? Prisma__TopicClient<$Types.GetResult<TopicPayload<ExtArgs>, T, 'findUnique', never>, never, ExtArgs> : Prisma__TopicClient<$Types.GetResult<TopicPayload<ExtArgs>, T, 'findUnique', never> | null, null, ExtArgs>

    /**
     * Find one Topic that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {TopicFindUniqueOrThrowArgs} args - Arguments to find a Topic
     * @example
     * // Get one Topic
     * const topic = await prisma.topic.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends TopicFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, TopicFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__TopicClient<$Types.GetResult<TopicPayload<ExtArgs>, T, 'findUniqueOrThrow', never>, never, ExtArgs>

    /**
     * Find the first Topic that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TopicFindFirstArgs} args - Arguments to find a Topic
     * @example
     * // Get one Topic
     * const topic = await prisma.topic.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends TopicFindFirstArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, TopicFindFirstArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'Topic'> extends True ? Prisma__TopicClient<$Types.GetResult<TopicPayload<ExtArgs>, T, 'findFirst', never>, never, ExtArgs> : Prisma__TopicClient<$Types.GetResult<TopicPayload<ExtArgs>, T, 'findFirst', never> | null, null, ExtArgs>

    /**
     * Find the first Topic that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TopicFindFirstOrThrowArgs} args - Arguments to find a Topic
     * @example
     * // Get one Topic
     * const topic = await prisma.topic.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends TopicFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, TopicFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__TopicClient<$Types.GetResult<TopicPayload<ExtArgs>, T, 'findFirstOrThrow', never>, never, ExtArgs>

    /**
     * Find zero or more Topics that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TopicFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Topics
     * const topics = await prisma.topic.findMany()
     * 
     * // Get first 10 Topics
     * const topics = await prisma.topic.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const topicWithIdOnly = await prisma.topic.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends TopicFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, TopicFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Types.GetResult<TopicPayload<ExtArgs>, T, 'findMany', never>>

    /**
     * Create a Topic.
     * @param {TopicCreateArgs} args - Arguments to create a Topic.
     * @example
     * // Create one Topic
     * const Topic = await prisma.topic.create({
     *   data: {
     *     // ... data to create a Topic
     *   }
     * })
     * 
    **/
    create<T extends TopicCreateArgs<ExtArgs>>(
      args: SelectSubset<T, TopicCreateArgs<ExtArgs>>
    ): Prisma__TopicClient<$Types.GetResult<TopicPayload<ExtArgs>, T, 'create', never>, never, ExtArgs>

    /**
     * Create many Topics.
     *     @param {TopicCreateManyArgs} args - Arguments to create many Topics.
     *     @example
     *     // Create many Topics
     *     const topic = await prisma.topic.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends TopicCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, TopicCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Topic.
     * @param {TopicDeleteArgs} args - Arguments to delete one Topic.
     * @example
     * // Delete one Topic
     * const Topic = await prisma.topic.delete({
     *   where: {
     *     // ... filter to delete one Topic
     *   }
     * })
     * 
    **/
    delete<T extends TopicDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, TopicDeleteArgs<ExtArgs>>
    ): Prisma__TopicClient<$Types.GetResult<TopicPayload<ExtArgs>, T, 'delete', never>, never, ExtArgs>

    /**
     * Update one Topic.
     * @param {TopicUpdateArgs} args - Arguments to update one Topic.
     * @example
     * // Update one Topic
     * const topic = await prisma.topic.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends TopicUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, TopicUpdateArgs<ExtArgs>>
    ): Prisma__TopicClient<$Types.GetResult<TopicPayload<ExtArgs>, T, 'update', never>, never, ExtArgs>

    /**
     * Delete zero or more Topics.
     * @param {TopicDeleteManyArgs} args - Arguments to filter Topics to delete.
     * @example
     * // Delete a few Topics
     * const { count } = await prisma.topic.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends TopicDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, TopicDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Topics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TopicUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Topics
     * const topic = await prisma.topic.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends TopicUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, TopicUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Topic.
     * @param {TopicUpsertArgs} args - Arguments to update or create a Topic.
     * @example
     * // Update or create a Topic
     * const topic = await prisma.topic.upsert({
     *   create: {
     *     // ... data to create a Topic
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Topic we want to update
     *   }
     * })
    **/
    upsert<T extends TopicUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, TopicUpsertArgs<ExtArgs>>
    ): Prisma__TopicClient<$Types.GetResult<TopicPayload<ExtArgs>, T, 'upsert', never>, never, ExtArgs>

    /**
     * Count the number of Topics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TopicCountArgs} args - Arguments to filter Topics to count.
     * @example
     * // Count the number of Topics
     * const count = await prisma.topic.count({
     *   where: {
     *     // ... the filter for the Topics we want to count
     *   }
     * })
    **/
    count<T extends TopicCountArgs>(
      args?: Subset<T, TopicCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TopicCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Topic.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TopicAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TopicAggregateArgs>(args: Subset<T, TopicAggregateArgs>): Prisma.PrismaPromise<GetTopicAggregateType<T>>

    /**
     * Group by Topic.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TopicGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TopicGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TopicGroupByArgs['orderBy'] }
        : { orderBy?: TopicGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TopicGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTopicGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for Topic.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__TopicClient<T, Null = never, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> implements Prisma.PrismaPromise<T> {
    private readonly _dmmf;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    constructor(_dmmf: runtime.DMMFClass, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);

    subject<T extends CurriculumSubjectArgs<ExtArgs> = {}>(args?: Subset<T, CurriculumSubjectArgs<ExtArgs>>): Prisma__CurriculumSubjectClient<$Types.GetResult<CurriculumSubjectPayload<ExtArgs>, T, 'findUnique', never> | Null, never, ExtArgs>;

    lessons<T extends Topic$lessonsArgs<ExtArgs> = {}>(args?: Subset<T, Topic$lessonsArgs<ExtArgs>>): Prisma.PrismaPromise<$Types.GetResult<LessonPayload<ExtArgs>, T, 'findMany', never>| Null>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * Topic base type for findUnique actions
   */
  export type TopicFindUniqueArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Topic
     */
    select?: TopicSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: TopicInclude<ExtArgs> | null
    /**
     * Filter, which Topic to fetch.
     */
    where: TopicWhereUniqueInput
  }

  /**
   * Topic findUnique
   */
  export interface TopicFindUniqueArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends TopicFindUniqueArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Topic findUniqueOrThrow
   */
  export type TopicFindUniqueOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Topic
     */
    select?: TopicSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: TopicInclude<ExtArgs> | null
    /**
     * Filter, which Topic to fetch.
     */
    where: TopicWhereUniqueInput
  }


  /**
   * Topic base type for findFirst actions
   */
  export type TopicFindFirstArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Topic
     */
    select?: TopicSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: TopicInclude<ExtArgs> | null
    /**
     * Filter, which Topic to fetch.
     */
    where?: TopicWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Topics to fetch.
     */
    orderBy?: Enumerable<TopicOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Topics.
     */
    cursor?: TopicWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Topics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Topics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Topics.
     */
    distinct?: Enumerable<TopicScalarFieldEnum>
  }

  /**
   * Topic findFirst
   */
  export interface TopicFindFirstArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends TopicFindFirstArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Topic findFirstOrThrow
   */
  export type TopicFindFirstOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Topic
     */
    select?: TopicSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: TopicInclude<ExtArgs> | null
    /**
     * Filter, which Topic to fetch.
     */
    where?: TopicWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Topics to fetch.
     */
    orderBy?: Enumerable<TopicOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Topics.
     */
    cursor?: TopicWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Topics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Topics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Topics.
     */
    distinct?: Enumerable<TopicScalarFieldEnum>
  }


  /**
   * Topic findMany
   */
  export type TopicFindManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Topic
     */
    select?: TopicSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: TopicInclude<ExtArgs> | null
    /**
     * Filter, which Topics to fetch.
     */
    where?: TopicWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Topics to fetch.
     */
    orderBy?: Enumerable<TopicOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Topics.
     */
    cursor?: TopicWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Topics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Topics.
     */
    skip?: number
    distinct?: Enumerable<TopicScalarFieldEnum>
  }


  /**
   * Topic create
   */
  export type TopicCreateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Topic
     */
    select?: TopicSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: TopicInclude<ExtArgs> | null
    /**
     * The data needed to create a Topic.
     */
    data: XOR<TopicCreateInput, TopicUncheckedCreateInput>
  }


  /**
   * Topic createMany
   */
  export type TopicCreateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Topics.
     */
    data: Enumerable<TopicCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * Topic update
   */
  export type TopicUpdateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Topic
     */
    select?: TopicSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: TopicInclude<ExtArgs> | null
    /**
     * The data needed to update a Topic.
     */
    data: XOR<TopicUpdateInput, TopicUncheckedUpdateInput>
    /**
     * Choose, which Topic to update.
     */
    where: TopicWhereUniqueInput
  }


  /**
   * Topic updateMany
   */
  export type TopicUpdateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Topics.
     */
    data: XOR<TopicUpdateManyMutationInput, TopicUncheckedUpdateManyInput>
    /**
     * Filter which Topics to update
     */
    where?: TopicWhereInput
  }


  /**
   * Topic upsert
   */
  export type TopicUpsertArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Topic
     */
    select?: TopicSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: TopicInclude<ExtArgs> | null
    /**
     * The filter to search for the Topic to update in case it exists.
     */
    where: TopicWhereUniqueInput
    /**
     * In case the Topic found by the `where` argument doesn't exist, create a new Topic with this data.
     */
    create: XOR<TopicCreateInput, TopicUncheckedCreateInput>
    /**
     * In case the Topic was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TopicUpdateInput, TopicUncheckedUpdateInput>
  }


  /**
   * Topic delete
   */
  export type TopicDeleteArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Topic
     */
    select?: TopicSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: TopicInclude<ExtArgs> | null
    /**
     * Filter which Topic to delete.
     */
    where: TopicWhereUniqueInput
  }


  /**
   * Topic deleteMany
   */
  export type TopicDeleteManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which Topics to delete
     */
    where?: TopicWhereInput
  }


  /**
   * Topic.lessons
   */
  export type Topic$lessonsArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lesson
     */
    select?: LessonSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: LessonInclude<ExtArgs> | null
    where?: LessonWhereInput
    orderBy?: Enumerable<LessonOrderByWithRelationInput>
    cursor?: LessonWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Enumerable<LessonScalarFieldEnum>
  }


  /**
   * Topic without action
   */
  export type TopicArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Topic
     */
    select?: TopicSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: TopicInclude<ExtArgs> | null
  }



  /**
   * Model Lesson
   */


  export type AggregateLesson = {
    _count: LessonCountAggregateOutputType | null
    _avg: LessonAvgAggregateOutputType | null
    _sum: LessonSumAggregateOutputType | null
    _min: LessonMinAggregateOutputType | null
    _max: LessonMaxAggregateOutputType | null
  }

  export type LessonAvgAggregateOutputType = {
    id: number | null
    duration: number | null
    topicId: number | null
  }

  export type LessonSumAggregateOutputType = {
    id: number | null
    duration: number | null
    topicId: number | null
  }

  export type LessonMinAggregateOutputType = {
    id: number | null
    title: string | null
    content: string | null
    videoUrl: string | null
    duration: number | null
    difficulty: string | null
    topicId: number | null
  }

  export type LessonMaxAggregateOutputType = {
    id: number | null
    title: string | null
    content: string | null
    videoUrl: string | null
    duration: number | null
    difficulty: string | null
    topicId: number | null
  }

  export type LessonCountAggregateOutputType = {
    id: number
    title: number
    content: number
    videoUrl: number
    duration: number
    difficulty: number
    topicId: number
    _all: number
  }


  export type LessonAvgAggregateInputType = {
    id?: true
    duration?: true
    topicId?: true
  }

  export type LessonSumAggregateInputType = {
    id?: true
    duration?: true
    topicId?: true
  }

  export type LessonMinAggregateInputType = {
    id?: true
    title?: true
    content?: true
    videoUrl?: true
    duration?: true
    difficulty?: true
    topicId?: true
  }

  export type LessonMaxAggregateInputType = {
    id?: true
    title?: true
    content?: true
    videoUrl?: true
    duration?: true
    difficulty?: true
    topicId?: true
  }

  export type LessonCountAggregateInputType = {
    id?: true
    title?: true
    content?: true
    videoUrl?: true
    duration?: true
    difficulty?: true
    topicId?: true
    _all?: true
  }

  export type LessonAggregateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which Lesson to aggregate.
     */
    where?: LessonWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Lessons to fetch.
     */
    orderBy?: Enumerable<LessonOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LessonWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Lessons from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Lessons.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Lessons
    **/
    _count?: true | LessonCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LessonAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LessonSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LessonMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LessonMaxAggregateInputType
  }

  export type GetLessonAggregateType<T extends LessonAggregateArgs> = {
        [P in keyof T & keyof AggregateLesson]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLesson[P]>
      : GetScalarType<T[P], AggregateLesson[P]>
  }




  export type LessonGroupByArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: LessonWhereInput
    orderBy?: Enumerable<LessonOrderByWithAggregationInput>
    by: LessonScalarFieldEnum[]
    having?: LessonScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LessonCountAggregateInputType | true
    _avg?: LessonAvgAggregateInputType
    _sum?: LessonSumAggregateInputType
    _min?: LessonMinAggregateInputType
    _max?: LessonMaxAggregateInputType
  }


  export type LessonGroupByOutputType = {
    id: number
    title: string
    content: string
    videoUrl: string | null
    duration: number | null
    difficulty: string | null
    topicId: number
    _count: LessonCountAggregateOutputType | null
    _avg: LessonAvgAggregateOutputType | null
    _sum: LessonSumAggregateOutputType | null
    _min: LessonMinAggregateOutputType | null
    _max: LessonMaxAggregateOutputType | null
  }

  type GetLessonGroupByPayload<T extends LessonGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickArray<LessonGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LessonGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LessonGroupByOutputType[P]>
            : GetScalarType<T[P], LessonGroupByOutputType[P]>
        }
      >
    >


  export type LessonSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    content?: boolean
    videoUrl?: boolean
    duration?: boolean
    difficulty?: boolean
    topicId?: boolean
    topic?: boolean | TopicArgs<ExtArgs>
  }, ExtArgs["result"]["lesson"]>

  export type LessonSelectScalar = {
    id?: boolean
    title?: boolean
    content?: boolean
    videoUrl?: boolean
    duration?: boolean
    difficulty?: boolean
    topicId?: boolean
  }

  export type LessonInclude<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    topic?: boolean | TopicArgs<ExtArgs>
  }


  type LessonGetPayload<S extends boolean | null | undefined | LessonArgs> = $Types.GetResult<LessonPayload, S>

  type LessonCountArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = 
    Omit<LessonFindManyArgs, 'select' | 'include'> & {
      select?: LessonCountAggregateInputType | true
    }

  export interface LessonDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Lesson'], meta: { name: 'Lesson' } }
    /**
     * Find zero or one Lesson that matches the filter.
     * @param {LessonFindUniqueArgs} args - Arguments to find a Lesson
     * @example
     * // Get one Lesson
     * const lesson = await prisma.lesson.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends LessonFindUniqueArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, LessonFindUniqueArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'Lesson'> extends True ? Prisma__LessonClient<$Types.GetResult<LessonPayload<ExtArgs>, T, 'findUnique', never>, never, ExtArgs> : Prisma__LessonClient<$Types.GetResult<LessonPayload<ExtArgs>, T, 'findUnique', never> | null, null, ExtArgs>

    /**
     * Find one Lesson that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {LessonFindUniqueOrThrowArgs} args - Arguments to find a Lesson
     * @example
     * // Get one Lesson
     * const lesson = await prisma.lesson.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends LessonFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, LessonFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__LessonClient<$Types.GetResult<LessonPayload<ExtArgs>, T, 'findUniqueOrThrow', never>, never, ExtArgs>

    /**
     * Find the first Lesson that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LessonFindFirstArgs} args - Arguments to find a Lesson
     * @example
     * // Get one Lesson
     * const lesson = await prisma.lesson.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends LessonFindFirstArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, LessonFindFirstArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'Lesson'> extends True ? Prisma__LessonClient<$Types.GetResult<LessonPayload<ExtArgs>, T, 'findFirst', never>, never, ExtArgs> : Prisma__LessonClient<$Types.GetResult<LessonPayload<ExtArgs>, T, 'findFirst', never> | null, null, ExtArgs>

    /**
     * Find the first Lesson that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LessonFindFirstOrThrowArgs} args - Arguments to find a Lesson
     * @example
     * // Get one Lesson
     * const lesson = await prisma.lesson.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends LessonFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, LessonFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__LessonClient<$Types.GetResult<LessonPayload<ExtArgs>, T, 'findFirstOrThrow', never>, never, ExtArgs>

    /**
     * Find zero or more Lessons that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LessonFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Lessons
     * const lessons = await prisma.lesson.findMany()
     * 
     * // Get first 10 Lessons
     * const lessons = await prisma.lesson.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const lessonWithIdOnly = await prisma.lesson.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends LessonFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, LessonFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Types.GetResult<LessonPayload<ExtArgs>, T, 'findMany', never>>

    /**
     * Create a Lesson.
     * @param {LessonCreateArgs} args - Arguments to create a Lesson.
     * @example
     * // Create one Lesson
     * const Lesson = await prisma.lesson.create({
     *   data: {
     *     // ... data to create a Lesson
     *   }
     * })
     * 
    **/
    create<T extends LessonCreateArgs<ExtArgs>>(
      args: SelectSubset<T, LessonCreateArgs<ExtArgs>>
    ): Prisma__LessonClient<$Types.GetResult<LessonPayload<ExtArgs>, T, 'create', never>, never, ExtArgs>

    /**
     * Create many Lessons.
     *     @param {LessonCreateManyArgs} args - Arguments to create many Lessons.
     *     @example
     *     // Create many Lessons
     *     const lesson = await prisma.lesson.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends LessonCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, LessonCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Lesson.
     * @param {LessonDeleteArgs} args - Arguments to delete one Lesson.
     * @example
     * // Delete one Lesson
     * const Lesson = await prisma.lesson.delete({
     *   where: {
     *     // ... filter to delete one Lesson
     *   }
     * })
     * 
    **/
    delete<T extends LessonDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, LessonDeleteArgs<ExtArgs>>
    ): Prisma__LessonClient<$Types.GetResult<LessonPayload<ExtArgs>, T, 'delete', never>, never, ExtArgs>

    /**
     * Update one Lesson.
     * @param {LessonUpdateArgs} args - Arguments to update one Lesson.
     * @example
     * // Update one Lesson
     * const lesson = await prisma.lesson.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends LessonUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, LessonUpdateArgs<ExtArgs>>
    ): Prisma__LessonClient<$Types.GetResult<LessonPayload<ExtArgs>, T, 'update', never>, never, ExtArgs>

    /**
     * Delete zero or more Lessons.
     * @param {LessonDeleteManyArgs} args - Arguments to filter Lessons to delete.
     * @example
     * // Delete a few Lessons
     * const { count } = await prisma.lesson.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends LessonDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, LessonDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Lessons.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LessonUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Lessons
     * const lesson = await prisma.lesson.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends LessonUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, LessonUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Lesson.
     * @param {LessonUpsertArgs} args - Arguments to update or create a Lesson.
     * @example
     * // Update or create a Lesson
     * const lesson = await prisma.lesson.upsert({
     *   create: {
     *     // ... data to create a Lesson
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Lesson we want to update
     *   }
     * })
    **/
    upsert<T extends LessonUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, LessonUpsertArgs<ExtArgs>>
    ): Prisma__LessonClient<$Types.GetResult<LessonPayload<ExtArgs>, T, 'upsert', never>, never, ExtArgs>

    /**
     * Count the number of Lessons.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LessonCountArgs} args - Arguments to filter Lessons to count.
     * @example
     * // Count the number of Lessons
     * const count = await prisma.lesson.count({
     *   where: {
     *     // ... the filter for the Lessons we want to count
     *   }
     * })
    **/
    count<T extends LessonCountArgs>(
      args?: Subset<T, LessonCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LessonCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Lesson.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LessonAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LessonAggregateArgs>(args: Subset<T, LessonAggregateArgs>): Prisma.PrismaPromise<GetLessonAggregateType<T>>

    /**
     * Group by Lesson.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LessonGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LessonGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LessonGroupByArgs['orderBy'] }
        : { orderBy?: LessonGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LessonGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLessonGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for Lesson.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__LessonClient<T, Null = never, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> implements Prisma.PrismaPromise<T> {
    private readonly _dmmf;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    constructor(_dmmf: runtime.DMMFClass, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);

    topic<T extends TopicArgs<ExtArgs> = {}>(args?: Subset<T, TopicArgs<ExtArgs>>): Prisma__TopicClient<$Types.GetResult<TopicPayload<ExtArgs>, T, 'findUnique', never> | Null, never, ExtArgs>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * Lesson base type for findUnique actions
   */
  export type LessonFindUniqueArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lesson
     */
    select?: LessonSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: LessonInclude<ExtArgs> | null
    /**
     * Filter, which Lesson to fetch.
     */
    where: LessonWhereUniqueInput
  }

  /**
   * Lesson findUnique
   */
  export interface LessonFindUniqueArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends LessonFindUniqueArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Lesson findUniqueOrThrow
   */
  export type LessonFindUniqueOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lesson
     */
    select?: LessonSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: LessonInclude<ExtArgs> | null
    /**
     * Filter, which Lesson to fetch.
     */
    where: LessonWhereUniqueInput
  }


  /**
   * Lesson base type for findFirst actions
   */
  export type LessonFindFirstArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lesson
     */
    select?: LessonSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: LessonInclude<ExtArgs> | null
    /**
     * Filter, which Lesson to fetch.
     */
    where?: LessonWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Lessons to fetch.
     */
    orderBy?: Enumerable<LessonOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Lessons.
     */
    cursor?: LessonWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Lessons from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Lessons.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Lessons.
     */
    distinct?: Enumerable<LessonScalarFieldEnum>
  }

  /**
   * Lesson findFirst
   */
  export interface LessonFindFirstArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends LessonFindFirstArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Lesson findFirstOrThrow
   */
  export type LessonFindFirstOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lesson
     */
    select?: LessonSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: LessonInclude<ExtArgs> | null
    /**
     * Filter, which Lesson to fetch.
     */
    where?: LessonWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Lessons to fetch.
     */
    orderBy?: Enumerable<LessonOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Lessons.
     */
    cursor?: LessonWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Lessons from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Lessons.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Lessons.
     */
    distinct?: Enumerable<LessonScalarFieldEnum>
  }


  /**
   * Lesson findMany
   */
  export type LessonFindManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lesson
     */
    select?: LessonSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: LessonInclude<ExtArgs> | null
    /**
     * Filter, which Lessons to fetch.
     */
    where?: LessonWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Lessons to fetch.
     */
    orderBy?: Enumerable<LessonOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Lessons.
     */
    cursor?: LessonWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Lessons from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Lessons.
     */
    skip?: number
    distinct?: Enumerable<LessonScalarFieldEnum>
  }


  /**
   * Lesson create
   */
  export type LessonCreateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lesson
     */
    select?: LessonSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: LessonInclude<ExtArgs> | null
    /**
     * The data needed to create a Lesson.
     */
    data: XOR<LessonCreateInput, LessonUncheckedCreateInput>
  }


  /**
   * Lesson createMany
   */
  export type LessonCreateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Lessons.
     */
    data: Enumerable<LessonCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * Lesson update
   */
  export type LessonUpdateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lesson
     */
    select?: LessonSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: LessonInclude<ExtArgs> | null
    /**
     * The data needed to update a Lesson.
     */
    data: XOR<LessonUpdateInput, LessonUncheckedUpdateInput>
    /**
     * Choose, which Lesson to update.
     */
    where: LessonWhereUniqueInput
  }


  /**
   * Lesson updateMany
   */
  export type LessonUpdateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Lessons.
     */
    data: XOR<LessonUpdateManyMutationInput, LessonUncheckedUpdateManyInput>
    /**
     * Filter which Lessons to update
     */
    where?: LessonWhereInput
  }


  /**
   * Lesson upsert
   */
  export type LessonUpsertArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lesson
     */
    select?: LessonSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: LessonInclude<ExtArgs> | null
    /**
     * The filter to search for the Lesson to update in case it exists.
     */
    where: LessonWhereUniqueInput
    /**
     * In case the Lesson found by the `where` argument doesn't exist, create a new Lesson with this data.
     */
    create: XOR<LessonCreateInput, LessonUncheckedCreateInput>
    /**
     * In case the Lesson was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LessonUpdateInput, LessonUncheckedUpdateInput>
  }


  /**
   * Lesson delete
   */
  export type LessonDeleteArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lesson
     */
    select?: LessonSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: LessonInclude<ExtArgs> | null
    /**
     * Filter which Lesson to delete.
     */
    where: LessonWhereUniqueInput
  }


  /**
   * Lesson deleteMany
   */
  export type LessonDeleteManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which Lessons to delete
     */
    where?: LessonWhereInput
  }


  /**
   * Lesson without action
   */
  export type LessonArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lesson
     */
    select?: LessonSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: LessonInclude<ExtArgs> | null
  }



  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const CurriculumSubjectScalarFieldEnum: {
    id: 'id',
    name: 'name',
    grade: 'grade',
    description: 'description',
    imageUrl: 'imageUrl',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type CurriculumSubjectScalarFieldEnum = (typeof CurriculumSubjectScalarFieldEnum)[keyof typeof CurriculumSubjectScalarFieldEnum]


  export const TopicScalarFieldEnum: {
    id: 'id',
    title: 'title',
    description: 'description',
    subjectId: 'subjectId',
    orderIndex: 'orderIndex'
  };

  export type TopicScalarFieldEnum = (typeof TopicScalarFieldEnum)[keyof typeof TopicScalarFieldEnum]


  export const LessonScalarFieldEnum: {
    id: 'id',
    title: 'title',
    content: 'content',
    videoUrl: 'videoUrl',
    duration: 'duration',
    difficulty: 'difficulty',
    topicId: 'topicId'
  };

  export type LessonScalarFieldEnum = (typeof LessonScalarFieldEnum)[keyof typeof LessonScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Deep Input Types
   */


  export type CurriculumSubjectWhereInput = {
    AND?: Enumerable<CurriculumSubjectWhereInput>
    OR?: Enumerable<CurriculumSubjectWhereInput>
    NOT?: Enumerable<CurriculumSubjectWhereInput>
    id?: IntFilter | number
    name?: StringFilter | string
    grade?: IntFilter | number
    description?: StringNullableFilter | string | null
    imageUrl?: StringNullableFilter | string | null
    createdAt?: DateTimeFilter | Date | string
    updatedAt?: DateTimeFilter | Date | string
    topics?: TopicListRelationFilter
  }

  export type CurriculumSubjectOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    grade?: SortOrder
    description?: SortOrderInput | SortOrder
    imageUrl?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    topics?: TopicOrderByRelationAggregateInput
  }

  export type CurriculumSubjectWhereUniqueInput = {
    id?: number
    name_grade?: CurriculumSubjectNameGradeCompoundUniqueInput
  }

  export type CurriculumSubjectOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    grade?: SortOrder
    description?: SortOrderInput | SortOrder
    imageUrl?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: CurriculumSubjectCountOrderByAggregateInput
    _avg?: CurriculumSubjectAvgOrderByAggregateInput
    _max?: CurriculumSubjectMaxOrderByAggregateInput
    _min?: CurriculumSubjectMinOrderByAggregateInput
    _sum?: CurriculumSubjectSumOrderByAggregateInput
  }

  export type CurriculumSubjectScalarWhereWithAggregatesInput = {
    AND?: Enumerable<CurriculumSubjectScalarWhereWithAggregatesInput>
    OR?: Enumerable<CurriculumSubjectScalarWhereWithAggregatesInput>
    NOT?: Enumerable<CurriculumSubjectScalarWhereWithAggregatesInput>
    id?: IntWithAggregatesFilter | number
    name?: StringWithAggregatesFilter | string
    grade?: IntWithAggregatesFilter | number
    description?: StringNullableWithAggregatesFilter | string | null
    imageUrl?: StringNullableWithAggregatesFilter | string | null
    createdAt?: DateTimeWithAggregatesFilter | Date | string
    updatedAt?: DateTimeWithAggregatesFilter | Date | string
  }

  export type TopicWhereInput = {
    AND?: Enumerable<TopicWhereInput>
    OR?: Enumerable<TopicWhereInput>
    NOT?: Enumerable<TopicWhereInput>
    id?: IntFilter | number
    title?: StringFilter | string
    description?: StringNullableFilter | string | null
    subjectId?: IntFilter | number
    orderIndex?: IntFilter | number
    subject?: XOR<CurriculumSubjectRelationFilter, CurriculumSubjectWhereInput>
    lessons?: LessonListRelationFilter
  }

  export type TopicOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    subjectId?: SortOrder
    orderIndex?: SortOrder
    subject?: CurriculumSubjectOrderByWithRelationInput
    lessons?: LessonOrderByRelationAggregateInput
  }

  export type TopicWhereUniqueInput = {
    id?: number
  }

  export type TopicOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    subjectId?: SortOrder
    orderIndex?: SortOrder
    _count?: TopicCountOrderByAggregateInput
    _avg?: TopicAvgOrderByAggregateInput
    _max?: TopicMaxOrderByAggregateInput
    _min?: TopicMinOrderByAggregateInput
    _sum?: TopicSumOrderByAggregateInput
  }

  export type TopicScalarWhereWithAggregatesInput = {
    AND?: Enumerable<TopicScalarWhereWithAggregatesInput>
    OR?: Enumerable<TopicScalarWhereWithAggregatesInput>
    NOT?: Enumerable<TopicScalarWhereWithAggregatesInput>
    id?: IntWithAggregatesFilter | number
    title?: StringWithAggregatesFilter | string
    description?: StringNullableWithAggregatesFilter | string | null
    subjectId?: IntWithAggregatesFilter | number
    orderIndex?: IntWithAggregatesFilter | number
  }

  export type LessonWhereInput = {
    AND?: Enumerable<LessonWhereInput>
    OR?: Enumerable<LessonWhereInput>
    NOT?: Enumerable<LessonWhereInput>
    id?: IntFilter | number
    title?: StringFilter | string
    content?: StringFilter | string
    videoUrl?: StringNullableFilter | string | null
    duration?: IntNullableFilter | number | null
    difficulty?: StringNullableFilter | string | null
    topicId?: IntFilter | number
    topic?: XOR<TopicRelationFilter, TopicWhereInput>
  }

  export type LessonOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    content?: SortOrder
    videoUrl?: SortOrderInput | SortOrder
    duration?: SortOrderInput | SortOrder
    difficulty?: SortOrderInput | SortOrder
    topicId?: SortOrder
    topic?: TopicOrderByWithRelationInput
  }

  export type LessonWhereUniqueInput = {
    id?: number
  }

  export type LessonOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    content?: SortOrder
    videoUrl?: SortOrderInput | SortOrder
    duration?: SortOrderInput | SortOrder
    difficulty?: SortOrderInput | SortOrder
    topicId?: SortOrder
    _count?: LessonCountOrderByAggregateInput
    _avg?: LessonAvgOrderByAggregateInput
    _max?: LessonMaxOrderByAggregateInput
    _min?: LessonMinOrderByAggregateInput
    _sum?: LessonSumOrderByAggregateInput
  }

  export type LessonScalarWhereWithAggregatesInput = {
    AND?: Enumerable<LessonScalarWhereWithAggregatesInput>
    OR?: Enumerable<LessonScalarWhereWithAggregatesInput>
    NOT?: Enumerable<LessonScalarWhereWithAggregatesInput>
    id?: IntWithAggregatesFilter | number
    title?: StringWithAggregatesFilter | string
    content?: StringWithAggregatesFilter | string
    videoUrl?: StringNullableWithAggregatesFilter | string | null
    duration?: IntNullableWithAggregatesFilter | number | null
    difficulty?: StringNullableWithAggregatesFilter | string | null
    topicId?: IntWithAggregatesFilter | number
  }

  export type CurriculumSubjectCreateInput = {
    name: string
    grade: number
    description?: string | null
    imageUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    topics?: TopicCreateNestedManyWithoutSubjectInput
  }

  export type CurriculumSubjectUncheckedCreateInput = {
    id?: number
    name: string
    grade: number
    description?: string | null
    imageUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    topics?: TopicUncheckedCreateNestedManyWithoutSubjectInput
  }

  export type CurriculumSubjectUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    grade?: IntFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    topics?: TopicUpdateManyWithoutSubjectNestedInput
  }

  export type CurriculumSubjectUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    grade?: IntFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    topics?: TopicUncheckedUpdateManyWithoutSubjectNestedInput
  }

  export type CurriculumSubjectCreateManyInput = {
    id?: number
    name: string
    grade: number
    description?: string | null
    imageUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CurriculumSubjectUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    grade?: IntFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CurriculumSubjectUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    grade?: IntFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TopicCreateInput = {
    title: string
    description?: string | null
    orderIndex: number
    subject: CurriculumSubjectCreateNestedOneWithoutTopicsInput
    lessons?: LessonCreateNestedManyWithoutTopicInput
  }

  export type TopicUncheckedCreateInput = {
    id?: number
    title: string
    description?: string | null
    subjectId: number
    orderIndex: number
    lessons?: LessonUncheckedCreateNestedManyWithoutTopicInput
  }

  export type TopicUpdateInput = {
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    orderIndex?: IntFieldUpdateOperationsInput | number
    subject?: CurriculumSubjectUpdateOneRequiredWithoutTopicsNestedInput
    lessons?: LessonUpdateManyWithoutTopicNestedInput
  }

  export type TopicUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    subjectId?: IntFieldUpdateOperationsInput | number
    orderIndex?: IntFieldUpdateOperationsInput | number
    lessons?: LessonUncheckedUpdateManyWithoutTopicNestedInput
  }

  export type TopicCreateManyInput = {
    id?: number
    title: string
    description?: string | null
    subjectId: number
    orderIndex: number
  }

  export type TopicUpdateManyMutationInput = {
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    orderIndex?: IntFieldUpdateOperationsInput | number
  }

  export type TopicUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    subjectId?: IntFieldUpdateOperationsInput | number
    orderIndex?: IntFieldUpdateOperationsInput | number
  }

  export type LessonCreateInput = {
    title: string
    content: string
    videoUrl?: string | null
    duration?: number | null
    difficulty?: string | null
    topic: TopicCreateNestedOneWithoutLessonsInput
  }

  export type LessonUncheckedCreateInput = {
    id?: number
    title: string
    content: string
    videoUrl?: string | null
    duration?: number | null
    difficulty?: string | null
    topicId: number
  }

  export type LessonUpdateInput = {
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    videoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    difficulty?: NullableStringFieldUpdateOperationsInput | string | null
    topic?: TopicUpdateOneRequiredWithoutLessonsNestedInput
  }

  export type LessonUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    videoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    difficulty?: NullableStringFieldUpdateOperationsInput | string | null
    topicId?: IntFieldUpdateOperationsInput | number
  }

  export type LessonCreateManyInput = {
    id?: number
    title: string
    content: string
    videoUrl?: string | null
    duration?: number | null
    difficulty?: string | null
    topicId: number
  }

  export type LessonUpdateManyMutationInput = {
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    videoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    difficulty?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type LessonUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    videoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    difficulty?: NullableStringFieldUpdateOperationsInput | string | null
    topicId?: IntFieldUpdateOperationsInput | number
  }

  export type IntFilter = {
    equals?: number
    in?: Enumerable<number> | number
    notIn?: Enumerable<number> | number
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntFilter | number
  }

  export type StringFilter = {
    equals?: string
    in?: Enumerable<string> | string
    notIn?: Enumerable<string> | string
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    mode?: QueryMode
    not?: NestedStringFilter | string
  }

  export type StringNullableFilter = {
    equals?: string | null
    in?: Enumerable<string> | string | null
    notIn?: Enumerable<string> | string | null
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    mode?: QueryMode
    not?: NestedStringNullableFilter | string | null
  }

  export type DateTimeFilter = {
    equals?: Date | string
    in?: Enumerable<Date> | Enumerable<string> | Date | string
    notIn?: Enumerable<Date> | Enumerable<string> | Date | string
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeFilter | Date | string
  }

  export type TopicListRelationFilter = {
    every?: TopicWhereInput
    some?: TopicWhereInput
    none?: TopicWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type TopicOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CurriculumSubjectNameGradeCompoundUniqueInput = {
    name: string
    grade: number
  }

  export type CurriculumSubjectCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    grade?: SortOrder
    description?: SortOrder
    imageUrl?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CurriculumSubjectAvgOrderByAggregateInput = {
    id?: SortOrder
    grade?: SortOrder
  }

  export type CurriculumSubjectMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    grade?: SortOrder
    description?: SortOrder
    imageUrl?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CurriculumSubjectMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    grade?: SortOrder
    description?: SortOrder
    imageUrl?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CurriculumSubjectSumOrderByAggregateInput = {
    id?: SortOrder
    grade?: SortOrder
  }

  export type IntWithAggregatesFilter = {
    equals?: number
    in?: Enumerable<number> | number
    notIn?: Enumerable<number> | number
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntWithAggregatesFilter | number
    _count?: NestedIntFilter
    _avg?: NestedFloatFilter
    _sum?: NestedIntFilter
    _min?: NestedIntFilter
    _max?: NestedIntFilter
  }

  export type StringWithAggregatesFilter = {
    equals?: string
    in?: Enumerable<string> | string
    notIn?: Enumerable<string> | string
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter | string
    _count?: NestedIntFilter
    _min?: NestedStringFilter
    _max?: NestedStringFilter
  }

  export type StringNullableWithAggregatesFilter = {
    equals?: string | null
    in?: Enumerable<string> | string | null
    notIn?: Enumerable<string> | string | null
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter | string | null
    _count?: NestedIntNullableFilter
    _min?: NestedStringNullableFilter
    _max?: NestedStringNullableFilter
  }

  export type DateTimeWithAggregatesFilter = {
    equals?: Date | string
    in?: Enumerable<Date> | Enumerable<string> | Date | string
    notIn?: Enumerable<Date> | Enumerable<string> | Date | string
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeWithAggregatesFilter | Date | string
    _count?: NestedIntFilter
    _min?: NestedDateTimeFilter
    _max?: NestedDateTimeFilter
  }

  export type CurriculumSubjectRelationFilter = {
    is?: CurriculumSubjectWhereInput | null
    isNot?: CurriculumSubjectWhereInput | null
  }

  export type LessonListRelationFilter = {
    every?: LessonWhereInput
    some?: LessonWhereInput
    none?: LessonWhereInput
  }

  export type LessonOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TopicCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    subjectId?: SortOrder
    orderIndex?: SortOrder
  }

  export type TopicAvgOrderByAggregateInput = {
    id?: SortOrder
    subjectId?: SortOrder
    orderIndex?: SortOrder
  }

  export type TopicMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    subjectId?: SortOrder
    orderIndex?: SortOrder
  }

  export type TopicMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    subjectId?: SortOrder
    orderIndex?: SortOrder
  }

  export type TopicSumOrderByAggregateInput = {
    id?: SortOrder
    subjectId?: SortOrder
    orderIndex?: SortOrder
  }

  export type IntNullableFilter = {
    equals?: number | null
    in?: Enumerable<number> | number | null
    notIn?: Enumerable<number> | number | null
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntNullableFilter | number | null
  }

  export type TopicRelationFilter = {
    is?: TopicWhereInput | null
    isNot?: TopicWhereInput | null
  }

  export type LessonCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    content?: SortOrder
    videoUrl?: SortOrder
    duration?: SortOrder
    difficulty?: SortOrder
    topicId?: SortOrder
  }

  export type LessonAvgOrderByAggregateInput = {
    id?: SortOrder
    duration?: SortOrder
    topicId?: SortOrder
  }

  export type LessonMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    content?: SortOrder
    videoUrl?: SortOrder
    duration?: SortOrder
    difficulty?: SortOrder
    topicId?: SortOrder
  }

  export type LessonMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    content?: SortOrder
    videoUrl?: SortOrder
    duration?: SortOrder
    difficulty?: SortOrder
    topicId?: SortOrder
  }

  export type LessonSumOrderByAggregateInput = {
    id?: SortOrder
    duration?: SortOrder
    topicId?: SortOrder
  }

  export type IntNullableWithAggregatesFilter = {
    equals?: number | null
    in?: Enumerable<number> | number | null
    notIn?: Enumerable<number> | number | null
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntNullableWithAggregatesFilter | number | null
    _count?: NestedIntNullableFilter
    _avg?: NestedFloatNullableFilter
    _sum?: NestedIntNullableFilter
    _min?: NestedIntNullableFilter
    _max?: NestedIntNullableFilter
  }

  export type TopicCreateNestedManyWithoutSubjectInput = {
    create?: XOR<Enumerable<TopicCreateWithoutSubjectInput>, Enumerable<TopicUncheckedCreateWithoutSubjectInput>>
    connectOrCreate?: Enumerable<TopicCreateOrConnectWithoutSubjectInput>
    createMany?: TopicCreateManySubjectInputEnvelope
    connect?: Enumerable<TopicWhereUniqueInput>
  }

  export type TopicUncheckedCreateNestedManyWithoutSubjectInput = {
    create?: XOR<Enumerable<TopicCreateWithoutSubjectInput>, Enumerable<TopicUncheckedCreateWithoutSubjectInput>>
    connectOrCreate?: Enumerable<TopicCreateOrConnectWithoutSubjectInput>
    createMany?: TopicCreateManySubjectInputEnvelope
    connect?: Enumerable<TopicWhereUniqueInput>
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type TopicUpdateManyWithoutSubjectNestedInput = {
    create?: XOR<Enumerable<TopicCreateWithoutSubjectInput>, Enumerable<TopicUncheckedCreateWithoutSubjectInput>>
    connectOrCreate?: Enumerable<TopicCreateOrConnectWithoutSubjectInput>
    upsert?: Enumerable<TopicUpsertWithWhereUniqueWithoutSubjectInput>
    createMany?: TopicCreateManySubjectInputEnvelope
    set?: Enumerable<TopicWhereUniqueInput>
    disconnect?: Enumerable<TopicWhereUniqueInput>
    delete?: Enumerable<TopicWhereUniqueInput>
    connect?: Enumerable<TopicWhereUniqueInput>
    update?: Enumerable<TopicUpdateWithWhereUniqueWithoutSubjectInput>
    updateMany?: Enumerable<TopicUpdateManyWithWhereWithoutSubjectInput>
    deleteMany?: Enumerable<TopicScalarWhereInput>
  }

  export type TopicUncheckedUpdateManyWithoutSubjectNestedInput = {
    create?: XOR<Enumerable<TopicCreateWithoutSubjectInput>, Enumerable<TopicUncheckedCreateWithoutSubjectInput>>
    connectOrCreate?: Enumerable<TopicCreateOrConnectWithoutSubjectInput>
    upsert?: Enumerable<TopicUpsertWithWhereUniqueWithoutSubjectInput>
    createMany?: TopicCreateManySubjectInputEnvelope
    set?: Enumerable<TopicWhereUniqueInput>
    disconnect?: Enumerable<TopicWhereUniqueInput>
    delete?: Enumerable<TopicWhereUniqueInput>
    connect?: Enumerable<TopicWhereUniqueInput>
    update?: Enumerable<TopicUpdateWithWhereUniqueWithoutSubjectInput>
    updateMany?: Enumerable<TopicUpdateManyWithWhereWithoutSubjectInput>
    deleteMany?: Enumerable<TopicScalarWhereInput>
  }

  export type CurriculumSubjectCreateNestedOneWithoutTopicsInput = {
    create?: XOR<CurriculumSubjectCreateWithoutTopicsInput, CurriculumSubjectUncheckedCreateWithoutTopicsInput>
    connectOrCreate?: CurriculumSubjectCreateOrConnectWithoutTopicsInput
    connect?: CurriculumSubjectWhereUniqueInput
  }

  export type LessonCreateNestedManyWithoutTopicInput = {
    create?: XOR<Enumerable<LessonCreateWithoutTopicInput>, Enumerable<LessonUncheckedCreateWithoutTopicInput>>
    connectOrCreate?: Enumerable<LessonCreateOrConnectWithoutTopicInput>
    createMany?: LessonCreateManyTopicInputEnvelope
    connect?: Enumerable<LessonWhereUniqueInput>
  }

  export type LessonUncheckedCreateNestedManyWithoutTopicInput = {
    create?: XOR<Enumerable<LessonCreateWithoutTopicInput>, Enumerable<LessonUncheckedCreateWithoutTopicInput>>
    connectOrCreate?: Enumerable<LessonCreateOrConnectWithoutTopicInput>
    createMany?: LessonCreateManyTopicInputEnvelope
    connect?: Enumerable<LessonWhereUniqueInput>
  }

  export type CurriculumSubjectUpdateOneRequiredWithoutTopicsNestedInput = {
    create?: XOR<CurriculumSubjectCreateWithoutTopicsInput, CurriculumSubjectUncheckedCreateWithoutTopicsInput>
    connectOrCreate?: CurriculumSubjectCreateOrConnectWithoutTopicsInput
    upsert?: CurriculumSubjectUpsertWithoutTopicsInput
    connect?: CurriculumSubjectWhereUniqueInput
    update?: XOR<CurriculumSubjectUpdateWithoutTopicsInput, CurriculumSubjectUncheckedUpdateWithoutTopicsInput>
  }

  export type LessonUpdateManyWithoutTopicNestedInput = {
    create?: XOR<Enumerable<LessonCreateWithoutTopicInput>, Enumerable<LessonUncheckedCreateWithoutTopicInput>>
    connectOrCreate?: Enumerable<LessonCreateOrConnectWithoutTopicInput>
    upsert?: Enumerable<LessonUpsertWithWhereUniqueWithoutTopicInput>
    createMany?: LessonCreateManyTopicInputEnvelope
    set?: Enumerable<LessonWhereUniqueInput>
    disconnect?: Enumerable<LessonWhereUniqueInput>
    delete?: Enumerable<LessonWhereUniqueInput>
    connect?: Enumerable<LessonWhereUniqueInput>
    update?: Enumerable<LessonUpdateWithWhereUniqueWithoutTopicInput>
    updateMany?: Enumerable<LessonUpdateManyWithWhereWithoutTopicInput>
    deleteMany?: Enumerable<LessonScalarWhereInput>
  }

  export type LessonUncheckedUpdateManyWithoutTopicNestedInput = {
    create?: XOR<Enumerable<LessonCreateWithoutTopicInput>, Enumerable<LessonUncheckedCreateWithoutTopicInput>>
    connectOrCreate?: Enumerable<LessonCreateOrConnectWithoutTopicInput>
    upsert?: Enumerable<LessonUpsertWithWhereUniqueWithoutTopicInput>
    createMany?: LessonCreateManyTopicInputEnvelope
    set?: Enumerable<LessonWhereUniqueInput>
    disconnect?: Enumerable<LessonWhereUniqueInput>
    delete?: Enumerable<LessonWhereUniqueInput>
    connect?: Enumerable<LessonWhereUniqueInput>
    update?: Enumerable<LessonUpdateWithWhereUniqueWithoutTopicInput>
    updateMany?: Enumerable<LessonUpdateManyWithWhereWithoutTopicInput>
    deleteMany?: Enumerable<LessonScalarWhereInput>
  }

  export type TopicCreateNestedOneWithoutLessonsInput = {
    create?: XOR<TopicCreateWithoutLessonsInput, TopicUncheckedCreateWithoutLessonsInput>
    connectOrCreate?: TopicCreateOrConnectWithoutLessonsInput
    connect?: TopicWhereUniqueInput
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type TopicUpdateOneRequiredWithoutLessonsNestedInput = {
    create?: XOR<TopicCreateWithoutLessonsInput, TopicUncheckedCreateWithoutLessonsInput>
    connectOrCreate?: TopicCreateOrConnectWithoutLessonsInput
    upsert?: TopicUpsertWithoutLessonsInput
    connect?: TopicWhereUniqueInput
    update?: XOR<TopicUpdateWithoutLessonsInput, TopicUncheckedUpdateWithoutLessonsInput>
  }

  export type NestedIntFilter = {
    equals?: number
    in?: Enumerable<number> | number
    notIn?: Enumerable<number> | number
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntFilter | number
  }

  export type NestedStringFilter = {
    equals?: string
    in?: Enumerable<string> | string
    notIn?: Enumerable<string> | string
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringFilter | string
  }

  export type NestedStringNullableFilter = {
    equals?: string | null
    in?: Enumerable<string> | string | null
    notIn?: Enumerable<string> | string | null
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringNullableFilter | string | null
  }

  export type NestedDateTimeFilter = {
    equals?: Date | string
    in?: Enumerable<Date> | Enumerable<string> | Date | string
    notIn?: Enumerable<Date> | Enumerable<string> | Date | string
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeFilter | Date | string
  }

  export type NestedIntWithAggregatesFilter = {
    equals?: number
    in?: Enumerable<number> | number
    notIn?: Enumerable<number> | number
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntWithAggregatesFilter | number
    _count?: NestedIntFilter
    _avg?: NestedFloatFilter
    _sum?: NestedIntFilter
    _min?: NestedIntFilter
    _max?: NestedIntFilter
  }

  export type NestedFloatFilter = {
    equals?: number
    in?: Enumerable<number> | number
    notIn?: Enumerable<number> | number
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedFloatFilter | number
  }

  export type NestedStringWithAggregatesFilter = {
    equals?: string
    in?: Enumerable<string> | string
    notIn?: Enumerable<string> | string
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringWithAggregatesFilter | string
    _count?: NestedIntFilter
    _min?: NestedStringFilter
    _max?: NestedStringFilter
  }

  export type NestedStringNullableWithAggregatesFilter = {
    equals?: string | null
    in?: Enumerable<string> | string | null
    notIn?: Enumerable<string> | string | null
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringNullableWithAggregatesFilter | string | null
    _count?: NestedIntNullableFilter
    _min?: NestedStringNullableFilter
    _max?: NestedStringNullableFilter
  }

  export type NestedIntNullableFilter = {
    equals?: number | null
    in?: Enumerable<number> | number | null
    notIn?: Enumerable<number> | number | null
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntNullableFilter | number | null
  }

  export type NestedDateTimeWithAggregatesFilter = {
    equals?: Date | string
    in?: Enumerable<Date> | Enumerable<string> | Date | string
    notIn?: Enumerable<Date> | Enumerable<string> | Date | string
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeWithAggregatesFilter | Date | string
    _count?: NestedIntFilter
    _min?: NestedDateTimeFilter
    _max?: NestedDateTimeFilter
  }

  export type NestedIntNullableWithAggregatesFilter = {
    equals?: number | null
    in?: Enumerable<number> | number | null
    notIn?: Enumerable<number> | number | null
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntNullableWithAggregatesFilter | number | null
    _count?: NestedIntNullableFilter
    _avg?: NestedFloatNullableFilter
    _sum?: NestedIntNullableFilter
    _min?: NestedIntNullableFilter
    _max?: NestedIntNullableFilter
  }

  export type NestedFloatNullableFilter = {
    equals?: number | null
    in?: Enumerable<number> | number | null
    notIn?: Enumerable<number> | number | null
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedFloatNullableFilter | number | null
  }

  export type TopicCreateWithoutSubjectInput = {
    title: string
    description?: string | null
    orderIndex: number
    lessons?: LessonCreateNestedManyWithoutTopicInput
  }

  export type TopicUncheckedCreateWithoutSubjectInput = {
    id?: number
    title: string
    description?: string | null
    orderIndex: number
    lessons?: LessonUncheckedCreateNestedManyWithoutTopicInput
  }

  export type TopicCreateOrConnectWithoutSubjectInput = {
    where: TopicWhereUniqueInput
    create: XOR<TopicCreateWithoutSubjectInput, TopicUncheckedCreateWithoutSubjectInput>
  }

  export type TopicCreateManySubjectInputEnvelope = {
    data: Enumerable<TopicCreateManySubjectInput>
    skipDuplicates?: boolean
  }

  export type TopicUpsertWithWhereUniqueWithoutSubjectInput = {
    where: TopicWhereUniqueInput
    update: XOR<TopicUpdateWithoutSubjectInput, TopicUncheckedUpdateWithoutSubjectInput>
    create: XOR<TopicCreateWithoutSubjectInput, TopicUncheckedCreateWithoutSubjectInput>
  }

  export type TopicUpdateWithWhereUniqueWithoutSubjectInput = {
    where: TopicWhereUniqueInput
    data: XOR<TopicUpdateWithoutSubjectInput, TopicUncheckedUpdateWithoutSubjectInput>
  }

  export type TopicUpdateManyWithWhereWithoutSubjectInput = {
    where: TopicScalarWhereInput
    data: XOR<TopicUpdateManyMutationInput, TopicUncheckedUpdateManyWithoutTopicsInput>
  }

  export type TopicScalarWhereInput = {
    AND?: Enumerable<TopicScalarWhereInput>
    OR?: Enumerable<TopicScalarWhereInput>
    NOT?: Enumerable<TopicScalarWhereInput>
    id?: IntFilter | number
    title?: StringFilter | string
    description?: StringNullableFilter | string | null
    subjectId?: IntFilter | number
    orderIndex?: IntFilter | number
  }

  export type CurriculumSubjectCreateWithoutTopicsInput = {
    name: string
    grade: number
    description?: string | null
    imageUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CurriculumSubjectUncheckedCreateWithoutTopicsInput = {
    id?: number
    name: string
    grade: number
    description?: string | null
    imageUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CurriculumSubjectCreateOrConnectWithoutTopicsInput = {
    where: CurriculumSubjectWhereUniqueInput
    create: XOR<CurriculumSubjectCreateWithoutTopicsInput, CurriculumSubjectUncheckedCreateWithoutTopicsInput>
  }

  export type LessonCreateWithoutTopicInput = {
    title: string
    content: string
    videoUrl?: string | null
    duration?: number | null
    difficulty?: string | null
  }

  export type LessonUncheckedCreateWithoutTopicInput = {
    id?: number
    title: string
    content: string
    videoUrl?: string | null
    duration?: number | null
    difficulty?: string | null
  }

  export type LessonCreateOrConnectWithoutTopicInput = {
    where: LessonWhereUniqueInput
    create: XOR<LessonCreateWithoutTopicInput, LessonUncheckedCreateWithoutTopicInput>
  }

  export type LessonCreateManyTopicInputEnvelope = {
    data: Enumerable<LessonCreateManyTopicInput>
    skipDuplicates?: boolean
  }

  export type CurriculumSubjectUpsertWithoutTopicsInput = {
    update: XOR<CurriculumSubjectUpdateWithoutTopicsInput, CurriculumSubjectUncheckedUpdateWithoutTopicsInput>
    create: XOR<CurriculumSubjectCreateWithoutTopicsInput, CurriculumSubjectUncheckedCreateWithoutTopicsInput>
  }

  export type CurriculumSubjectUpdateWithoutTopicsInput = {
    name?: StringFieldUpdateOperationsInput | string
    grade?: IntFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CurriculumSubjectUncheckedUpdateWithoutTopicsInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    grade?: IntFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LessonUpsertWithWhereUniqueWithoutTopicInput = {
    where: LessonWhereUniqueInput
    update: XOR<LessonUpdateWithoutTopicInput, LessonUncheckedUpdateWithoutTopicInput>
    create: XOR<LessonCreateWithoutTopicInput, LessonUncheckedCreateWithoutTopicInput>
  }

  export type LessonUpdateWithWhereUniqueWithoutTopicInput = {
    where: LessonWhereUniqueInput
    data: XOR<LessonUpdateWithoutTopicInput, LessonUncheckedUpdateWithoutTopicInput>
  }

  export type LessonUpdateManyWithWhereWithoutTopicInput = {
    where: LessonScalarWhereInput
    data: XOR<LessonUpdateManyMutationInput, LessonUncheckedUpdateManyWithoutLessonsInput>
  }

  export type LessonScalarWhereInput = {
    AND?: Enumerable<LessonScalarWhereInput>
    OR?: Enumerable<LessonScalarWhereInput>
    NOT?: Enumerable<LessonScalarWhereInput>
    id?: IntFilter | number
    title?: StringFilter | string
    content?: StringFilter | string
    videoUrl?: StringNullableFilter | string | null
    duration?: IntNullableFilter | number | null
    difficulty?: StringNullableFilter | string | null
    topicId?: IntFilter | number
  }

  export type TopicCreateWithoutLessonsInput = {
    title: string
    description?: string | null
    orderIndex: number
    subject: CurriculumSubjectCreateNestedOneWithoutTopicsInput
  }

  export type TopicUncheckedCreateWithoutLessonsInput = {
    id?: number
    title: string
    description?: string | null
    subjectId: number
    orderIndex: number
  }

  export type TopicCreateOrConnectWithoutLessonsInput = {
    where: TopicWhereUniqueInput
    create: XOR<TopicCreateWithoutLessonsInput, TopicUncheckedCreateWithoutLessonsInput>
  }

  export type TopicUpsertWithoutLessonsInput = {
    update: XOR<TopicUpdateWithoutLessonsInput, TopicUncheckedUpdateWithoutLessonsInput>
    create: XOR<TopicCreateWithoutLessonsInput, TopicUncheckedCreateWithoutLessonsInput>
  }

  export type TopicUpdateWithoutLessonsInput = {
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    orderIndex?: IntFieldUpdateOperationsInput | number
    subject?: CurriculumSubjectUpdateOneRequiredWithoutTopicsNestedInput
  }

  export type TopicUncheckedUpdateWithoutLessonsInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    subjectId?: IntFieldUpdateOperationsInput | number
    orderIndex?: IntFieldUpdateOperationsInput | number
  }

  export type TopicCreateManySubjectInput = {
    id?: number
    title: string
    description?: string | null
    orderIndex: number
  }

  export type TopicUpdateWithoutSubjectInput = {
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    orderIndex?: IntFieldUpdateOperationsInput | number
    lessons?: LessonUpdateManyWithoutTopicNestedInput
  }

  export type TopicUncheckedUpdateWithoutSubjectInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    orderIndex?: IntFieldUpdateOperationsInput | number
    lessons?: LessonUncheckedUpdateManyWithoutTopicNestedInput
  }

  export type TopicUncheckedUpdateManyWithoutTopicsInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    orderIndex?: IntFieldUpdateOperationsInput | number
  }

  export type LessonCreateManyTopicInput = {
    id?: number
    title: string
    content: string
    videoUrl?: string | null
    duration?: number | null
    difficulty?: string | null
  }

  export type LessonUpdateWithoutTopicInput = {
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    videoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    difficulty?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type LessonUncheckedUpdateWithoutTopicInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    videoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    difficulty?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type LessonUncheckedUpdateManyWithoutLessonsInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    videoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    difficulty?: NullableStringFieldUpdateOperationsInput | string | null
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}