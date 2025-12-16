import { Link } from "@/i18n/routing";
import Image from "next/image";
import Tag from "@/components/Tag";
import siteMetadata from "@/data/siteMetadata";
import { formatDate } from "pliny/utils/formatDate";
import NewsletterForm from "pliny/ui/NewsletterForm";

const MAX_DISPLAY = 10;

export default function Home({ posts }) {
	return (
		<>
			<div>
				<div className="space-y-2 pt-6 pb-8 md:space-y-5">
					<h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-5xl md:leading-14 dark:text-gray-100">
						Web & Discord Bot Developer
					</h1>
					<p className="text-lg leading-7 text-gray-500 dark:text-gray-400">{siteMetadata.description}</p>
				</div>
				{/* Featured latest post */}
				{posts.length > 0 && (
					<div className="mb-8 rounded-xl border border-gray-200 p-4 shadow-sm dark:border-gray-800">
						<div className="grid gap-6 md:grid-cols-5">
							<div className="md:col-span-3">
								{posts[0].images?.[0] && (
									<div className="relative w-full overflow-hidden rounded-lg">
										<div className="relative aspect-16/9 w-full">
											<Image
												src={posts[0].images[0]}
												alt={posts[0].title}
												fill
												sizes="(max-width: 1280px) 100vw, 1280px"
												className="h-full w-full object-cover"
												priority
											/>
										</div>
									</div>
								)}
							</div>
							<div className="flex flex-col justify-center md:col-span-2">
								<div className="text-primary-500 mb-2 text-sm font-medium">Latest writing</div>
								<h2 className="mb-2 text-2xl leading-8 font-bold tracking-tight text-gray-900 dark:text-gray-100">
									<Link href={`/blog/${posts[0].slug}`}>{posts[0].title}</Link>
								</h2>
								<div className="mb-3 text-sm text-gray-500 dark:text-gray-400">
									{formatDate(posts[0].date, siteMetadata.locale)}
								</div>
								{posts[0].summary && (
									<p className="line-clamp-3 text-gray-600 dark:text-gray-300">{posts[0].summary}</p>
								)}
								<div className="mt-4">
									<Link
										href={`/blog/${posts[0].slug}`}
										className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
										aria-label={`Read more: "${posts[0].title}"`}
									>
										Read more →
									</Link>
								</div>
							</div>
						</div>
					</div>
				)}

				<ul className="divide-y divide-gray-200 dark:divide-gray-700">
					{!posts.length && "No posts found."}
					{posts.slice(1, MAX_DISPLAY).map((post) => {
						const { slug, date, title, summary, tags } = post;
						return (
							<li key={slug} className="py-12">
								<article>
									<div className="space-y-2 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0">
										<dl>
											<dt className="sr-only">Published on</dt>
											<dd className="text-base leading-6 font-medium text-gray-500 dark:text-gray-400">
												<time dateTime={date}>{formatDate(date, siteMetadata.locale)}</time>
											</dd>
										</dl>
										<div className="space-y-5 xl:col-span-3">
											<div className="space-y-6">
												<div>
													<h2 className="text-2xl leading-8 font-bold tracking-tight">
														<Link
															href={`/blog/${slug}`}
															className="text-gray-900 dark:text-gray-100"
														>
															{title}
														</Link>
													</h2>
													<div className="flex flex-wrap items-center gap-2">
														{post.pinned && (
															<span className="mr-3 inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-semibold text-yellow-800 ring-1 ring-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-200 dark:ring-yellow-800/60">
																Pinned
															</span>
														)}
														{tags.map((tag) => (
															<Tag key={tag} text={tag} />
														))}
													</div>
												</div>
												<div className="prose max-w-none text-gray-500 dark:text-gray-400">
													{summary}
												</div>
											</div>
											<div className="text-base leading-6 font-medium">
												<Link
													href={`/blog/${slug}`}
													className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
													aria-label={`Read more: "${title}"`}
												>
													Read more &rarr;
												</Link>
											</div>
										</div>
									</div>
								</article>
							</li>
						);
					})}
				</ul>
			</div>
			{posts.length > MAX_DISPLAY && (
				<div className="flex justify-end text-base leading-6 font-medium">
					<Link
						href="/blog"
						className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
						aria-label="All posts"
					>
						All Posts &rarr;
					</Link>
				</div>
			)}
			{siteMetadata.newsletter?.provider && (
				<div className="flex items-center justify-center pt-4">
					<NewsletterForm />
				</div>
			)}
		</>
	);
}
