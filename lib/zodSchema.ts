import { z } from "zod";

export const loginSchema = z.object({
    email: z
        .string({ required_error: "Email is required" })
        .email("Invalid email address"),
    password: z
        .string({ required_error: "Password is required" })
        .min(6, "Password must be at least 6 characters long"),
});


export const registerSchema = z
    .object({
        name: z
            .string({ required_error: "name is required" })
            .min(1, "Name is required"),
        email: z
            .string({ required_error: "Email is required" })
            .email("Invalid email address"),
        password: z
            .string({ required_error: "Password is required" })
            .min(6, "Password must be at least 6 characters long"),
        confirm_password: z
            .string({
                required_error: "Confirm Password is required",
            })
            .min(6, "Confirm password must be at least 6 characters long"),
    })
    .refine((data) => data.password === data.confirm_password, {
        message: "Passwords don't match",
        path: ["confirm_password"],
    });


export const checkoutSchema = z.object({
    email: z
        .string({ required_error: "Email is required" })
        .email("Please enter a valid email address"),
    name: z
        .string({ required_error: "Name is required" })
        .min(2, "Name must be at least 2 characters long")
        .max(50, "Name cannot exceed 50 characters"),
    phone: z
        .string({ required_error: "Phone is required" })
        .regex(/^[0-9]{10,15}$/, "Phone must be between 10 and 15 digits"),
    address: z
        .string({ required_error: "Address is required" })
        .min(5, "Address must be at least 5 characters long"),
    note: z.string().optional(),
});


export const lostPasswordSchema = z.object({
    email: z
        .string({ required_error: "Email is required" })
        .email("Please enter a valid email address"),

});



export const assignDriverSchema = z.object({
    driverId: z
        .string({ required_error: "Driver is required" }),
    expectedDeliveryDate: z.date({
        required_error: "An expected date of delivery is required.",
    }),
});

export const createDriverSchema = z.object({
    name: z
        .string({ required_error: "Driver name is required" }),
    phone: z.string({ required_error: "phone number is required" }),
});


export const changePasswordSchema = z
    .object({
        password: z
            .string({ required_error: "Password is required" })
            .min(6, "Password must be at least 6 characters long"),
        confirm_password: z
            .string({
                required_error: "Confirm Password is required",
            })
            .min(6, "Confirm password must be at least 6 characters long"),
    })
    .refine((data) => data.password === data.confirm_password, {
        message: "Passwords don't match",
        path: ["confirm_password"],
    });


export const updateProfileSchema = z
    .object({
        name: z
            .string()
            // .min(1, "Name is required")
            .optional(),
        email: z
            .string()
            // .email("Invalid email address")
            .optional(),
        phone: z
            .string()
            // .regex(/^[0-9]{10,15}$/, "Phone must be between 10 and 15 digits")
            .optional(),
        address: z
            .string()
            // .min(5, "Address must be at least 5 characters long")
            .optional(),
        currentPassword: z
            .string()
            // .min(6, "Current Password must be at least 6 characters long")
            .optional(),
        password: z
            .string()
            // .min(6, "Password must be at least 6 characters long")
            .optional(),
        confirm_password: z
            .string()
            // .min(6, "Confirm password must be at least 6 characters long")
            .optional(),
    })
    .refine(
        (data) => {
            // If `password` is provided, `confirm_password` must match
            if (data.password && data.password !== data.confirm_password) {
                return false;
            }
            return true;
        },
        {
            message: "Passwords don't match",
            path: ["confirm_password"],
        }
    )
    .refine(
        (data) => {
            // If `password` is provided, `currentPassword` must also be provided
            if (data.password && !data.currentPassword) {
                return false;
            }
            return true;
        },
        {
            message: "Current password is required when updating the password",
            path: ["currentPassword"],
        }
    );

export const insertProductSchema = z.object({
    name: z.string({ required_error: "Name is required" }).min(
        1,
        "Name is required"
    ),
    description: z.string({ required_error: "Description is required" }).min(
        1,
        "Description is required"
    ),
    image: z
        .string()
        .optional(),
    price: z.coerce.number().min(1, "Price must be at least 1 naira"),
    quantity: z.coerce.number().min(1, 'Quantity must be at least 1'),
    categoryId: z.string({ required_error: "Category is required" }),
});

export const insertCategorySchema = z.object({
    name: z.string({ required_error: "Name is required" }).min(
        1,
        "Name is required"
    ),

    image: z
        .string()
        .optional(),

});
