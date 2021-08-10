export interface FontAwesomeOptions {
    package: "free" | "pro";
}
export declare type Subset = "solid" | "light" | "regular" | "brands" | "duotone";
export declare type GlyphName = string;
export declare type SubsetOption = GlyphName[] | Partial<Record<Subset, GlyphName[]>>;
