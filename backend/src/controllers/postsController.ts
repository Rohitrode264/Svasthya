import type { Request, Response } from "express";
import prisma from "../prisma/client.js";

export async function createPost(req: Request, res: Response) {
    try {
        const { title, body, userAlias, tags } = req.body ?? {};
        const user = (req as any).user as { id: string } | undefined;

        if (!user?.id) return res.status(401).json({ error: "Unauthorized" });
        if (!title || !body) {
            return res.status(400).json({ error: "title and body are required" });
        }

        if (!Array.isArray(tags) || tags.length === 0) {
            return res.status(400).json({ error: "At least one tag is required" });
        }

        const normalizedTags = tags
            .filter(tag => typeof tag === 'string' && tag.trim().length > 0)
            .map(tag => tag.toLowerCase().trim());

        if (normalizedTags.length === 0) {
            return res.status(400).json({ error: "At least one valid tag is required" });
        }

        const post = await prisma.post.create({
            data: {
                userId: user.id,
                title,
                body,
                userAlias: userAlias ?? "Anonymous",
                tags: {
                    create: normalizedTags.map(tagName => ({
                        tag: {
                            connectOrCreate: {
                                where: { name: tagName },
                                create: {
                                    name: tagName,
                                    official: false,
                                    createdBy: user.id
                                }
                            }
                        }
                    }))
                }
            },
            include: {
                tags: {
                    include: {
                        tag: true
                    }
                },
                _count: {
                    select: { comments: true }
                }
            }
        });

        const postWithVoteStatus = {
            ...post,
            userHasUpvoted: false
        };

        return res.status(201).json(postWithVoteStatus);
    } catch (error) {
        console.error('Error creating post:', error);
        return res.status(500).json({ error: "Failed to create post" });
    }
}

export async function getPostById(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const user = (req as any).user as { id: string } | undefined;

        if (!id) return res.status(400).json({ error: "id is required" });

        const post = await prisma.post.findUnique({
            where: { id },
            include: {
                comments: { orderBy: { createdAt: "asc" } },
                tags: {
                    include: {
                        tag: true
                    }
                },
                votes: user ? {
                    where: { userId: user.id }
                } : false,
            },
        });

        if (!post) return res.status(404).json({ error: "Post not found" });

        const postWithVoteStatus = {
            ...post,
            userHasUpvoted: user ? post.votes.length > 0 : false,
        };

        return res.json(postWithVoteStatus);
    } catch (error) {
        return res.status(500).json({ error: "Failed to fetch post" });
    }
}

export async function getPosts(req: Request, res: Response) {
    try {
        const { tag, tags, search, limit = '20', offset = '0' } = req.query;
        const user = (req as any).user as { id: string } | undefined;

        const where: any = {};

        if (tag && typeof tag === 'string') {
            where.tags = {
                some: {
                    tag: {
                        name: tag.toLowerCase()
                    }
                }
            };
        }

        if (tags && typeof tags === 'string') {
            const tagNames = tags.split(',').map(t => t.toLowerCase().trim());
            where.tags = {
                some: {
                    tag: {
                        name: {
                            in: tagNames
                        }
                    }
                }
            };
        }

        if (search && typeof search === 'string') {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { body: { contains: search, mode: 'insensitive' } }
            ];
        }

        const posts = await prisma.post.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: parseInt(limit as string),
            skip: parseInt(offset as string),
            include: {
                tags: {
                    include: {
                        tag: true
                    }
                },
                votes: user ? {
                    where: { userId: user.id }
                } : false,
                _count: {
                    select: { comments: true }
                }
            }
        });

        const postsWithVoteStatus = posts.map(post => ({
            ...post,
            userHasUpvoted: user ? post.votes.length > 0 : false,
        }));

        return res.json(postsWithVoteStatus);
    } catch (error) {
        console.error('Error fetching posts:', error);
        return res.status(500).json({ error: "Failed to fetch posts" });
    }
}

