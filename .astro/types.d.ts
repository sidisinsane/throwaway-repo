declare module 'astro:content' {
	interface Render {
		'.mdx': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	interface Render {
		'.md': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	export { z } from 'astro/zod';

	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;
	export type CollectionEntry<C extends keyof AnyEntryMap> = Flatten<AnyEntryMap[C]>;

	// TODO: Remove this when having this fallback is no longer relevant. 2.3? 3.0? - erika, 2023-04-04
	/**
	 * @deprecated
	 * `astro:content` no longer provide `image()`.
	 *
	 * Please use it through `schema`, like such:
	 * ```ts
	 * import { defineCollection, z } from "astro:content";
	 *
	 * defineCollection({
	 *   schema: ({ image }) =>
	 *     z.object({
	 *       image: image(),
	 *     }),
	 * });
	 * ```
	 */
	export const image: never;

	// This needs to be in sync with ImageMetadata
	export type ImageFunction = () => import('astro/zod').ZodObject<{
		src: import('astro/zod').ZodString;
		width: import('astro/zod').ZodNumber;
		height: import('astro/zod').ZodNumber;
		format: import('astro/zod').ZodUnion<
			[
				import('astro/zod').ZodLiteral<'png'>,
				import('astro/zod').ZodLiteral<'jpg'>,
				import('astro/zod').ZodLiteral<'jpeg'>,
				import('astro/zod').ZodLiteral<'tiff'>,
				import('astro/zod').ZodLiteral<'webp'>,
				import('astro/zod').ZodLiteral<'gif'>,
				import('astro/zod').ZodLiteral<'svg'>
			]
		>;
	}>;

	type BaseSchemaWithoutEffects =
		| import('astro/zod').AnyZodObject
		| import('astro/zod').ZodUnion<[BaseSchemaWithoutEffects, ...BaseSchemaWithoutEffects[]]>
		| import('astro/zod').ZodDiscriminatedUnion<string, import('astro/zod').AnyZodObject[]>
		| import('astro/zod').ZodIntersection<BaseSchemaWithoutEffects, BaseSchemaWithoutEffects>;

	type BaseSchema =
		| BaseSchemaWithoutEffects
		| import('astro/zod').ZodEffects<BaseSchemaWithoutEffects>;

	export type SchemaContext = { image: ImageFunction };

	type DataCollectionConfig<S extends BaseSchema> = {
		type: 'data';
		schema?: S | ((context: SchemaContext) => S);
	};

	type ContentCollectionConfig<S extends BaseSchema> = {
		type?: 'content';
		schema?: S | ((context: SchemaContext) => S);
	};

	type CollectionConfig<S> = ContentCollectionConfig<S> | DataCollectionConfig<S>;

	export function defineCollection<S extends BaseSchema>(
		input: CollectionConfig<S>
	): CollectionConfig<S>;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {})
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {})
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {})
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {})
	>(
		collection: C,
		slug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {})
	>(
		collection: C,
		id: E
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[]
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[]
	): Promise<CollectionEntry<C>[]>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
			  }
			: {
					collection: C;
					id: keyof DataEntryMap[C];
			  }
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"authors": {
"danilowoz.mdx": {
	id: "danilowoz.mdx";
  slug: "danilowoz";
  body: string;
  collection: "authors";
  data: InferEntrySchema<"authors">
} & { render(): Render[".mdx"] };
"dudleystorey.mdx": {
	id: "dudleystorey.mdx";
  slug: "dudleystorey";
  body: string;
  collection: "authors";
  data: InferEntrySchema<"authors">
} & { render(): Render[".mdx"] };
"jhey.mdx": {
	id: "jhey.mdx";
  slug: "jhey";
  body: string;
  collection: "authors";
  data: InferEntrySchema<"authors">
} & { render(): Render[".mdx"] };
"ludvikherrera.mdx": {
	id: "ludvikherrera.mdx";
  slug: "ludvikherrera";
  body: string;
  collection: "authors";
  data: InferEntrySchema<"authors">
} & { render(): Render[".mdx"] };
"sidisinsane.mdx": {
	id: "sidisinsane.mdx";
  slug: "sidisinsane";
  body: string;
  collection: "authors";
  data: InferEntrySchema<"authors">
} & { render(): Render[".mdx"] };
"sitepoint.mdx": {
	id: "sitepoint.mdx";
  slug: "sitepoint";
  body: string;
  collection: "authors";
  data: InferEntrySchema<"authors">
} & { render(): Render[".mdx"] };
"tobiasahlin.mdx": {
	id: "tobiasahlin.mdx";
  slug: "tobiasahlin";
  body: string;
  collection: "authors";
  data: InferEntrySchema<"authors">
} & { render(): Render[".mdx"] };
};
"snippets": {
"Animated Line Navigation.md": {
	id: "Animated Line Navigation.md";
  slug: "animated-line-navigation";
  body: string;
  collection: "snippets";
  data: InferEntrySchema<"snippets">
} & { render(): Render[".md"] };
"Background Sliding Animation.md": {
	id: "Background Sliding Animation.md";
  slug: "background-sliding-animation";
  body: string;
  collection: "snippets";
  data: InferEntrySchema<"snippets">
} & { render(): Render[".md"] };
"Flag Emojis.md": {
	id: "Flag Emojis.md";
  slug: "flag-emojis";
  body: string;
  collection: "snippets";
  data: InferEntrySchema<"snippets">
} & { render(): Render[".md"] };
"Font Cairo.md": {
	id: "Font Cairo.md";
  slug: "font-cairo";
  body: string;
  collection: "snippets";
  data: InferEntrySchema<"snippets">
} & { render(): Render[".md"] };
"Font Maven Pro.md": {
	id: "Font Maven Pro.md";
  slug: "font-maven-pro";
  body: string;
  collection: "snippets";
  data: InferEntrySchema<"snippets">
} & { render(): Render[".md"] };
"Font Montserrat.md": {
	id: "Font Montserrat.md";
  slug: "font-montserrat";
  body: string;
  collection: "snippets";
  data: InferEntrySchema<"snippets">
} & { render(): Render[".md"] };
"Maintainable Footnotes.md": {
	id: "Maintainable Footnotes.md";
  slug: "maintainable-footnotes";
  body: string;
  collection: "snippets";
  data: InferEntrySchema<"snippets">
} & { render(): Render[".md"] };
"Motion Blur.md": {
	id: "Motion Blur.md";
  slug: "motion-blur";
  body: string;
  collection: "snippets";
  data: InferEntrySchema<"snippets">
} & { render(): Render[".md"] };
"Multiline Truncation.md": {
	id: "Multiline Truncation.md";
  slug: "multiline-truncation";
  body: string;
  collection: "snippets";
  data: InferEntrySchema<"snippets">
} & { render(): Render[".md"] };
"Multiline Underline Animation.md": {
	id: "Multiline Underline Animation.md";
  slug: "multiline-underline-animation";
  body: string;
  collection: "snippets";
  data: InferEntrySchema<"snippets">
} & { render(): Render[".md"] };
"No Widows, No Orphans.md": {
	id: "No Widows, No Orphans.md";
  slug: "no-widows-no-orphans";
  body: string;
  collection: "snippets";
  data: InferEntrySchema<"snippets">
} & { render(): Render[".md"] };
"Page Scroll Progress Indicator.md": {
	id: "Page Scroll Progress Indicator.md";
  slug: "page-scroll-progress-indicator";
  body: string;
  collection: "snippets";
  data: InferEntrySchema<"snippets">
} & { render(): Render[".md"] };
"Responsive Type.md": {
	id: "Responsive Type.md";
  slug: "responsive-type";
  body: string;
  collection: "snippets";
  data: InferEntrySchema<"snippets">
} & { render(): Render[".md"] };
"SVG Hover Map Africa.md": {
	id: "SVG Hover Map Africa.md";
  slug: "svg-hover-map-africa";
  body: string;
  collection: "snippets";
  data: InferEntrySchema<"snippets">
} & { render(): Render[".md"] };
"SVG Hover Map China.md": {
	id: "SVG Hover Map China.md";
  slug: "svg-hover-map-china";
  body: string;
  collection: "snippets";
  data: InferEntrySchema<"snippets">
} & { render(): Render[".md"] };
"SVG Hover Map Europe.md": {
	id: "SVG Hover Map Europe.md";
  slug: "svg-hover-map-europe";
  body: string;
  collection: "snippets";
  data: InferEntrySchema<"snippets">
} & { render(): Render[".md"] };
"SVG Hover Map Germany Russia.md": {
	id: "SVG Hover Map Germany Russia.md";
  slug: "svg-hover-map-germany-russia";
  body: string;
  collection: "snippets";
  data: InferEntrySchema<"snippets">
} & { render(): Render[".md"] };
"SVG Hover Map Germany.md": {
	id: "SVG Hover Map Germany.md";
  slug: "svg-hover-map-germany";
  body: string;
  collection: "snippets";
  data: InferEntrySchema<"snippets">
} & { render(): Render[".md"] };
"SVG Hover Map Russia.md": {
	id: "SVG Hover Map Russia.md";
  slug: "svg-hover-map-russia";
  body: string;
  collection: "snippets";
  data: InferEntrySchema<"snippets">
} & { render(): Render[".md"] };
"SVG Hover Map United Kingdom.md": {
	id: "SVG Hover Map United Kingdom.md";
  slug: "svg-hover-map-united-kingdom";
  body: string;
  collection: "snippets";
  data: InferEntrySchema<"snippets">
} & { render(): Render[".md"] };
"SVG Hover Map United States.md": {
	id: "SVG Hover Map United States.md";
  slug: "svg-hover-map-united-states";
  body: string;
  collection: "snippets";
  data: InferEntrySchema<"snippets">
} & { render(): Render[".md"] };
"SVG Hover Map World.md": {
	id: "SVG Hover Map World.md";
  slug: "svg-hover-map-world";
  body: string;
  collection: "snippets";
  data: InferEntrySchema<"snippets">
} & { render(): Render[".md"] };
"Signage.md": {
	id: "Signage.md";
  slug: "signage";
  body: string;
  collection: "snippets";
  data: InferEntrySchema<"snippets">
} & { render(): Render[".md"] };
"Slider Carousel.md": {
	id: "Slider Carousel.md";
  slug: "slider-carousel";
  body: string;
  collection: "snippets";
  data: InferEntrySchema<"snippets">
} & { render(): Render[".md"] };
"Squircle.md": {
	id: "Squircle.md";
  slug: "squircle";
  body: string;
  collection: "snippets";
  data: InferEntrySchema<"snippets">
} & { render(): Render[".md"] };
"Text Effects.md": {
	id: "Text Effects.md";
  slug: "text-effects";
  body: string;
  collection: "snippets";
  data: InferEntrySchema<"snippets">
} & { render(): Render[".md"] };
"Tooltip.md": {
	id: "Tooltip.md";
  slug: "tooltip";
  body: string;
  collection: "snippets";
  data: InferEntrySchema<"snippets">
} & { render(): Render[".md"] };
};
"udhr": {
"udhr-aa.md": {
	id: "udhr-aa.md";
  slug: "udhr-aa";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-ab.md": {
	id: "udhr-ab.md";
  slug: "udhr-ab";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-ace.md": {
	id: "udhr-ace.md";
  slug: "udhr-ace";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-acu.md": {
	id: "udhr-acu.md";
  slug: "udhr-acu";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-ada.md": {
	id: "udhr-ada.md";
  slug: "udhr-ada";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-ady.md": {
	id: "udhr-ady.md";
  slug: "udhr-ady";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-af.md": {
	id: "udhr-af.md";
  slug: "udhr-af";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-agr.md": {
	id: "udhr-agr.md";
  slug: "udhr-agr";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-aii.md": {
	id: "udhr-aii.md";
  slug: "udhr-aii";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-ajg.md": {
	id: "udhr-ajg.md";
  slug: "udhr-ajg";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-ak-akuapem.md": {
	id: "udhr-ak-akuapem.md";
  slug: "udhr-ak-akuapem";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-ak-asante.md": {
	id: "udhr-ak-asante.md";
  slug: "udhr-ak-asante";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-ak.md": {
	id: "udhr-ak.md";
  slug: "udhr-ak";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-als.md": {
	id: "udhr-als.md";
  slug: "udhr-als";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-alt.md": {
	id: "udhr-alt.md";
  slug: "udhr-alt";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-am.md": {
	id: "udhr-am.md";
  slug: "udhr-am";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-amc.md": {
	id: "udhr-amc.md";
  slug: "udhr-amc";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-ame.md": {
	id: "udhr-ame.md";
  slug: "udhr-ame";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-ami.md": {
	id: "udhr-ami.md";
  slug: "udhr-ami";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-amr.md": {
	id: "udhr-amr.md";
  slug: "udhr-amr";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-ar.md": {
	id: "udhr-ar.md";
  slug: "udhr-ar";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-arl.md": {
	id: "udhr-arl.md";
  slug: "udhr-arl";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-arn.md": {
	id: "udhr-arn.md";
  slug: "udhr-arn";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-ast.md": {
	id: "udhr-ast.md";
  slug: "udhr-ast";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-auc.md": {
	id: "udhr-auc.md";
  slug: "udhr-auc";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-ay.md": {
	id: "udhr-ay.md";
  slug: "udhr-ay";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-az-Cyrl.md": {
	id: "udhr-az-Cyrl.md";
  slug: "udhr-az-cyrl";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-az-Latn.md": {
	id: "udhr-az-Latn.md";
  slug: "udhr-az-latn";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-azb.md": {
	id: "udhr-azb.md";
  slug: "udhr-azb";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-ban.md": {
	id: "udhr-ban.md";
  slug: "udhr-ban";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-bax.md": {
	id: "udhr-bax.md";
  slug: "udhr-bax";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-bba.md": {
	id: "udhr-bba.md";
  slug: "udhr-bba";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-bci.md": {
	id: "udhr-bci.md";
  slug: "udhr-bci";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-be.md": {
	id: "udhr-be.md";
  slug: "udhr-be";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-bem.md": {
	id: "udhr-bem.md";
  slug: "udhr-bem";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-bfa.md": {
	id: "udhr-bfa.md";
  slug: "udhr-bfa";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-bg.md": {
	id: "udhr-bg.md";
  slug: "udhr-bg";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-bho.md": {
	id: "udhr-bho.md";
  slug: "udhr-bho";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-bi.md": {
	id: "udhr-bi.md";
  slug: "udhr-bi";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-bik.md": {
	id: "udhr-bik.md";
  slug: "udhr-bik";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-bin.md": {
	id: "udhr-bin.md";
  slug: "udhr-bin";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-blt.md": {
	id: "udhr-blt.md";
  slug: "udhr-blt";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-bm.md": {
	id: "udhr-bm.md";
  slug: "udhr-bm";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-bn.md": {
	id: "udhr-bn.md";
  slug: "udhr-bn";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-bo.md": {
	id: "udhr-bo.md";
  slug: "udhr-bo";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-boa.md": {
	id: "udhr-boa.md";
  slug: "udhr-boa";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-br.md": {
	id: "udhr-br.md";
  slug: "udhr-br";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-bs-Cyrl.md": {
	id: "udhr-bs-Cyrl.md";
  slug: "udhr-bs-cyrl";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-bs-Latn.md": {
	id: "udhr-bs-Latn.md";
  slug: "udhr-bs-latn";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-buc.md": {
	id: "udhr-buc.md";
  slug: "udhr-buc";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-bug.md": {
	id: "udhr-bug.md";
  slug: "udhr-bug";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-bum.md": {
	id: "udhr-bum.md";
  slug: "udhr-bum";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-ca.md": {
	id: "udhr-ca.md";
  slug: "udhr-ca";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-cab.md": {
	id: "udhr-cab.md";
  slug: "udhr-cab";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-cak.md": {
	id: "udhr-cak.md";
  slug: "udhr-cak";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-cbi.md": {
	id: "udhr-cbi.md";
  slug: "udhr-cbi";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-cbr.md": {
	id: "udhr-cbr.md";
  slug: "udhr-cbr";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-cbs.md": {
	id: "udhr-cbs.md";
  slug: "udhr-cbs";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-cbt.md": {
	id: "udhr-cbt.md";
  slug: "udhr-cbt";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-cbu.md": {
	id: "udhr-cbu.md";
  slug: "udhr-cbu";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-ccp.md": {
	id: "udhr-ccp.md";
  slug: "udhr-ccp";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-ceb.md": {
	id: "udhr-ceb.md";
  slug: "udhr-ceb";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-cfm.md": {
	id: "udhr-cfm.md";
  slug: "udhr-cfm";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-ch.md": {
	id: "udhr-ch.md";
  slug: "udhr-ch";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-chj.md": {
	id: "udhr-chj.md";
  slug: "udhr-chj";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-chk.md": {
	id: "udhr-chk.md";
  slug: "udhr-chk";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-chr.md": {
	id: "udhr-chr.md";
  slug: "udhr-chr";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-cic.md": {
	id: "udhr-cic.md";
  slug: "udhr-cic";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-cjk.md": {
	id: "udhr-cjk.md";
  slug: "udhr-cjk";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-cjs.md": {
	id: "udhr-cjs.md";
  slug: "udhr-cjs";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-cjy.md": {
	id: "udhr-cjy.md";
  slug: "udhr-cjy";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-ckb-Latn.md": {
	id: "udhr-ckb-Latn.md";
  slug: "udhr-ckb-latn";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-cnh.md": {
	id: "udhr-cnh.md";
  slug: "udhr-cnh";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-cni.md": {
	id: "udhr-cni.md";
  slug: "udhr-cni";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-cnr.md": {
	id: "udhr-cnr.md";
  slug: "udhr-cnr";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-co.md": {
	id: "udhr-co.md";
  slug: "udhr-co";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-cof.md": {
	id: "udhr-cof.md";
  slug: "udhr-cof";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-cot.md": {
	id: "udhr-cot.md";
  slug: "udhr-cot";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-cpu.md": {
	id: "udhr-cpu.md";
  slug: "udhr-cpu";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-crh.md": {
	id: "udhr-crh.md";
  slug: "udhr-crh";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-cri.md": {
	id: "udhr-cri.md";
  slug: "udhr-cri";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-crs.md": {
	id: "udhr-crs.md";
  slug: "udhr-crs";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-cs.md": {
	id: "udhr-cs.md";
  slug: "udhr-cs";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-csa.md": {
	id: "udhr-csa.md";
  slug: "udhr-csa";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-csw.md": {
	id: "udhr-csw.md";
  slug: "udhr-csw";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-ctd.md": {
	id: "udhr-ctd.md";
  slug: "udhr-ctd";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-cv.md": {
	id: "udhr-cv.md";
  slug: "udhr-cv";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-cy.md": {
	id: "udhr-cy.md";
  slug: "udhr-cy";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-da.md": {
	id: "udhr-da.md";
  slug: "udhr-da";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-dag.md": {
	id: "udhr-dag.md";
  slug: "udhr-dag";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-ddn.md": {
	id: "udhr-ddn.md";
  slug: "udhr-ddn";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-de-1901.md": {
	id: "udhr-de-1901.md";
  slug: "udhr-de-1901";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-de-1996.md": {
	id: "udhr-de-1996.md";
  slug: "udhr-de-1996";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-dga.md": {
	id: "udhr-dga.md";
  slug: "udhr-dga";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-dip.md": {
	id: "udhr-dip.md";
  slug: "udhr-dip";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-duu.md": {
	id: "udhr-duu.md";
  slug: "udhr-duu";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-dv.md": {
	id: "udhr-dv.md";
  slug: "udhr-dv";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-dyo.md": {
	id: "udhr-dyo.md";
  slug: "udhr-dyo";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-dyu.md": {
	id: "udhr-dyu.md";
  slug: "udhr-dyu";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-dz.md": {
	id: "udhr-dz.md";
  slug: "udhr-dz";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-ee.md": {
	id: "udhr-ee.md";
  slug: "udhr-ee";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-el-monoton.md": {
	id: "udhr-el-monoton.md";
  slug: "udhr-el-monoton";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-el-polyton.md": {
	id: "udhr-el-polyton.md";
  slug: "udhr-el-polyton";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-en.md": {
	id: "udhr-en.md";
  slug: "udhr-en";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-eo.md": {
	id: "udhr-eo.md";
  slug: "udhr-eo";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-es.md": {
	id: "udhr-es.md";
  slug: "udhr-es";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-ese.md": {
	id: "udhr-ese.md";
  slug: "udhr-ese";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-et.md": {
	id: "udhr-et.md";
  slug: "udhr-et";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-eu.md": {
	id: "udhr-eu.md";
  slug: "udhr-eu";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-eve.md": {
	id: "udhr-eve.md";
  slug: "udhr-eve";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-evn.md": {
	id: "udhr-evn.md";
  slug: "udhr-evn";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-fa-AF.md": {
	id: "udhr-fa-AF.md";
  slug: "udhr-fa-af";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-fa.md": {
	id: "udhr-fa.md";
  slug: "udhr-fa";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-fi.md": {
	id: "udhr-fi.md";
  slug: "udhr-fi";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-fj.md": {
	id: "udhr-fj.md";
  slug: "udhr-fj";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-fkv.md": {
	id: "udhr-fkv.md";
  slug: "udhr-fkv";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-fo.md": {
	id: "udhr-fo.md";
  slug: "udhr-fo";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-fon.md": {
	id: "udhr-fon.md";
  slug: "udhr-fon";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-fr.md": {
	id: "udhr-fr.md";
  slug: "udhr-fr";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-fuf-Adlm.md": {
	id: "udhr-fuf-Adlm.md";
  slug: "udhr-fuf-adlm";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-fuf.md": {
	id: "udhr-fuf.md";
  slug: "udhr-fuf";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-fur.md": {
	id: "udhr-fur.md";
  slug: "udhr-fur";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-fuv.md": {
	id: "udhr-fuv.md";
  slug: "udhr-fuv";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-fvr.md": {
	id: "udhr-fvr.md";
  slug: "udhr-fvr";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-fy.md": {
	id: "udhr-fy.md";
  slug: "udhr-fy";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-ga.md": {
	id: "udhr-ga.md";
  slug: "udhr-ga";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-gaa.md": {
	id: "udhr-gaa.md";
  slug: "udhr-gaa";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-gag.md": {
	id: "udhr-gag.md";
  slug: "udhr-gag";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-gan.md": {
	id: "udhr-gan.md";
  slug: "udhr-gan";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-gd.md": {
	id: "udhr-gd.md";
  slug: "udhr-gd";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-gjn.md": {
	id: "udhr-gjn.md";
  slug: "udhr-gjn";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-gkp.md": {
	id: "udhr-gkp.md";
  slug: "udhr-gkp";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-gl.md": {
	id: "udhr-gl.md";
  slug: "udhr-gl";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-gld.md": {
	id: "udhr-gld.md";
  slug: "udhr-gld";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-gn.md": {
	id: "udhr-gn.md";
  slug: "udhr-gn";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-gsw.md": {
	id: "udhr-gsw.md";
  slug: "udhr-gsw";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-gu.md": {
	id: "udhr-gu.md";
  slug: "udhr-gu";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-guc.md": {
	id: "udhr-guc.md";
  slug: "udhr-guc";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-guk.md": {
	id: "udhr-guk.md";
  slug: "udhr-guk";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-guu.md": {
	id: "udhr-guu.md";
  slug: "udhr-guu";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-gv.md": {
	id: "udhr-gv.md";
  slug: "udhr-gv";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-gyr.md": {
	id: "udhr-gyr.md";
  slug: "udhr-gyr";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-ha-NE.md": {
	id: "udhr-ha-NE.md";
  slug: "udhr-ha-ne";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-ha-NG.md": {
	id: "udhr-ha-NG.md";
  slug: "udhr-ha-ng";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-ha.md": {
	id: "udhr-ha.md";
  slug: "udhr-ha";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-hak.md": {
	id: "udhr-hak.md";
  slug: "udhr-hak";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-haw.md": {
	id: "udhr-haw.md";
  slug: "udhr-haw";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-he.md": {
	id: "udhr-he.md";
  slug: "udhr-he";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-hi.md": {
	id: "udhr-hi.md";
  slug: "udhr-hi";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-hil.md": {
	id: "udhr-hil.md";
  slug: "udhr-hil";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-hlt.md": {
	id: "udhr-hlt.md";
  slug: "udhr-hlt";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-hmn.md": {
	id: "udhr-hmn.md";
  slug: "udhr-hmn";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-hms.md": {
	id: "udhr-hms.md";
  slug: "udhr-hms";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-hna.md": {
	id: "udhr-hna.md";
  slug: "udhr-hna";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-hni.md": {
	id: "udhr-hni.md";
  slug: "udhr-hni";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-hnj.md": {
	id: "udhr-hnj.md";
  slug: "udhr-hnj";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-hns.md": {
	id: "udhr-hns.md";
  slug: "udhr-hns";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-hr.md": {
	id: "udhr-hr.md";
  slug: "udhr-hr";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-hsb.md": {
	id: "udhr-hsb.md";
  slug: "udhr-hsb";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-hsn.md": {
	id: "udhr-hsn.md";
  slug: "udhr-hsn";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-ht.md": {
	id: "udhr-ht.md";
  slug: "udhr-ht";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-hu.md": {
	id: "udhr-hu.md";
  slug: "udhr-hu";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-hus.md": {
	id: "udhr-hus.md";
  slug: "udhr-hus";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-huu.md": {
	id: "udhr-huu.md";
  slug: "udhr-huu";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-hy.md": {
	id: "udhr-hy.md";
  slug: "udhr-hy";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-ia.md": {
	id: "udhr-ia.md";
  slug: "udhr-ia";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-ibb.md": {
	id: "udhr-ibb.md";
  slug: "udhr-ibb";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-id.md": {
	id: "udhr-id.md";
  slug: "udhr-id";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-idu.md": {
	id: "udhr-idu.md";
  slug: "udhr-idu";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-ig.md": {
	id: "udhr-ig.md";
  slug: "udhr-ig";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-ii.md": {
	id: "udhr-ii.md";
  slug: "udhr-ii";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-ijs.md": {
	id: "udhr-ijs.md";
  slug: "udhr-ijs";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-ilo.md": {
	id: "udhr-ilo.md";
  slug: "udhr-ilo";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-io.md": {
	id: "udhr-io.md";
  slug: "udhr-io";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-is.md": {
	id: "udhr-is.md";
  slug: "udhr-is";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-it.md": {
	id: "udhr-it.md";
  slug: "udhr-it";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-iu.md": {
	id: "udhr-iu.md";
  slug: "udhr-iu";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-ja.md": {
	id: "udhr-ja.md";
  slug: "udhr-ja";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-jiv.md": {
	id: "udhr-jiv.md";
  slug: "udhr-jiv";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-jv-Java.md": {
	id: "udhr-jv-Java.md";
  slug: "udhr-jv-java";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-jv.md": {
	id: "udhr-jv.md";
  slug: "udhr-jv";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-ka.md": {
	id: "udhr-ka.md";
  slug: "udhr-ka";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-kaa.md": {
	id: "udhr-kaa.md";
  slug: "udhr-kaa";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-kbd.md": {
	id: "udhr-kbd.md";
  slug: "udhr-kbd";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-kbp.md": {
	id: "udhr-kbp.md";
  slug: "udhr-kbp";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-kbr.md": {
	id: "udhr-kbr.md";
  slug: "udhr-kbr";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-kde.md": {
	id: "udhr-kde.md";
  slug: "udhr-kde";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-kdh.md": {
	id: "udhr-kdh.md";
  slug: "udhr-kdh";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-kea.md": {
	id: "udhr-kea.md";
  slug: "udhr-kea";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-kek.md": {
	id: "udhr-kek.md";
  slug: "udhr-kek";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-kg-AO.md": {
	id: "udhr-kg-AO.md";
  slug: "udhr-kg-ao";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-kg.md": {
	id: "udhr-kg.md";
  slug: "udhr-kg";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-kha.md": {
	id: "udhr-kha.md";
  slug: "udhr-kha";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-kjh.md": {
	id: "udhr-kjh.md";
  slug: "udhr-kjh";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-kk.md": {
	id: "udhr-kk.md";
  slug: "udhr-kk";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-kkh-Lana.md": {
	id: "udhr-kkh-Lana.md";
  slug: "udhr-kkh-lana";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-kl.md": {
	id: "udhr-kl.md";
  slug: "udhr-kl";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-km.md": {
	id: "udhr-km.md";
  slug: "udhr-km";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-kmb.md": {
	id: "udhr-kmb.md";
  slug: "udhr-kmb";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-kn.md": {
	id: "udhr-kn.md";
  slug: "udhr-kn";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-ko.md": {
	id: "udhr-ko.md";
  slug: "udhr-ko";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-koi.md": {
	id: "udhr-koi.md";
  slug: "udhr-koi";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-koo.md": {
	id: "udhr-koo.md";
  slug: "udhr-koo";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-kqn.md": {
	id: "udhr-kqn.md";
  slug: "udhr-kqn";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-kqs.md": {
	id: "udhr-kqs.md";
  slug: "udhr-kqs";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-kr.md": {
	id: "udhr-kr.md";
  slug: "udhr-kr";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-kri.md": {
	id: "udhr-kri.md";
  slug: "udhr-kri";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-krl.md": {
	id: "udhr-krl.md";
  slug: "udhr-krl";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-ktu.md": {
	id: "udhr-ktu.md";
  slug: "udhr-ktu";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-ku.md": {
	id: "udhr-ku.md";
  slug: "udhr-ku";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-kwi.md": {
	id: "udhr-kwi.md";
  slug: "udhr-kwi";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-ky.md": {
	id: "udhr-ky.md";
  slug: "udhr-ky";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-la.md": {
	id: "udhr-la.md";
  slug: "udhr-la";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-lad.md": {
	id: "udhr-lad.md";
  slug: "udhr-lad";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-lah.md": {
	id: "udhr-lah.md";
  slug: "udhr-lah";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-lb.md": {
	id: "udhr-lb.md";
  slug: "udhr-lb";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-lg.md": {
	id: "udhr-lg.md";
  slug: "udhr-lg";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-lia.md": {
	id: "udhr-lia.md";
  slug: "udhr-lia";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-lij.md": {
	id: "udhr-lij.md";
  slug: "udhr-lij";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-lld.md": {
	id: "udhr-lld.md";
  slug: "udhr-lld";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-ln.md": {
	id: "udhr-ln.md";
  slug: "udhr-ln";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-lns.md": {
	id: "udhr-lns.md";
  slug: "udhr-lns";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-lo.md": {
	id: "udhr-lo.md";
  slug: "udhr-lo";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-lob.md": {
	id: "udhr-lob.md";
  slug: "udhr-lob";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-lot.md": {
	id: "udhr-lot.md";
  slug: "udhr-lot";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-loz.md": {
	id: "udhr-loz.md";
  slug: "udhr-loz";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-lt.md": {
	id: "udhr-lt.md";
  slug: "udhr-lt";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-lua.md": {
	id: "udhr-lua.md";
  slug: "udhr-lua";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-lue.md": {
	id: "udhr-lue.md";
  slug: "udhr-lue";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-lun.md": {
	id: "udhr-lun.md";
  slug: "udhr-lun";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-lus.md": {
	id: "udhr-lus.md";
  slug: "udhr-lus";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-lv.md": {
	id: "udhr-lv.md";
  slug: "udhr-lv";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-mad.md": {
	id: "udhr-mad.md";
  slug: "udhr-mad";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-mag.md": {
	id: "udhr-mag.md";
  slug: "udhr-mag";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-mai.md": {
	id: "udhr-mai.md";
  slug: "udhr-mai";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-mam.md": {
	id: "udhr-mam.md";
  slug: "udhr-mam";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-man.md": {
	id: "udhr-man.md";
  slug: "udhr-man";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-maz.md": {
	id: "udhr-maz.md";
  slug: "udhr-maz";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-mcd.md": {
	id: "udhr-mcd.md";
  slug: "udhr-mcd";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-mcf.md": {
	id: "udhr-mcf.md";
  slug: "udhr-mcf";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-men.md": {
	id: "udhr-men.md";
  slug: "udhr-men";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-mfq.md": {
	id: "udhr-mfq.md";
  slug: "udhr-mfq";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-mg.md": {
	id: "udhr-mg.md";
  slug: "udhr-mg";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-mh.md": {
	id: "udhr-mh.md";
  slug: "udhr-mh";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-mi.md": {
	id: "udhr-mi.md";
  slug: "udhr-mi";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-mic.md": {
	id: "udhr-mic.md";
  slug: "udhr-mic";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-min.md": {
	id: "udhr-min.md";
  slug: "udhr-min";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-miq.md": {
	id: "udhr-miq.md";
  slug: "udhr-miq";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-mk.md": {
	id: "udhr-mk.md";
  slug: "udhr-mk";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-ml.md": {
	id: "udhr-ml.md";
  slug: "udhr-ml";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-mn-Cyrl.md": {
	id: "udhr-mn-Cyrl.md";
  slug: "udhr-mn-cyrl";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-mn-Mong.md": {
	id: "udhr-mn-Mong.md";
  slug: "udhr-mn-mong";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-mnw.md": {
	id: "udhr-mnw.md";
  slug: "udhr-mnw";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-mor.md": {
	id: "udhr-mor.md";
  slug: "udhr-mor";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-mos.md": {
	id: "udhr-mos.md";
  slug: "udhr-mos";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-mr.md": {
	id: "udhr-mr.md";
  slug: "udhr-mr";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-mt.md": {
	id: "udhr-mt.md";
  slug: "udhr-mt";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-mto.md": {
	id: "udhr-mto.md";
  slug: "udhr-mto";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-mxi.md": {
	id: "udhr-mxi.md";
  slug: "udhr-mxi";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-mxv.md": {
	id: "udhr-mxv.md";
  slug: "udhr-mxv";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-my.md": {
	id: "udhr-my.md";
  slug: "udhr-my";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-mzi.md": {
	id: "udhr-mzi.md";
  slug: "udhr-mzi";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-nan.md": {
	id: "udhr-nan.md";
  slug: "udhr-nan";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-nb.md": {
	id: "udhr-nb.md";
  slug: "udhr-nb";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-nba.md": {
	id: "udhr-nba.md";
  slug: "udhr-nba";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-nds.md": {
	id: "udhr-nds.md";
  slug: "udhr-nds";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-ne.md": {
	id: "udhr-ne.md";
  slug: "udhr-ne";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-ng.md": {
	id: "udhr-ng.md";
  slug: "udhr-ng";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-nhn.md": {
	id: "udhr-nhn.md";
  slug: "udhr-nhn";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-nio.md": {
	id: "udhr-nio.md";
  slug: "udhr-nio";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-niu.md": {
	id: "udhr-niu.md";
  slug: "udhr-niu";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-niv.md": {
	id: "udhr-niv.md";
  slug: "udhr-niv";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-njo.md": {
	id: "udhr-njo.md";
  slug: "udhr-njo";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-nku.md": {
	id: "udhr-nku.md";
  slug: "udhr-nku";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-nl.md": {
	id: "udhr-nl.md";
  slug: "udhr-nl";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-nn.md": {
	id: "udhr-nn.md";
  slug: "udhr-nn";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-not.md": {
	id: "udhr-not.md";
  slug: "udhr-not";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-nr.md": {
	id: "udhr-nr.md";
  slug: "udhr-nr";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-nso.md": {
	id: "udhr-nso.md";
  slug: "udhr-nso";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-nv.md": {
	id: "udhr-nv.md";
  slug: "udhr-nv";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-ny.md": {
	id: "udhr-ny.md";
  slug: "udhr-ny";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-nym.md": {
	id: "udhr-nym.md";
  slug: "udhr-nym";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-nyn.md": {
	id: "udhr-nyn.md";
  slug: "udhr-nyn";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-nzi.md": {
	id: "udhr-nzi.md";
  slug: "udhr-nzi";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-oaa.md": {
	id: "udhr-oaa.md";
  slug: "udhr-oaa";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-oc.md": {
	id: "udhr-oc.md";
  slug: "udhr-oc";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-ojb.md": {
	id: "udhr-ojb.md";
  slug: "udhr-ojb";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-oki.md": {
	id: "udhr-oki.md";
  slug: "udhr-oki";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-om.md": {
	id: "udhr-om.md";
  slug: "udhr-om";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-orh.md": {
	id: "udhr-orh.md";
  slug: "udhr-orh";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-os.md": {
	id: "udhr-os.md";
  slug: "udhr-os";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-ote.md": {
	id: "udhr-ote.md";
  slug: "udhr-ote";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-pa.md": {
	id: "udhr-pa.md";
  slug: "udhr-pa";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-pam.md": {
	id: "udhr-pam.md";
  slug: "udhr-pam";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-pap.md": {
	id: "udhr-pap.md";
  slug: "udhr-pap";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-pau.md": {
	id: "udhr-pau.md";
  slug: "udhr-pau";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-pbb.md": {
	id: "udhr-pbb.md";
  slug: "udhr-pbb";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-pcd.md": {
	id: "udhr-pcd.md";
  slug: "udhr-pcd";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-pcm.md": {
	id: "udhr-pcm.md";
  slug: "udhr-pcm";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-pis.md": {
	id: "udhr-pis.md";
  slug: "udhr-pis";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-piu.md": {
	id: "udhr-piu.md";
  slug: "udhr-piu";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-pl.md": {
	id: "udhr-pl.md";
  slug: "udhr-pl";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-pon.md": {
	id: "udhr-pon.md";
  slug: "udhr-pon";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-pov.md": {
	id: "udhr-pov.md";
  slug: "udhr-pov";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-ppl.md": {
	id: "udhr-ppl.md";
  slug: "udhr-ppl";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-ps.md": {
	id: "udhr-ps.md";
  slug: "udhr-ps";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-pt-BR.md": {
	id: "udhr-pt-BR.md";
  slug: "udhr-pt-br";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-pt-PT.md": {
	id: "udhr-pt-PT.md";
  slug: "udhr-pt-pt";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-qu.md": {
	id: "udhr-qu.md";
  slug: "udhr-qu";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-quc.md": {
	id: "udhr-quc.md";
  slug: "udhr-quc";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-qug.md": {
	id: "udhr-qug.md";
  slug: "udhr-qug";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-quh.md": {
	id: "udhr-quh.md";
  slug: "udhr-quh";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-quy.md": {
	id: "udhr-quy.md";
  slug: "udhr-quy";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-qva.md": {
	id: "udhr-qva.md";
  slug: "udhr-qva";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-qvc.md": {
	id: "udhr-qvc.md";
  slug: "udhr-qvc";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-qvh.md": {
	id: "udhr-qvh.md";
  slug: "udhr-qvh";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-qvm.md": {
	id: "udhr-qvm.md";
  slug: "udhr-qvm";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-qvn.md": {
	id: "udhr-qvn.md";
  slug: "udhr-qvn";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-qwh.md": {
	id: "udhr-qwh.md";
  slug: "udhr-qwh";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-qxn.md": {
	id: "udhr-qxn.md";
  slug: "udhr-qxn";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-qxu.md": {
	id: "udhr-qxu.md";
  slug: "udhr-qxu";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-rar.md": {
	id: "udhr-rar.md";
  slug: "udhr-rar";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-rgn.md": {
	id: "udhr-rgn.md";
  slug: "udhr-rgn";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-rm-puter.md": {
	id: "udhr-rm-puter.md";
  slug: "udhr-rm-puter";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-rm-rumgr.md": {
	id: "udhr-rm-rumgr.md";
  slug: "udhr-rm-rumgr";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-rm-surmiran.md": {
	id: "udhr-rm-surmiran.md";
  slug: "udhr-rm-surmiran";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-rm-sursilv.md": {
	id: "udhr-rm-sursilv.md";
  slug: "udhr-rm-sursilv";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-rm-sutsilv.md": {
	id: "udhr-rm-sutsilv.md";
  slug: "udhr-rm-sutsilv";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-rm-vallader.md": {
	id: "udhr-rm-vallader.md";
  slug: "udhr-rm-vallader";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-rm.md": {
	id: "udhr-rm.md";
  slug: "udhr-rm";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-rmn.md": {
	id: "udhr-rmn.md";
  slug: "udhr-rmn";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-rn.md": {
	id: "udhr-rn.md";
  slug: "udhr-rn";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-ro.md": {
	id: "udhr-ro.md";
  slug: "udhr-ro";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-ru.md": {
	id: "udhr-ru.md";
  slug: "udhr-ru";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-rup.md": {
	id: "udhr-rup.md";
  slug: "udhr-rup";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-rw.md": {
	id: "udhr-rw.md";
  slug: "udhr-rw";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-sa-Gran.md": {
	id: "udhr-sa-Gran.md";
  slug: "udhr-sa-gran";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-sa.md": {
	id: "udhr-sa.md";
  slug: "udhr-sa";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-sah.md": {
	id: "udhr-sah.md";
  slug: "udhr-sah";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-sc.md": {
	id: "udhr-sc.md";
  slug: "udhr-sc";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-sco.md": {
	id: "udhr-sco.md";
  slug: "udhr-sco";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-se.md": {
	id: "udhr-se.md";
  slug: "udhr-se";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-sey.md": {
	id: "udhr-sey.md";
  slug: "udhr-sey";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-sg.md": {
	id: "udhr-sg.md";
  slug: "udhr-sg";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-shk.md": {
	id: "udhr-shk.md";
  slug: "udhr-shk";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-shn.md": {
	id: "udhr-shn.md";
  slug: "udhr-shn";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-shp.md": {
	id: "udhr-shp.md";
  slug: "udhr-shp";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-si.md": {
	id: "udhr-si.md";
  slug: "udhr-si";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-sid.md": {
	id: "udhr-sid.md";
  slug: "udhr-sid";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-sk.md": {
	id: "udhr-sk.md";
  slug: "udhr-sk";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-skr.md": {
	id: "udhr-skr.md";
  slug: "udhr-skr";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-sl.md": {
	id: "udhr-sl.md";
  slug: "udhr-sl";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-slr.md": {
	id: "udhr-slr.md";
  slug: "udhr-slr";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-sm.md": {
	id: "udhr-sm.md";
  slug: "udhr-sm";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-sn.md": {
	id: "udhr-sn.md";
  slug: "udhr-sn";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-snk.md": {
	id: "udhr-snk.md";
  slug: "udhr-snk";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-snn.md": {
	id: "udhr-snn.md";
  slug: "udhr-snn";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-so.md": {
	id: "udhr-so.md";
  slug: "udhr-so";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-sr-Cyrl.md": {
	id: "udhr-sr-Cyrl.md";
  slug: "udhr-sr-cyrl";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-sr-Latn.md": {
	id: "udhr-sr-Latn.md";
  slug: "udhr-sr-latn";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-srr.md": {
	id: "udhr-srr.md";
  slug: "udhr-srr";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-ss.md": {
	id: "udhr-ss.md";
  slug: "udhr-ss";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-st.md": {
	id: "udhr-st.md";
  slug: "udhr-st";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-su.md": {
	id: "udhr-su.md";
  slug: "udhr-su";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-suk.md": {
	id: "udhr-suk.md";
  slug: "udhr-suk";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-sus.md": {
	id: "udhr-sus.md";
  slug: "udhr-sus";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-sv.md": {
	id: "udhr-sv.md";
  slug: "udhr-sv";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-sw.md": {
	id: "udhr-sw.md";
  slug: "udhr-sw";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-swb.md": {
	id: "udhr-swb.md";
  slug: "udhr-swb";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-ta-LK.md": {
	id: "udhr-ta-LK.md";
  slug: "udhr-ta-lk";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-ta.md": {
	id: "udhr-ta.md";
  slug: "udhr-ta";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-taj.md": {
	id: "udhr-taj.md";
  slug: "udhr-taj";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-tbz.md": {
	id: "udhr-tbz.md";
  slug: "udhr-tbz";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-tca.md": {
	id: "udhr-tca.md";
  slug: "udhr-tca";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-tdt.md": {
	id: "udhr-tdt.md";
  slug: "udhr-tdt";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-te.md": {
	id: "udhr-te.md";
  slug: "udhr-te";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-tem.md": {
	id: "udhr-tem.md";
  slug: "udhr-tem";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-tet.md": {
	id: "udhr-tet.md";
  slug: "udhr-tet";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-tg.md": {
	id: "udhr-tg.md";
  slug: "udhr-tg";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-th.md": {
	id: "udhr-th.md";
  slug: "udhr-th";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-ti.md": {
	id: "udhr-ti.md";
  slug: "udhr-ti";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-tiv.md": {
	id: "udhr-tiv.md";
  slug: "udhr-tiv";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-tk-Cyrl.md": {
	id: "udhr-tk-Cyrl.md";
  slug: "udhr-tk-cyrl";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-tk-Latn.md": {
	id: "udhr-tk-Latn.md";
  slug: "udhr-tk-latn";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-tl-Tglg.md": {
	id: "udhr-tl-Tglg.md";
  slug: "udhr-tl-tglg";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-tl.md": {
	id: "udhr-tl.md";
  slug: "udhr-tl";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-tly.md": {
	id: "udhr-tly.md";
  slug: "udhr-tly";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-tn.md": {
	id: "udhr-tn.md";
  slug: "udhr-tn";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-to.md": {
	id: "udhr-to.md";
  slug: "udhr-to";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-tob.md": {
	id: "udhr-tob.md";
  slug: "udhr-tob";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-toi.md": {
	id: "udhr-toi.md";
  slug: "udhr-toi";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-toj.md": {
	id: "udhr-toj.md";
  slug: "udhr-toj";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-top.md": {
	id: "udhr-top.md";
  slug: "udhr-top";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-tpi.md": {
	id: "udhr-tpi.md";
  slug: "udhr-tpi";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-tr.md": {
	id: "udhr-tr.md";
  slug: "udhr-tr";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-ts.md": {
	id: "udhr-ts.md";
  slug: "udhr-ts";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-tsz.md": {
	id: "udhr-tsz.md";
  slug: "udhr-tsz";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-tt.md": {
	id: "udhr-tt.md";
  slug: "udhr-tt";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-ty.md": {
	id: "udhr-ty.md";
  slug: "udhr-ty";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-tyv.md": {
	id: "udhr-tyv.md";
  slug: "udhr-tyv";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-tzh.md": {
	id: "udhr-tzh.md";
  slug: "udhr-tzh";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-tzm-Tfng.md": {
	id: "udhr-tzm-Tfng.md";
  slug: "udhr-tzm-tfng";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-tzm.md": {
	id: "udhr-tzm.md";
  slug: "udhr-tzm";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-tzo.md": {
	id: "udhr-tzo.md";
  slug: "udhr-tzo";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-udu.md": {
	id: "udhr-udu.md";
  slug: "udhr-udu";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-ug-Arab.md": {
	id: "udhr-ug-Arab.md";
  slug: "udhr-ug-arab";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-ug-Latn.md": {
	id: "udhr-ug-Latn.md";
  slug: "udhr-ug-latn";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-uk.md": {
	id: "udhr-uk.md";
  slug: "udhr-uk";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-umb.md": {
	id: "udhr-umb.md";
  slug: "udhr-umb";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-und.md": {
	id: "udhr-und.md";
  slug: "udhr-und";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-ur.md": {
	id: "udhr-ur.md";
  slug: "udhr-ur";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-ura.md": {
	id: "udhr-ura.md";
  slug: "udhr-ura";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-uz-Cyrl.md": {
	id: "udhr-uz-Cyrl.md";
  slug: "udhr-uz-cyrl";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-uz-Latn.md": {
	id: "udhr-uz-Latn.md";
  slug: "udhr-uz-latn";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-vai.md": {
	id: "udhr-vai.md";
  slug: "udhr-vai";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-ve.md": {
	id: "udhr-ve.md";
  slug: "udhr-ve";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-vec.md": {
	id: "udhr-vec.md";
  slug: "udhr-vec";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-vep.md": {
	id: "udhr-vep.md";
  slug: "udhr-vep";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-vi-Hani.md": {
	id: "udhr-vi-Hani.md";
  slug: "udhr-vi-hani";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-vi.md": {
	id: "udhr-vi.md";
  slug: "udhr-vi";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-vmw.md": {
	id: "udhr-vmw.md";
  slug: "udhr-vmw";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-wa.md": {
	id: "udhr-wa.md";
  slug: "udhr-wa";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-war.md": {
	id: "udhr-war.md";
  slug: "udhr-war";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-wo.md": {
	id: "udhr-wo.md";
  slug: "udhr-wo";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-wuu.md": {
	id: "udhr-wuu.md";
  slug: "udhr-wuu";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-wwa.md": {
	id: "udhr-wwa.md";
  slug: "udhr-wwa";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-xh.md": {
	id: "udhr-xh.md";
  slug: "udhr-xh";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-xsm.md": {
	id: "udhr-xsm.md";
  slug: "udhr-xsm";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-yad.md": {
	id: "udhr-yad.md";
  slug: "udhr-yad";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-yao.md": {
	id: "udhr-yao.md";
  slug: "udhr-yao";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-yap.md": {
	id: "udhr-yap.md";
  slug: "udhr-yap";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-yi.md": {
	id: "udhr-yi.md";
  slug: "udhr-yi";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-ykg.md": {
	id: "udhr-ykg.md";
  slug: "udhr-ykg";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-yo.md": {
	id: "udhr-yo.md";
  slug: "udhr-yo";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-yrk.md": {
	id: "udhr-yrk.md";
  slug: "udhr-yrk";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-yua.md": {
	id: "udhr-yua.md";
  slug: "udhr-yua";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-yue.md": {
	id: "udhr-yue.md";
  slug: "udhr-yue";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-za.md": {
	id: "udhr-za.md";
  slug: "udhr-za";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-zam.md": {
	id: "udhr-zam.md";
  slug: "udhr-zam";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-zdj.md": {
	id: "udhr-zdj.md";
  slug: "udhr-zdj";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-zgh.md": {
	id: "udhr-zgh.md";
  slug: "udhr-zgh";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-zh-Hant.md": {
	id: "udhr-zh-Hant.md";
  slug: "udhr-zh-hant";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-zh.md": {
	id: "udhr-zh.md";
  slug: "udhr-zh";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-zlm-Arab.md": {
	id: "udhr-zlm-Arab.md";
  slug: "udhr-zlm-arab";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-zlm-Latn.md": {
	id: "udhr-zlm-Latn.md";
  slug: "udhr-zlm-latn";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-zro.md": {
	id: "udhr-zro.md";
  slug: "udhr-zro";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-ztu.md": {
	id: "udhr-ztu.md";
  slug: "udhr-ztu";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
"udhr-zu.md": {
	id: "udhr-zu.md";
  slug: "udhr-zu";
  body: string;
  collection: "udhr";
  data: InferEntrySchema<"udhr">
} & { render(): Render[".md"] };
};

	};

	type DataEntryMap = {
		
	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	type ContentConfig = typeof import("../src/content/config");
}
