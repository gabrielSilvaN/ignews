import Prismic from "@prismicio/client";
import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { RichText } from "prismic-dom";
import React from "react";
import { getPrismicClient } from "../../services/prismic";
import styles from "./styles.module.scss";

interface Post {
  slug: string;
  title: string;
  excerpt: string;
  updatedAt: string;
}

interface PostsProps {
  posts: Post[];
}

const Posts: React.FC<PostsProps> = ({ posts }) => {
  return (
    <>
      <Head>
        <title>Posts | Ignews</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          {posts?.map(({ excerpt, slug, title, updatedAt }) => (
            <Link href={`/posts/${slug}`} key={slug}>
              <a>
                <time>{updatedAt}</time>
                <strong>{title}</strong>
                <p>{excerpt}</p>
              </a>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
};

export default Posts;

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const response = await prismic.query(
    [Prismic.predicates.at("document.type", "post")],
    {
      fetch: ["post.title", "post.content"],
      pageSize: 100,
    }
  );

  const posts = response.results.map((post) => ({
    slug: post.uid,
    title: RichText.asText(post.data.title),
    excerpt:
      post.data.content.find((content: any) => content.type === "paragraph")
        ?.text ?? "",
    updatedAt: new Date(post.last_publication_date ?? "").toLocaleDateString(
      "pt-BR",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    ),
  }));

  return {
    props: {
      posts,
    },
  };
};