export async function addComment(req: Request, res: Response) {
    try {
        const { id } = req.params; 
        if (!id) return res.status(400).json({ error: "id is required" });
        const { body, userAlias } = req.body ?? {};
        const user = (req as any).user as { id: string } | undefined;
        if (!user?.id) return res.status(401).json({ error: "Unauthorized" });
        if (!body) return res.status(400).json({ error: "body is required" });

        const post = await prisma.post.findUnique({ where: { id } });
        if (!post) return res.status(404).json({ error: "Post not found" });

        const comment = await prisma.comment.create({
            data: {
                postId: id,
                userId: user.id,
                userAlias: userAlias ?? "Anonymous",
                body,
            },
        });
        return res.status(201).json(comment);
    } catch (error) {
        return res.status(500).json({ error: "Failed to add comment" });
    }
}

export async function upvotePost(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const user = (req as any).user as { id: string } | undefined;

        if (!id) return res.status(400).json({ error: "Post ID is required" });
        if (!user?.id) return res.status(401).json({ error: "Unauthorized" });

        const post = await prisma.post.findUnique({
            where: { id },
            include: {
                votes: {
                    where: { userId: user.id }
                }
            }
        });

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        const existingVote = post.votes.find(vote => vote.userId === user.id);

        if (existingVote) {
            await prisma.$transaction([
                prisma.postVote.delete({
                    where: { id: existingVote.id }
                }),
                prisma.post.update({
                    where: { id },
                    data: { upvotes: { decrement: 1 } }
                })
            ]);

            const updatedPost = await prisma.post.findUnique({
                where: { id },
                include: {
                    tags: {
                        include: {
                            tag: true
                        }
                    },
                    _count: {
                        select: { comments: true }
                    }
                }
            });

            return res.json({
                ...updatedPost,
                userHasUpvoted: false
            });
        } else {
            await prisma.$transaction([
                prisma.postVote.create({
                    data: {
                        postId: id,
                        userId: user.id
                    }
                }),
                prisma.post.update({
                    where: { id },
                    data: { upvotes: { increment: 1 } }
                })
            ]);

            const updatedPost = await prisma.post.findUnique({
                where: { id },
                include: {
                    tags: {
                        include: {
                            tag: true
                        }
                    },
                    _count: {
                        select: { comments: true }
                    }
                }
            });

            return res.json({
                ...updatedPost,
                userHasUpvoted: true
            });
        }
    } catch (error: any) {
        console.error('Error upvoting post:', error);
        if (error?.code === "P2025") {
            return res.status(404).json({ error: "Post not found" });
        }
        if (error?.code === "P2002") {
            return res.status(409).json({ error: "You have already upvoted this post" });
        }
        return res.status(500).json({ error: "Failed to upvote post" });
    }
}

export async function createPostNoAuth(req: Request, res: Response) {
  try {
    let postsData = req.body;

    if (!Array.isArray(postsData)) {
      postsData = [postsData];
    }

    if (postsData.length === 0) {
      return res.status(400).json({ error: "No post data provided." });
    }

    const createdPosts = [];

    for (const post of postsData) {
      const { userId, title, body, userAlias, tags } = post ?? {};

      if (!userId) {
        console.warn(`Skipping post (missing userId):`, post);
        continue;
      }
      if (!title || !body) {
        console.warn(`Skipping post (missing title/body):`, post);
        continue;
      }

      const normalizedTags = Array.isArray(tags)
        ? tags
            .filter((tag) => typeof tag === "string" && tag.trim().length > 0)
            .map((tag) => tag.toLowerCase().trim())
        : [];

      const created = await prisma.post.create({
        data: {
          userId,
          title,
          body,
          userAlias: userAlias ?? "Anonymous",
          tags: {
            create: normalizedTags.map((tagName) => ({
              tag: {
                connectOrCreate: {
                  where: { name: tagName },
                  create: {
                    name: tagName,
                    official: false,
                    createdBy: userId,
                  },
                },
              },
            })),
          },
        },
        include: {
          tags: { include: { tag: true } },
          _count: { select: { comments: true } },
        },
      });

      createdPosts.push({
        ...created,
        userHasUpvoted: false,
      });
    }

    if (createdPosts.length === 0) {
      return res.status(400).json({ error: "No valid posts were created." });
    }

    return res.status(201).json({
      message: `Successfully created ${createdPosts.length} post(s).`,
      posts: createdPosts,
    });
  } catch (error) {
    console.error("Error creating posts (no-auth):", error);
    return res.status(500).json({ error: "Failed to create posts." });
  }
}
