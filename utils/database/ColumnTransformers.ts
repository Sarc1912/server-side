// src/database/utils/ColumnTransformers.ts
import { ValueTransformer } from 'typeorm';

export const ColumnNumericTransformer: ValueTransformer = {
    // Executed before saving to the database
    to(data: number | null): number | null {
        return data;
    },
    // Executed when retrieving data from the database
    from(data: string | null): number | null {
        return data === null ? null : parseFloat(data);
    },
};