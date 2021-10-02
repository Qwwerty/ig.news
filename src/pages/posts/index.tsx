import Head from 'next/head'
import styles from './styles.module.scss'
import {GetStaticProps} from "next";
import {getPrismicClient} from "../../services/prismic";
import Prismic from "@prismicio/client";
import { RichText } from 'prismic-dom'

interface Post {
  slug: string;
  title: string;
  execerpt: string;
  updatedAt: string;
}

interface PostsProps {
  posts: Post[];
}

export default function Posts({ posts }: PostsProps) {
  return (
    <>
      <Head>
        <title>Publicações | Ignews</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          { posts.map(post => (
            <a href="#" key={post.slug}>
              <time>{ post.updatedAt }</time>
              <strong>{ post.title }</strong>
              <p>{ post.execerpt }</p>
            </a>
          ))}
        </div>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient()

  const response = await prismic.query(
    [Prismic.predicates.at('document.type', 'publication')], {
      fetch: ['publication.title', 'publication.content'],
      pageSize: 10
    }
  )

  const posts = response.results.map(post => {
    return {
      slug: post.id,
      title: RichText.asText(post.data.title),
      execerpt: post.data.content.find(content => content.type === 'paragraph')?.text ?? '',
      updatedAt: new Date(post.last_publication_date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    }
  })

  return {
    props: {
      posts
    }
  }
}