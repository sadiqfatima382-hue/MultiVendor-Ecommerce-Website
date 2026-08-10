import { createBlogPost, findBlogPostById, findBlogPostBySlug, findBlogPosts, countBlogPosts, updateBlogPost, deleteBlogPost, } from "../repositories/blogPost.repository.js";
import { uploadImageToCloudinary, deleteImageFromCloudinary, } from "../utils/cloudinary.js";
import { getPagination } from "../utils/pagination.js";
import { generateSlug } from "../utils/slug.js";

// =====================================================
// CREATE BLOG POST
// =====================================================

export async function createBlogPostService(
    data,
    file
) {
    const {
        title,
        excerpt,
        content,
        authorId,
        isPublished = false,
        isFeatured = false,
        publishedAt,
    } = data;

    if (!title?.trim()) {
        throw new Error(
            "Blog post title is required."
        );
    }

    if (!content?.trim()) {
        throw new Error(
            "Blog post content is required."
        );
    }

    // ---------------------------------------------------
    // Generate slug
    // ---------------------------------------------------

    const baseSlug =
        generateSlug(title);

    let slug = baseSlug;

    let counter = 1;

    while (
        await findBlogPostBySlug(slug)
    ) {
        slug = `${baseSlug}-${counter}`;
        counter++;
    }

    // ---------------------------------------------------
    // Upload featured image
    // ---------------------------------------------------

    let imageUrl;
    let imagePublicId;

    if (file) {
        const uploaded =
            await uploadImageToCloudinary(
                file.buffer,
                "blog"
            );

        imageUrl = uploaded.secure_url;
        imagePublicId = uploaded.public_id;
    }

    // ---------------------------------------------------
    // Publishing logic
    // ---------------------------------------------------

    const published =
        isPublished === true ||
        isPublished === "true";

    let finalPublishedAt =
        publishedAt
            ? new Date(publishedAt)
            : null;

    if (published && !finalPublishedAt) {
        finalPublishedAt = new Date();
    }

    if (!published) {
        finalPublishedAt = null;
    }

    return createBlogPost({
        title: title.trim(),

        slug,

        excerpt:
            excerpt?.trim() || null,

        content,

        featuredImageUrl:
            imageUrl || null,

        featuredImagePublicId:
            imagePublicId || null,

        authorId:
            authorId || null,

        isPublished: published,

        isFeatured:
            isFeatured === true ||
            isFeatured === "true",

        publishedAt:
            finalPublishedAt,
    });
}


// =====================================================
// GET BLOG POSTS
// =====================================================

export async function getBlogPostsService({
    page = 1,
    limit = 10,
    search,
    isPublished,
    isFeatured,
    publicOnly = false,
}) {
    const { skip, take } =
        getPagination(page, limit);

    const where = {};

    // ---------------------------------------------------
    // Search
    // ---------------------------------------------------

    if (search) {
        where.OR = [
            {
                title: {
                    contains: search,
                    mode: "insensitive",
                },
            },
            {
                excerpt: {
                    contains: search,
                    mode: "insensitive",
                },
            },
            {
                content: {
                    contains: search,
                    mode: "insensitive",
                },
            },
        ];
    }

    // ---------------------------------------------------
    // Published filter
    // ---------------------------------------------------

    if (publicOnly) {
        where.isPublished = true;
    } else if (
        isPublished !== undefined
    ) {
        where.isPublished =
            isPublished === true ||
            isPublished === "true";
    }

    // ---------------------------------------------------
    // Featured filter
    // ---------------------------------------------------

    if (isFeatured !== undefined) {
        where.isFeatured =
            isFeatured === true ||
            isFeatured === "true";
    }

    const [
        posts,
        total,
    ] = await Promise.all([
        findBlogPosts({
            skip,
            take,
            where,

            orderBy: {
                createdAt: "desc",
            },
        }),

        countBlogPosts(where),
    ]);

    return {
        posts,

        pagination: {
            page: Number(page),
            limit: Number(limit),
            total,

            totalPages:
                Math.ceil(
                    total / Number(limit)
                ),
        },
    };
}


// =====================================================
// GET BLOG POST BY ID
// =====================================================

export async function getBlogPostByIdService(
    id,
    publicOnly = false
) {
    const post =
        await findBlogPostById(id);

    if (!post) {
        throw new Error(
            "Blog post not found."
        );
    }

    if (
        publicOnly &&
        !post.isPublished
    ) {
        throw new Error(
            "Blog post not found."
        );
    }

    return post;
}


// =====================================================
// GET BLOG POST BY SLUG
// =====================================================

export async function getBlogPostBySlugService(
    slug,
    publicOnly = true
) {
    const post =
        await findBlogPostBySlug(slug);

    if (!post) {
        throw new Error(
            "Blog post not found."
        );
    }

    if (
        publicOnly &&
        !post.isPublished
    ) {
        throw new Error(
            "Blog post not found."
        );
    }

    return post;
}


// =====================================================
// UPDATE BLOG POST
// =====================================================

