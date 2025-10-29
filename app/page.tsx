import { sortPosts, allCoreContent } from "pliny/utils/contentlayer";
import { allBlogs } from "contentlayer/generated";
import Main from "./Main";

export default async function Page() {
  const sortedPosts = sortPosts(allBlogs).sort((a, b) => {
    const ap = a.pinned ? 1 : 0;
    const bp = b.pinned ? 1 : 0;
    if (ap !== bp) return bp - ap;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  const posts = allCoreContent(sortedPosts).map((p) => ({
    ...p,
    pinned: sortedPosts.find((b) => b._raw.flattenedPath === p.path)?.pinned ?? false,
  }));
  return <Main posts={posts} />;
}
