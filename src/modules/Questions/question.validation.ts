import { z } from "zod";

// Enum for selected option
export const selectedOptionEnum = z.enum(["A", "B", "C", "D"]);

// Single option type
const optionSchema = z.object({
    label: selectedOptionEnum,
    value: z.string()
});

// Explanation object type
const explanationSchema = z.object({
    text: z.string(),
    img: z.string().optional()
});

// Main Question input schema
export const questionSchema = z.object({
    topicId: z.string().min(1, "topicId is required"),
    text: z.string().min(1, "text is required"),
    explanation: explanationSchema,
    options: z.array(optionSchema)
        .length(4, "Exactly 4 options are required"),
    correctAnswer: selectedOptionEnum
});


export const questionUpdateSchema = z.object({
    text: z.string().min(1, "text is required").optional(),
    explanation: explanationSchema.optional(),
    options: z.array(optionSchema)
        .length(4, "Exactly 4 options are required").optional(),
    correctAnswer: selectedOptionEnum.optional()
})