export async function updateBlogPostService(
    id,
    data,
    file
) {
    const existing =
        await findBlogPostById(id);

    if (!existing) {
        throw new Error(
            "Blog post not found."
        );
    }

    const updateData = {};

    // ---------------------------------------------------
    // TITLE / SLUG
    // ---------------------------------------------------

    if (data.title !== undefined) {
        const title =
            data.title.trim();

        if (!title) {
            throw new Error(
                "Blog post title cannot be empty."
            );
        }

        updateData.title = title;

        // Generate a new slug only
        // when title changes.

        if (
            title !== existing.title
        ) {
            const baseSlug =
                generateSlug(title);

            let slug = baseSlug;

            let counter = 1;

            while (true) {
                const duplicate =
                    await findBlogPostBySlug(
                        slug
                    );

                if (
                    !duplicate ||
                    duplicate.id === id
                ) {
                    break;
                }

                slug =
                    `${baseSlug}-${counter}`;

                counter++;
            }

            updateData.slug = slug;
        }
    }

    // ---------------------------------------------------
    // CONTENT
    // ---------------------------------------------------

    if (data.content !== undefined) {
        if (!data.content.trim()) {
            throw new Error(
                "Blog post content cannot be empty."
            );
        }

        updateData.content =
            data.content;
    }

    // ---------------------------------------------------
    // EXCERPT
    // ---------------------------------------------------

    if (data.excerpt !== undefined) {
        updateData.excerpt =
            data.excerpt?.trim() || null;
    }

    // ---------------------------------------------------
    // AUTHOR
    // ---------------------------------------------------

    if (data.authorId !== undefined) {
        updateData.authorId =
            data.authorId || null;
    }

    // ---------------------------------------------------
    // PUBLISH STATUS
    // ---------------------------------------------------

    if (
        data.isPublished !== undefined
    ) {
        const published =
            data.isPublished === true ||
            data.isPublished === "true";

        updateData.isPublished =
            published;

        if (published) {
            updateData.publishedAt =
                data.publishedAt
                    ? new Date(
                        data.publishedAt
                    )
                    : existing.publishedAt ||
                    new Date();
        } else {
            updateData.publishedAt =
                null;
        }
    } else if (
        data.publishedAt !== undefined
    ) {
        updateData.publishedAt =
            data.publishedAt
                ? new Date(
                    data.publishedAt
                )
                : null;
    }

    // ---------------------------------------------------
    // FEATURED
    // ---------------------------------------------------

    if (
        data.isFeatured !== undefined
    ) {
        updateData.isFeatured =
            data.isFeatured === true ||
            data.isFeatured === "true";
    }

    // ---------------------------------------------------
    // REPLACE IMAGE
    // ---------------------------------------------------

    if (file) {
        const uploaded =
            await uploadImageToCloudinary(
                file.buffer,
                "blog"
            );

        updateData.featuredImageUrl =
            uploaded.secure_url;

        updateData.featuredImagePublicId =
            uploaded.public_id;

        // Delete old image after
        // successful upload.

        if (
            existing.featuredImagePublicId
        ) {
            try {
                await deleteImageFromCloudinary(
                    existing.featuredImagePublicId
                );
            } catch (error) {
                console.error(
                    "Failed to delete old blog image:",
                    error.message
                );
            }
        }
    }

    return updateBlogPost(
        id,
        updateData
    );
}


// =====================================================
// PUBLISH
// =====================================================

export async function publishBlogPostService(
    id
) {
    const existing =
        await findBlogPostById(id);

    if (!existing) {
        throw new Error(
            "Blog post not found."
        );
    }

    if (existing.isPublished) {
        throw new Error(
            "Blog post is already published."
        );
    }

    return updateBlogPost(
        id,
        {
            isPublished: true,
            publishedAt: new Date(),
        }
    );
}


// =====================================================
// UNPUBLISH
// =====================================================

export async function unpublishBlogPostService(
    id
) {
    const existing =
        await findBlogPostById(id);

    if (!existing) {
        throw new Error(
            "Blog post not found."
        );
    }

    if (!existing.isPublished) {
        throw new Error(
            "Blog post is already unpublished."
        );
    }

    return updateBlogPost(
        id,
        {
            isPublished: false,
            publishedAt: null,
        }
    );
}


// =====================================================
// FEATURE / UNFEATURE
// =====================================================

export async function setFeaturedBlogPostService(
    id,
    isFeatured
) {
    const existing =
        await findBlogPostById(id);

    if (!existing) {
        throw new Error(
            "Blog post not found."
        );
    }

    return updateBlogPost(
        id,
        {
            isFeatured,
        }
    );
}


// =====================================================
// DELETE
// =====================================================

export async function deleteBlogPostService(
    id
) {
    const existing =
        await findBlogPostById(id);

    if (!existing) {
        throw new Error(
            "Blog post not found."
        );
    }

    // ---------------------------------------------------
    // Delete Cloudinary image
    // ---------------------------------------------------

    if (
        existing.featuredImagePublicId
    ) {
        try {
            await deleteImageFromCloudinary(
                existing.featuredImagePublicId
            );
        } catch (error) {
            console.error(
                "Failed to delete blog image:",
                error.message
            );
        }
    }

    return deleteBlogPost(id);
}