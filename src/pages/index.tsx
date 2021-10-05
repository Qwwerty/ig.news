import {GetServerSideProps} from 'next'
import Head from 'next/head'
import { SubscriptionButton } from '../components/SubscriptionButton'
import { stripe } from '../services/stripe'

import styles from './home.module.scss'
import {getSession, useSession} from "next-auth/client";

interface HomeProps {
  product: {
    priceId: string;
    amount: number;
  },
  activeSubscription: boolean
}

export default function Home({ product, activeSubscription }: HomeProps) {
  return (
    <>
      <Head>
        <title>Inicio | ig.news</title>
      </Head>

      <main className={`${styles.contentContainer} animate__animated animate__backInLeft`}>
        <section className={styles.hero}>
          <span>👏🏻 Olá, bem-vindo</span>
          <h1>Notícias sobre o mundo <span>React</span>.</h1>
          { !activeSubscription && (
            <p>
              Tenha acesso a todas as publicações <br/>
              <span>Por { product.amount } ao mês</span>
            </p>
          )}

          { !activeSubscription && <SubscriptionButton /> }
        </section>

        <img src="/images/avatar.svg" alt="Menina codando" />
      </main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req })

  const price = await stripe.prices.retrieve('price_1JbYhtCramiwGkN3ZtpfNiMD')

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price.unit_amount / 100),
  }
  
  if (session?.activeSubscription) {
    if (session.activeSubscription != null) {
      return {
        props: {
          product,
          activeSubscription: true
        },
      }
    }
  }

  return {
    props: {
      product,
      activeSubscription: false
    },
  }
}