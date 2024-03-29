import {GetStaticProps} from "next";
import Link from 'next/link'
import Head from 'next/head'
import { getPrismicClient } from '../../../services/prismic'
import {RichText} from "prismic-dom";

import styles from '../post.module.scss'
import {useSession} from "next-auth/client";
import {useRouter} from "next/router";
import {useEffect} from "react";

interface PostPreviewProps {
  post: {
    slug: string;
    title: string;
    content: string;
    execerpt: string;
    updatedAt: string;
  }
}

export default function PostPreview ({ post }: PostPreviewProps) {
  const [session] = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session?.activeSubscription) {
      router.push(`/posts/${post.slug}`)
    }
  }, [session])

  return (
    <>
      <Head>
        <title>{ post.title } | ignews</title>
      </Head>

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div
            className={`${styles.postContent} ${styles.previewContent}`}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className={styles.continueReading}>
            Quer continuar lendo?
            <Link href="/">
              <a>Inscrever-se agora 🤗</a>
            </Link>
          </div>
        </article>
      </main>
    </>
  )
}

export const getStaticPaths = () => {
  return {
    paths: [],
      fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params


  const prismic = getPrismicClient()

  const response = await prismic.getByUID('publication', String(slug), {})

  const post = {
    slug,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content.slice(0, 3)),
    updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  return {
    props: {
      post,
    },
    revalidate: 60 * 30 //30 minutes
  }
}

