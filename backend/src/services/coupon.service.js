import { createCoupon, findCouponById, findCouponByCode, getCoupons, countCoupons, updateCoupon, deleteCoupon, countCouponUsageByUser, } from "../repositories/coupon.repository.js";
export async function createCouponService(body) {
    const existingCoupon = await findCouponByCode(
        body.code.toUpperCase()
    );

    if (existingCoupon) {
        throw new Error("Coupon code already exists.");
    }

    return await createCoupon({
        ...body,
        code: body.code.toUpperCase(),
    });
}

export async function getCouponsService({
    page = 1,
    limit = 10,
    search = "",
}) {
    page = Number(page);
    limit = Number(limit);

    const skip = (page - 1) * limit;

    const where = search
        ? {
            OR: [
                {
                    code: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
                {
                    name: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
            ],
        }
        : {};

    const [coupons, total] = await Promise.all([
        getCoupons({
            skip,
            take: limit,
            where,
        }),
        countCoupons(where),
    ]);

    return {
        coupons,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
}

export async function getCouponByIdService(id) {
    const coupon = await findCouponById(id);

    if (!coupon) {
        throw new Error("Coupon not found.");
    }

    return coupon;
}

export async function updateCouponService(id, body) {
    const coupon = await findCouponById(id);

    if (!coupon) {
        throw new Error("Coupon not found.");
    }

    if (body.code) {
        const existingCoupon = await findCouponByCode(
            body.code.toUpperCase()
        );

        if (
            existingCoupon &&
            existingCoupon.id !== id
        ) {
            throw new Error("Coupon code already exists.");
        }

        body.code = body.code.toUpperCase();
    }

    return await updateCoupon(id, body);
}

export async function deleteCouponService(id) {
    const coupon = await findCouponById(id);

    if (!coupon) {
        throw new Error("Coupon not found.");
    }

    await deleteCoupon(id);

    return;
}

export async function validateCouponService(
    user,
    body
) {
    const coupon = await findCouponByCode(
        body.code.toUpperCase()
    );

    if (!coupon) {
        return {
            valid: false,
            message: "Invalid coupon code.",
        };
    }

    if (!coupon.isActive) {
        return {
            valid: false,
            message: "Coupon is inactive.",
        };
    }

    const now = new Date();

    if (
        coupon.startsAt &&
        coupon.startsAt > now
    ) {
        return {
            valid: false,
            message: "Coupon is not active yet.",
        };
    }

    if (
        coupon.expiresAt &&
        coupon.expiresAt < now
    ) {
        return {
            valid: false,
            message: "Coupon has expired.",
        };
    }

    if (
        coupon.usageLimit &&
        coupon.usedCount >= coupon.usageLimit
    ) {
        return {
            valid: false,
            message: "Coupon usage limit reached.",
        };
    }

    const userUsage =
        await countCouponUsageByUser(
            coupon.id,
            user.id
        );

    if (
        userUsage >= coupon.perUserLimit
    ) {
        return {
            valid: false,
            message:
                "You have already used this coupon.",
        };
    }

    const subtotal = Number(body.subtotal);

    if (
        coupon.minimumOrderAmount &&
        subtotal <
        Number(coupon.minimumOrderAmount)
    ) {
        return {
            valid: false,
            message:
                `Minimum order amount is ${coupon.minimumOrderAmount}.`,
        };
    }

    let discount = 0;

    if (coupon.discountType === "FIXED") {
        discount = Number(coupon.discountValue);
    } else {
        discount =
            subtotal *
            (Number(coupon.discountValue) / 100);
    }

    if (
        coupon.maximumDiscount &&
        discount >
        Number(coupon.maximumDiscount)
    ) {
        discount = Number(coupon.maximumDiscount);
    }

    if (discount > subtotal) {
        discount = subtotal;
    }

    return {
        valid: true,
        couponId: coupon.id,
        code: coupon.code,
        discount,
        finalAmount: subtotal - discount,
    };
}