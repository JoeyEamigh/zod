import * as z from "./base.ts";
// import { ZodUndefined } from './undefined';
// import { ZodNull } from './null';
// import { ZodUnion } from './union';

export interface ZodTransformerDef<T extends z.ZodTypeAny = z.ZodTypeAny>
  extends z.ZodTypeDef {
  t: z.ZodTypes.transformer;
  schema: T;
  // transforms: (arg: T["_output"]) => U["_input"];
}

export class ZodTransformer<
  T extends z.ZodTypeAny,
  Output = T["_type"]
> extends z.ZodType<Output, ZodTransformerDef<T>, T["_input"]> {
  toJSON = () => ({
    t: this._def.t,
    schema: this._def.schema.toJSON(),
  });

  /** You can't use the .default method on transformers! */
  default = ((..._args: any[]) => this) as never;

  // static create = <I extends z.ZodTypeAny, O extends z.ZodTypeAny, Out>(
  static create = <I extends z.ZodTypeAny>(
    schema: I
    // outputSchema?: O,
    // tx?: (arg: I["_output"]) => Out | Promise<Out>
  ): ZodTransformer<I, I["_output"]> => {
    // if (schema instanceof ZodTransformer) {
    //   throw new Error("Can't nest transformers inside each other.");
    // }
    const newTx = new ZodTransformer({
      t: z.ZodTypes.transformer,
      schema,
    });

    // if (outputSchema && tx) {
    //   console.warn(
    //     `Calling z.transform() with three arguments is deprecated and not recommended.`
    //   );
    //   newTx = newTx.transform(tx).transform((val) => outputSchema.parse);
    // }
    return newTx;
  };

  // mod: <NewOut>(
  //   arg: (curr: Output) => NewOut | Promise<NewOut>
  // ) => ZodTransformer<T, NewOut> = (arg) => {
  //   return this.mod(arg);
  // };
}